import { findById, findClassById, getRulesetById, type CatalogEntry, type RulesetRecord } from "../catalog.js";
import type { CharacterDraft, CharacterIssue } from "../contracts.js";
import { createDefaultDraft, deriveCharacter } from "../engine/rulesEngine.js";
import { validateCharacter } from "../engine/validators.js";
import { normalizeDraft } from "../io/draftIO.js";
import {
  getBuilderStepForField,
  type AppliedField,
  type BuilderStepId,
  type CharacterAssistSynthesisResult,
  type CharacterDraftPatch,
  type CharacterIntent,
  type UnresolvedQuestion
} from "./contracts.js";
import {
  findCatalogEntry,
  normalizeLookupValue,
  resolveAbilityMethod,
  resolveAlignment,
  resolveCatalogEntries,
  resolveRulesetQuery,
  resolveSubclass
} from "./resolvers.js";

function uniqueQuestions(questions: UnresolvedQuestion[]) {
  const seen = new Set<string>();
  const unique: UnresolvedQuestion[] = [];
  for (const question of questions) {
    const key = `${question.field || ""}:${normalizeLookupValue(question.prompt)}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(question);
  }
  return unique;
}

function questionId(field: string, suffix: string) {
  return `${field}-${normalizeLookupValue(suffix).replace(/\s+/g, "-") || "clarify"}`;
}

function makeQuestion(
  stepId: BuilderStepId,
  prompt: string,
  reason: string,
  field?: string,
  options?: string[]
): UnresolvedQuestion {
  return {
    id: questionId(field || stepId, prompt),
    stepId,
    prompt,
    reason,
    field,
    options: options?.filter(Boolean)
  };
}

function resolveExperienceMode(value: string | undefined) {
  if (!value?.trim()) {
    return null;
  }
  const normalized = normalizeLookupValue(value);
  if (["new", "new player", "beginner", "guided", "first timer", "first-time"].includes(normalized)) {
    return "new" as const;
  }
  if (["experienced", "expert", "advanced", "veteran"].includes(normalized)) {
    return "experienced" as const;
  }
  return null;
}

function summarizeNames(values: string[]) {
  if (values.length === 0) {
    return "none";
  }
  if (values.length <= 4) {
    return values.join(", ");
  }
  return `${values.slice(0, 4).join(", ")} +${values.length - 4} more`;
}

function findEntryName<T extends CatalogEntry>(collection: T[], id: string) {
  return findById(collection, id)?.name ?? id;
}

function buildSkillNameMap(ruleset: RulesetRecord, skillRanks: CharacterDraft["skillRanks"]) {
  return Object.entries(skillRanks)
    .filter(([, rank]) => Number(rank) > 0)
    .map(([skillId, rank]) => `${findEntryName(ruleset.skills, skillId)} ${rank}`);
}

function buildAppliedFieldSummary(field: string, preview: CharacterDraft, ruleset: RulesetRecord) {
  switch (field) {
    case "rulesetId":
      return `Ruleset -> ${ruleset.shortName}`;
    case "experienceMode":
      return `Experience -> ${preview.experienceMode}`;
    case "name":
      return `Character name -> ${preview.name || "Unnamed"}`;
    case "playerName":
      return `Player name -> ${preview.playerName || "Unspecified"}`;
    case "level":
      return `Level -> ${preview.level}`;
    case "alignment":
      return `Alignment -> ${preview.alignment || "Unspecified"}`;
    case "backgroundId":
      return `Background -> ${findEntryName(ruleset.backgrounds, preview.backgroundId)}`;
    case "speciesId":
      return `Species -> ${findEntryName(ruleset.species, preview.speciesId)}`;
    case "classId":
      return `Class -> ${findEntryName(ruleset.classes, preview.classId)}`;
    case "subclassId": {
      const characterClass = findClassById(ruleset, preview.classId);
      return `Subclass -> ${findById(characterClass?.subclasses, preview.subclassId)?.name || "None"}`;
    }
    case "notes":
      return `Notes -> ${preview.notes ? preview.notes.slice(0, 48) : "Cleared"}`;
    case "abilityMethodId": {
      const method = ruleset.abilityMethods.find((entry) => entry.id === preview.abilityMethodId);
      return `Ability method -> ${method?.name || preview.abilityMethodId}`;
    }
    case "selectedSkillIds":
      return `Skills -> ${summarizeNames(preview.selectedSkillIds.map((skillId) => findEntryName(ruleset.skills, skillId)))}`;
    case "skillRanks":
      return `Skill ranks -> ${summarizeNames(buildSkillNameMap(ruleset, preview.skillRanks))}`;
    case "selectedFeatIds":
      return `Feats -> ${summarizeNames(preview.selectedFeatIds.map((featId) => findEntryName(ruleset.feats, featId)))}`;
    case "selectedSpellIds":
      return `Spells -> ${summarizeNames(preview.selectedSpellIds.map((spellId) => findEntryName(ruleset.spells, spellId)))}`;
    case "selectedItemIds":
      return `Items -> ${summarizeNames(preview.selectedItemIds.map((itemId) => findEntryName(ruleset.items, itemId)))}`;
    default:
      if (field.startsWith("assignedScores.")) {
        const abilityKey = field.split(".")[1] as keyof CharacterDraft["assignedScores"];
        return `${abilityKey.toUpperCase()} -> ${preview.assignedScores[abilityKey]}`;
      }
      return `${field} updated`;
  }
}

function isSameScalar(left: unknown, right: unknown) {
  return left === right;
}

function sortList(values: string[]) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function isSameArray(left: string[], right: string[]) {
  return JSON.stringify(sortList(left)) === JSON.stringify(sortList(right));
}

function normalizeSkillRankEntries(skillRanks: CharacterDraft["skillRanks"]) {
  return Object.entries(skillRanks).sort(([left], [right]) => left.localeCompare(right));
}

function isSameSkillRanks(left: CharacterDraft["skillRanks"], right: CharacterDraft["skillRanks"]) {
  return JSON.stringify(normalizeSkillRankEntries(left)) === JSON.stringify(normalizeSkillRankEntries(right));
}

function buildAppliedFields(currentDraft: CharacterDraft, previewDraft: CharacterDraft, ruleset: RulesetRecord) {
  const fields: AppliedField[] = [];

  const maybePush = (field: string, changed: boolean, label: string) => {
    if (!changed) {
      return;
    }
    fields.push({
      field,
      label,
      stepId: getBuilderStepForField(field),
      summary: buildAppliedFieldSummary(field, previewDraft, ruleset)
    });
  };

  maybePush("rulesetId", !isSameScalar(currentDraft.rulesetId, previewDraft.rulesetId), "Ruleset");
  maybePush("experienceMode", !isSameScalar(currentDraft.experienceMode, previewDraft.experienceMode), "Experience mode");
  maybePush("name", !isSameScalar(currentDraft.name, previewDraft.name), "Character name");
  maybePush("playerName", !isSameScalar(currentDraft.playerName, previewDraft.playerName), "Player name");
  maybePush("level", !isSameScalar(currentDraft.level, previewDraft.level), "Level");
  maybePush("alignment", !isSameScalar(currentDraft.alignment, previewDraft.alignment), "Alignment");
  maybePush("backgroundId", !isSameScalar(currentDraft.backgroundId, previewDraft.backgroundId), "Background");
  maybePush("speciesId", !isSameScalar(currentDraft.speciesId, previewDraft.speciesId), "Species");
  maybePush("classId", !isSameScalar(currentDraft.classId, previewDraft.classId), "Class");
  maybePush("subclassId", !isSameScalar(currentDraft.subclassId, previewDraft.subclassId), "Subclass");
  maybePush("notes", !isSameScalar(currentDraft.notes, previewDraft.notes), "Notes");
  maybePush("abilityMethodId", !isSameScalar(currentDraft.abilityMethodId, previewDraft.abilityMethodId), "Ability method");

  for (const abilityKey of Object.keys(previewDraft.assignedScores) as Array<keyof CharacterDraft["assignedScores"]>) {
    maybePush(
      `assignedScores.${abilityKey}`,
      !isSameScalar(currentDraft.assignedScores[abilityKey], previewDraft.assignedScores[abilityKey]),
      `${abilityKey.toUpperCase()} score`
    );
  }

  maybePush("selectedSkillIds", !isSameArray(currentDraft.selectedSkillIds, previewDraft.selectedSkillIds), "Skill choices");
  maybePush("skillRanks", !isSameSkillRanks(currentDraft.skillRanks, previewDraft.skillRanks), "Skill ranks");
  maybePush("selectedFeatIds", !isSameArray(currentDraft.selectedFeatIds, previewDraft.selectedFeatIds), "Feat choices");
  maybePush("selectedSpellIds", !isSameArray(currentDraft.selectedSpellIds, previewDraft.selectedSpellIds), "Spell choices");
  maybePush("selectedItemIds", !isSameArray(currentDraft.selectedItemIds, previewDraft.selectedItemIds), "Item choices");

  return fields.sort((left, right) => left.stepId.localeCompare(right.stepId) || left.label.localeCompare(right.label));
}

function addArrayValueQuestion(
  questions: UnresolvedQuestion[],
  value: string,
  stepId: BuilderStepId,
  field: string,
  label: string,
  suggestions: string[]
) {
  questions.push(
    makeQuestion(
      stepId,
      `I could not map "${value}" to a legal ${label}.`,
      `The requested ${label} was not found in the active ruleset catalog.`,
      field,
      suggestions
    )
  );
}

function mapValidationIssueToQuestion(
  issue: CharacterIssue,
  ruleset: RulesetRecord,
  activeStep?: BuilderStepId
): UnresolvedQuestion | null {
  switch (issue.code) {
    case "character.name.required":
      return makeQuestion("identity", "What is the character's name?", issue.message, "name");
    case "character.class.required":
      return makeQuestion("identity", "Choose a class for this character.", issue.message, "classId", ruleset.classes.map((entry) => entry.name).slice(0, 6));
    case "character.species.required":
      return makeQuestion("identity", "Choose a species or race.", issue.message, "speciesId", ruleset.species.map((entry) => entry.name).slice(0, 6));
    case "character.background.required":
      return makeQuestion("identity", "Choose a background.", issue.message, "backgroundId", ruleset.backgrounds.map((entry) => entry.name).slice(0, 6));
    case "item.none_selected":
      return activeStep === "gear" || activeStep === "review"
        ? makeQuestion("gear", "Pick at least one starting item or loadout.", issue.message, "selectedItemIds")
        : null;
    default:
      return null;
  }
}

function buildAssistantMessage(
  previewDraft: CharacterDraft,
  appliedFields: AppliedField[],
  unresolvedQuestions: UnresolvedQuestion[],
  issues: CharacterIssue[]
) {
  const errors = issues.filter((issue) => issue.severity === "error").length;
  const warnings = issues.filter((issue) => issue.severity === "warning").length;
  const proposalSummary = appliedFields.length
    ? `Proposed changes: ${appliedFields.slice(0, 4).map((field) => field.summary).join("; ")}.`
    : "I could not confidently change the draft from the current request.";
  const unresolvedSummary = unresolvedQuestions.length
    ? `Still need: ${unresolvedQuestions.slice(0, 2).map((question) => question.prompt).join(" ")}`
    : "No blocking follow-up questions from the assistant pass.";
  const validationSummary = errors > 0
    ? `${errors} error(s) and ${warnings} warning(s) remain in the preview.`
    : warnings > 0
      ? `${warnings} warning(s) remain in the preview.`
      : "The preview is currently valid.";

  return `${previewDraft.name || "This character"} is ready for review. ${proposalSummary} ${validationSummary} ${unresolvedSummary}`.trim();
}

function resolveCrossRulesetSelections(currentDraft: CharacterDraft, targetRulesetId: string) {
  const targetRuleset = getRulesetById(targetRulesetId);
  const currentRuleset = getRulesetById(currentDraft.rulesetId);
  const rebasedDraft = createDefaultDraft(targetRulesetId);

  rebasedDraft.name = currentDraft.name;
  rebasedDraft.playerName = currentDraft.playerName;
  rebasedDraft.level = currentDraft.level;
  rebasedDraft.experienceMode = currentDraft.experienceMode;
  rebasedDraft.notes = currentDraft.notes;
  rebasedDraft.alignment = targetRuleset.alignments.includes(currentDraft.alignment) ? currentDraft.alignment : rebasedDraft.alignment;
  rebasedDraft.abilityMethodId = targetRuleset.abilityMethods.some((entry) => entry.id === currentDraft.abilityMethodId)
    ? currentDraft.abilityMethodId
    : rebasedDraft.abilityMethodId;
  rebasedDraft.assignedScores = { ...currentDraft.assignedScores };

  const currentSpecies = findById(currentRuleset.species, currentDraft.speciesId);
  if (currentSpecies) {
    const speciesMatch = findCatalogEntry(targetRuleset.species, currentSpecies.name);
    if (speciesMatch.entry) {
      rebasedDraft.speciesId = speciesMatch.entry.id;
    }
  }

  const currentBackground = findById(currentRuleset.backgrounds, currentDraft.backgroundId);
  if (currentBackground) {
    const backgroundMatch = findCatalogEntry(targetRuleset.backgrounds, currentBackground.name);
    if (backgroundMatch.entry) {
      rebasedDraft.backgroundId = backgroundMatch.entry.id;
    }
  }

  const currentClass = findClassById(currentRuleset, currentDraft.classId);
  if (currentClass) {
    const classMatch = findCatalogEntry(targetRuleset.classes, currentClass.name);
    if (classMatch.entry) {
      rebasedDraft.classId = classMatch.entry.id;
      rebasedDraft.subclassId = classMatch.entry.subclasses[0]?.id ?? "";

      const currentSubclass = findById(currentClass.subclasses, currentDraft.subclassId);
      if (currentSubclass) {
        const subclassMatch = resolveSubclass(classMatch.entry, currentSubclass.name);
        if (subclassMatch.entry) {
          rebasedDraft.subclassId = subclassMatch.entry.id;
        }
      }
    }
  }

  rebasedDraft.selectedSkillIds = resolveCatalogEntries(
    targetRuleset.skills,
    currentDraft.selectedSkillIds.map((skillId) => findEntryName(currentRuleset.skills, skillId))
  ).ids;
  rebasedDraft.selectedFeatIds = resolveCatalogEntries(
    targetRuleset.feats,
    currentDraft.selectedFeatIds.map((featId) => findEntryName(currentRuleset.feats, featId))
  ).ids;
  rebasedDraft.selectedSpellIds = resolveCatalogEntries(
    targetRuleset.spells,
    currentDraft.selectedSpellIds.map((spellId) => findEntryName(currentRuleset.spells, spellId))
  ).ids;
  rebasedDraft.selectedItemIds = resolveCatalogEntries(
    targetRuleset.items,
    currentDraft.selectedItemIds.map((itemId) => findEntryName(currentRuleset.items, itemId))
  ).ids;

  const rebasedSkillRanks: CharacterDraft["skillRanks"] = {};
  for (const [skillId, rank] of Object.entries(currentDraft.skillRanks)) {
    const currentSkillName = findEntryName(currentRuleset.skills, skillId);
    const skillMatch = findCatalogEntry(targetRuleset.skills, currentSkillName);
    if (skillMatch.entry) {
      rebasedSkillRanks[skillMatch.entry.id] = rank;
    }
  }
  rebasedDraft.skillRanks = rebasedSkillRanks;

  return normalizeDraft(rebasedDraft);
}

function mergePatch(baseDraft: CharacterDraft, patch: CharacterDraftPatch) {
  return {
    ...baseDraft,
    ...patch,
    assignedScores: patch.assignedScores ? { ...baseDraft.assignedScores, ...patch.assignedScores } : baseDraft.assignedScores,
    skillRanks: patch.skillRanks ? { ...baseDraft.skillRanks, ...patch.skillRanks } : baseDraft.skillRanks,
    selectedSkillIds: patch.selectedSkillIds ?? baseDraft.selectedSkillIds,
    selectedFeatIds: patch.selectedFeatIds ?? baseDraft.selectedFeatIds,
    selectedSpellIds: patch.selectedSpellIds ?? baseDraft.selectedSpellIds,
    selectedItemIds: patch.selectedItemIds ?? baseDraft.selectedItemIds
  };
}

export function synthesizeCharacterAssist(options: {
  currentDraft: CharacterDraft;
  intent: CharacterIntent;
  activeStep?: BuilderStepId;
}): CharacterAssistSynthesisResult {
  const unresolvedQuestions: UnresolvedQuestion[] = [];
  const currentDraft = options.currentDraft;

  const rulesetSelection = resolveRulesetQuery(options.intent.ruleset ?? options.intent.edition, currentDraft.rulesetId);
  const targetRulesetId = rulesetSelection.rulesetId ?? currentDraft.rulesetId;
  if ((options.intent.ruleset || options.intent.edition) && !rulesetSelection.rulesetId) {
    unresolvedQuestions.push(
      makeQuestion(
        "ruleset",
        `I could not map "${options.intent.ruleset || options.intent.edition}" to a supported ruleset.`,
        "The requested edition did not match a known ruleset.",
        "rulesetId",
        rulesetSelection.suggestions
      )
    );
  }

  const targetRuleset = getRulesetById(targetRulesetId);
  const baseDraft = targetRulesetId === currentDraft.rulesetId
    ? currentDraft
    : resolveCrossRulesetSelections(currentDraft, targetRulesetId);

  const patch: CharacterDraftPatch = {};
  if (targetRulesetId !== currentDraft.rulesetId) {
    patch.rulesetId = targetRulesetId;
  }

  const experienceMode = resolveExperienceMode(options.intent.experienceMode);
  if (options.intent.experienceMode && !experienceMode) {
    unresolvedQuestions.push(
      makeQuestion(
        "ruleset",
        "Should this use beginner guidance or experienced builder mode?",
        `I could not map "${options.intent.experienceMode}" to a supported experience mode.`,
        "experienceMode",
        ["new", "experienced"]
      )
    );
  } else if (experienceMode) {
    patch.experienceMode = experienceMode;
  }

  if (options.intent.name != null) {
    patch.name = options.intent.name.trim();
  }
  if (options.intent.playerName != null) {
    patch.playerName = options.intent.playerName.trim();
  }
  if (options.intent.level != null) {
    patch.level = options.intent.level;
  }
  if (options.intent.notes != null) {
    patch.notes = options.intent.notes.trim();
  }

  if (options.intent.alignment) {
    const alignmentMatch = resolveAlignment(targetRuleset, options.intent.alignment);
    if (alignmentMatch.value) {
      patch.alignment = alignmentMatch.value;
    } else {
      unresolvedQuestions.push(
        makeQuestion(
          "identity",
          `I could not map "${options.intent.alignment}" to a legal alignment.`,
          "The requested alignment was not found in the active ruleset.",
          "alignment",
          alignmentMatch.suggestions
        )
      );
    }
  }

  if (options.intent.abilityMethod) {
    const abilityMethodMatch = resolveAbilityMethod(targetRuleset, options.intent.abilityMethod);
    if (abilityMethodMatch.entry) {
      patch.abilityMethodId = abilityMethodMatch.entry.id;
    } else {
      unresolvedQuestions.push(
        makeQuestion(
          "abilities",
          `I could not map "${options.intent.abilityMethod}" to a supported ability method.`,
          "The requested ability generation method was not found in the active ruleset.",
          "abilityMethodId",
          abilityMethodMatch.suggestions
        )
      );
    }
  }

  if (options.intent.background) {
    const backgroundMatch = findCatalogEntry(targetRuleset.backgrounds, options.intent.background);
    if (backgroundMatch.entry) {
      patch.backgroundId = backgroundMatch.entry.id;
    } else {
      unresolvedQuestions.push(
        makeQuestion(
          "identity",
          `I could not map "${options.intent.background}" to a legal background.`,
          "The requested background was not found in the active ruleset.",
          "backgroundId",
          backgroundMatch.suggestions
        )
      );
    }
  }

  if (options.intent.species) {
    const speciesMatch = findCatalogEntry(targetRuleset.species, options.intent.species);
    if (speciesMatch.entry) {
      patch.speciesId = speciesMatch.entry.id;
    } else {
      unresolvedQuestions.push(
        makeQuestion(
          "identity",
          `I could not map "${options.intent.species}" to a legal species or race.`,
          "The requested species was not found in the active ruleset.",
          "speciesId",
          speciesMatch.suggestions
        )
      );
    }
  }

  const requestedClassMatch = options.intent.characterClass
    ? findCatalogEntry(targetRuleset.classes, options.intent.characterClass)
    : { entry: null, suggestions: [] as string[] };
  if (options.intent.characterClass && !requestedClassMatch.entry) {
    unresolvedQuestions.push(
      makeQuestion(
        "identity",
        `I could not map "${options.intent.characterClass}" to a legal class.`,
        "The requested class was not found in the active ruleset.",
        "classId",
        requestedClassMatch.suggestions
      )
    );
  }

  const effectiveClass = requestedClassMatch.entry ?? findClassById(targetRuleset, patch.classId ?? baseDraft.classId);
  if (requestedClassMatch.entry) {
    patch.classId = requestedClassMatch.entry.id;
    patch.subclassId = requestedClassMatch.entry.subclasses[0]?.id ?? "";
    if (!options.intent.skills && targetRuleset.family === "5e") {
      patch.selectedSkillIds = [];
    }
    if (!options.intent.spells) {
      patch.selectedSpellIds = [];
    }
  }

  if (options.intent.subclass) {
    const subclassMatch = resolveSubclass(effectiveClass, options.intent.subclass);
    if (subclassMatch.entry) {
      patch.subclassId = subclassMatch.entry.id;
    } else {
      unresolvedQuestions.push(
        makeQuestion(
          "identity",
          `I could not map "${options.intent.subclass}" to a legal subclass for ${effectiveClass?.name || "the current class"}.`,
          "The requested subclass was not found for the active class.",
          "subclassId",
          subclassMatch.suggestions
        )
      );
    }
  }

  if (options.intent.abilities) {
    patch.assignedScores = options.intent.abilities;
  }

  if (options.intent.skills) {
    const skillResult = resolveCatalogEntries(targetRuleset.skills, options.intent.skills);
    for (const unresolved of skillResult.unresolved) {
      addArrayValueQuestion(unresolvedQuestions, unresolved.value, "proficiencies", "selectedSkillIds", "skill", unresolved.suggestions);
    }

    if (targetRuleset.family === "5e") {
      patch.selectedSkillIds = skillResult.ids;
    } else {
      patch.skillRanks = {
        ...(patch.skillRanks || {}),
        ...Object.fromEntries(skillResult.ids.map((skillId) => [skillId, 1]))
      };
    }
  }

  if (options.intent.skillRanks) {
    if (targetRuleset.family !== "3.5e") {
      unresolvedQuestions.push(
        makeQuestion(
          "proficiencies",
          "Detailed skill ranks only apply to 3.5e drafts.",
          "The current ruleset uses skill picks instead of numeric rank allocations.",
          "skillRanks"
        )
      );
    } else {
      const resolvedSkillRanks: CharacterDraft["skillRanks"] = {};
      for (const [skillName, rank] of Object.entries(options.intent.skillRanks)) {
        const skillMatch = findCatalogEntry(targetRuleset.skills, skillName);
        if (skillMatch.entry) {
          resolvedSkillRanks[skillMatch.entry.id] = rank;
        } else {
          addArrayValueQuestion(unresolvedQuestions, skillName, "proficiencies", "skillRanks", "skill", skillMatch.suggestions);
        }
      }
      patch.skillRanks = {
        ...(patch.skillRanks || {}),
        ...resolvedSkillRanks
      };
    }
  }

  if (options.intent.feats) {
    const featResult = resolveCatalogEntries(targetRuleset.feats, options.intent.feats);
    for (const unresolved of featResult.unresolved) {
      addArrayValueQuestion(unresolvedQuestions, unresolved.value, "proficiencies", "selectedFeatIds", "feat", unresolved.suggestions);
    }
    patch.selectedFeatIds = featResult.ids;
  }

  if (options.intent.spells) {
    const spellResult = resolveCatalogEntries(targetRuleset.spells, options.intent.spells);
    for (const unresolved of spellResult.unresolved) {
      addArrayValueQuestion(unresolvedQuestions, unresolved.value, "gear", "selectedSpellIds", "spell", unresolved.suggestions);
    }
    patch.selectedSpellIds = spellResult.ids;
  }

  if (options.intent.items) {
    const itemResult = resolveCatalogEntries(targetRuleset.items, options.intent.items);
    for (const unresolved of itemResult.unresolved) {
      addArrayValueQuestion(unresolvedQuestions, unresolved.value, "gear", "selectedItemIds", "item", unresolved.suggestions);
    }
    patch.selectedItemIds = itemResult.ids;
  }

  for (const question of options.intent.questions || []) {
    unresolvedQuestions.push(
      makeQuestion(options.activeStep || "review", question, "The model marked this as a follow-up question.")
    );
  }

  const previewDraft = normalizeDraft(mergePatch(baseDraft, patch));
  const derived = deriveCharacter(previewDraft);
  const validation = validateCharacter(previewDraft);

  for (const issue of validation.issues) {
    const question = mapValidationIssueToQuestion(issue, targetRuleset, options.activeStep);
    if (question) {
      unresolvedQuestions.push(question);
    }
  }

  const appliedFields = buildAppliedFields(currentDraft, previewDraft, getRulesetById(previewDraft.rulesetId));
  const finalUnresolvedQuestions = uniqueQuestions(unresolvedQuestions);

  return {
    assistantMessage: buildAssistantMessage(previewDraft, appliedFields, finalUnresolvedQuestions, validation.issues),
    patch,
    previewDraft,
    derived,
    issues: validation.issues,
    appliedFields,
    unresolvedQuestions: finalUnresolvedQuestions
  };
}
