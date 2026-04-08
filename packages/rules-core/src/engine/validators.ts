import { abilityKeys, type AbilityKey, type CharacterDraft, type CharacterIssue, type IssueSummary } from "../contracts.js";
import { findById, findClassById, getRulesetById } from "../catalog.js";
import { FEAT_PREREQUISITES, THREE_FIVE_SKILL_POINTS } from "../rules/metadata.js";
import { calculatePointBuyTotal, deriveCharacter } from "./rulesEngine.js";

function issue(code: string, severity: CharacterIssue["severity"], field: string, message: string): CharacterIssue {
  return { code, severity, field, message };
}

function validateAbilityBounds(draft: CharacterDraft, method: { min?: number; max?: number }) {
  const issues: CharacterIssue[] = [];
  for (const key of abilityKeys) {
    const score = Number(draft.assignedScores?.[key]);
    if (!Number.isFinite(score)) {
      issues.push(issue("ability.not_number", "error", `assignedScores.${key}`, `${key.toUpperCase()} must be numeric.`));
      continue;
    }
    if (method.min != null && score < method.min) {
      issues.push(issue("ability.too_low", "error", `assignedScores.${key}`, `${key.toUpperCase()} is below ${method.min}.`));
    }
    if (method.max != null && score > method.max) {
      issues.push(issue("ability.too_high", "error", `assignedScores.${key}`, `${key.toUpperCase()} is above ${method.max}.`));
    }
  }
  return issues;
}

function validateStandardArray(draft: CharacterDraft, method: { array?: number[] }) {
  if (!method.array?.length) {
    return [];
  }
  const values = Object.values(draft.assignedScores || {}).map((value) => Number(value));
  const left = [...values].sort((a, b) => a - b).join(",");
  const right = [...method.array].sort((a, b) => a - b).join(",");
  return left === right ? [] : [issue("ability.array.mismatch", "error", "assignedScores", `Standard Array must use exactly ${method.array.join(", ")}.`)];
}

function summarizeIssues(issues: CharacterIssue[]): IssueSummary {
  return {
    total: issues.length,
    errors: issues.filter((entry) => entry.severity === "error").length,
    warnings: issues.filter((entry) => entry.severity === "warning").length,
    info: issues.filter((entry) => entry.severity === "info").length
  };
}

function subclassUnlockLevel(features: Array<{ level: number; name: string }>) {
  const subclassFeature = features.find((feature) => /subclass|path|college|domain|circle|archetype|oath|tradition|origin|patron|boon/i.test(feature.name));
  return subclassFeature?.level || 1;
}

function abilityMeetsPrerequisites(assignedScores: Record<AbilityKey, number>, minimums: Partial<Record<AbilityKey, number>>) {
  return Object.entries(minimums).every(([key, value]) => assignedScores[key as AbilityKey] >= Number(value));
}

export function validateCharacter(draft: CharacterDraft) {
  const ruleset = getRulesetById(draft.rulesetId);
  const issues: CharacterIssue[] = [];
  const level = Number(draft.level || 1);
  const characterClass = findClassById(ruleset, draft.classId);
  const species = findById(ruleset.species, draft.speciesId);
  const background = findById(ruleset.backgrounds, draft.backgroundId);
  const method = findById(ruleset.abilityMethods, draft.abilityMethodId) || ruleset.abilityMethods[0];

  if (!draft.name.trim()) {
    issues.push(issue("character.name.required", "error", "name", "Character name is required."));
  }
  if (!Number.isFinite(level) || level < ruleset.levelBounds.min || level > ruleset.levelBounds.max) {
    issues.push(issue("character.level.invalid", "error", "level", `Level must be between ${ruleset.levelBounds.min} and ${ruleset.levelBounds.max}.`));
  }
  if (!species) {
    issues.push(issue("character.species.required", "error", "speciesId", "Choose a species or race."));
  }
  if (!background) {
    issues.push(issue("character.background.required", "error", "backgroundId", "Choose a background."));
  }
  if (!characterClass) {
    issues.push(issue("character.class.required", "error", "classId", "Choose a class."));
  }

  issues.push(...validateAbilityBounds(draft, method));
  if (method.id === "point-buy") {
    const total = calculatePointBuyTotal(draft.assignedScores, method);
    if ((method.budget || 0) < total) {
      issues.push(issue("ability.point_buy.over_budget", "error", "assignedScores", `Point-buy total ${total} exceeds budget ${method.budget}.`));
    }
  }
  if (method.id === "standard-array") {
    issues.push(...validateStandardArray(draft, method));
  }

  if (characterClass && draft.subclassId) {
    const subclass = findById(characterClass.subclasses, draft.subclassId);
    if (!subclass) {
      issues.push(issue("character.subclass.invalid", "error", "subclassId", "Selected subclass is not valid for the current class."));
    } else if (level < subclassUnlockLevel(characterClass.featuresByLevel)) {
      issues.push(issue("character.subclass.too_early", "warning", "subclassId", `${characterClass.name} does not formally pick a subclass until level ${subclassUnlockLevel(characterClass.featuresByLevel)}.`));
    }
  }

  const derived = deriveCharacter(draft);
  const selectedSkillIds = Array.from(new Set(draft.selectedSkillIds || []));
  for (const skillId of selectedSkillIds) {
    const skill = findById(ruleset.skills, skillId);
    if (!skill) {
      issues.push(issue("skill.not_found", "error", "selectedSkillIds", `Unknown skill selection: ${skillId}.`));
      continue;
    }
    if (ruleset.family === "5e" && characterClass?.skillOptions?.length && !characterClass.skillOptions.includes(skill.name)) {
      issues.push(issue("skill.illegal_choice", "error", "selectedSkillIds", `${skill.name} is not a valid class skill choice for ${characterClass.name}.`));
    }
  }
  if (characterClass && ruleset.family === "5e" && selectedSkillIds.length > characterClass.skillChoices) {
    issues.push(issue("skill.too_many", "error", "selectedSkillIds", `${characterClass.name} allows up to ${characterClass.skillChoices} class skill selections.`));
  }

  const classSlug = characterClass?.slug || "";
  for (const spellId of draft.selectedSpellIds || []) {
    const spell = findById(ruleset.spells, spellId);
    if (!spell) {
      issues.push(issue("spell.not_found", "error", "selectedSpellIds", `Unknown spell selection: ${spellId}.`));
      continue;
    }
    if (!spell.classes.includes(classSlug)) {
      issues.push(issue("spell.illegal_choice", "error", "selectedSpellIds", `${spell.name} is not on the ${characterClass?.name || "selected"} spell list.`));
    }
    if (derived?.spellcasting && spell.level > derived.spellcasting.maxSpellLevel) {
      issues.push(issue("spell.level_locked", "error", "selectedSpellIds", `${spell.name} is above the current max spell level of ${derived.spellcasting.maxSpellLevel}.`));
    }
  }
  if (derived?.spellcasting) {
    const spellLimit = derived.spellcasting.spellPickLimit;
    if ((draft.selectedSpellIds || []).length > spellLimit) {
      issues.push(issue("spell.too_many", "error", "selectedSpellIds", `Selected ${(draft.selectedSpellIds || []).length} spells, but the limit is ${spellLimit}.`));
    }
  } else if ((draft.selectedSpellIds || []).length > 0) {
    issues.push(issue("spell.not_caster", "error", "selectedSpellIds", "This class is not a spellcaster in the chosen ruleset."));
  }

  const selectedFeatSlugs = (draft.selectedFeatIds || []).map((featId) => findById(ruleset.feats, featId)).filter(Boolean).map((feat) => feat!.slug);
  for (const featId of draft.selectedFeatIds || []) {
    const feat = findById(ruleset.feats, featId);
    if (!feat) {
      issues.push(issue("feat.not_found", "error", "selectedFeatIds", `Unknown feat selection: ${featId}.`));
      continue;
    }
    const prerequisite = FEAT_PREREQUISITES[feat.slug];
    if (!prerequisite) {
      continue;
    }
    if (prerequisite.minAbility && !abilityMeetsPrerequisites(derived?.abilityScores || draft.assignedScores, prerequisite.minAbility)) {
      issues.push(issue("feat.ability_prerequisite", "error", "selectedFeatIds", `${feat.name} does not meet its ability prerequisites.`));
    }
    if (prerequisite.requiresSpellcasting && !derived?.spellcasting) {
      issues.push(issue("feat.spellcasting_prerequisite", "error", "selectedFeatIds", `${feat.name} requires spellcasting.`));
    }
    if (prerequisite.requiredFeats && !prerequisite.requiredFeats.every((slug) => selectedFeatSlugs.includes(slug))) {
      issues.push(issue("feat.feat_prerequisite", "error", "selectedFeatIds", `${feat.name} requires prerequisite feats.`));
    }
  }

  for (const itemId of draft.selectedItemIds || []) {
    if (!findById(ruleset.items, itemId)) {
      issues.push(issue("item.not_found", "error", "selectedItemIds", `Unknown item selection: ${itemId}.`));
    }
  }
  if ((draft.selectedItemIds || []).length === 0) {
    issues.push(issue("item.none_selected", "warning", "selectedItemIds", "Select starting gear or a template loadout."));
  }

  if (ruleset.family === "3.5e" && characterClass && derived) {
    const baseSkillPoints = THREE_FIVE_SKILL_POINTS[characterClass.slug] ?? 2;
    const perLevel = Math.max(1, baseSkillPoints + derived.abilityModifiers.int);
    const budget = perLevel * 4 + Math.max(0, level - 1) * perLevel;
    const spent = Object.values(draft.skillRanks || {}).reduce((sum, value) => sum + Number(value || 0), 0);
    if (spent > budget) {
      issues.push(issue("skill.points_over_budget", "error", "skillRanks", `Allocated ${spent} skill ranks, but the budget is ${budget}.`));
    }
    const maxRank = level + 3;
    for (const [skillId, value] of Object.entries(draft.skillRanks || {})) {
      if (!findById(ruleset.skills, skillId)) {
        issues.push(issue("skill.not_found", "error", "skillRanks", `Unknown skill rank assignment: ${skillId}.`));
      } else if (Number(value) > maxRank) {
        issues.push(issue("skill.rank_too_high", "error", "skillRanks", `A single skill rank cannot exceed ${maxRank} at level ${level}.`));
      }
    }
  }

  if (background?.originFeat && derived && !derived.grantedFeatIds.length) {
    issues.push(issue("background.origin_feat_missing", "warning", "backgroundId", `${background.name} should grant an origin feat, but it could not be mapped.`));
  }
  if ((draft.selectedFeatIds || []).length === 0 && !background?.originFeat) {
    issues.push(issue("feat.none_selected", "info", "selectedFeatIds", "No optional feats selected yet."));
  }

  return { issues, summary: summarizeIssues(issues) };
}
