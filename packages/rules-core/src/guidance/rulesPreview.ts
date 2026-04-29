import { RULESETS, findById, findClassById, getCoverageReport } from "../catalog.js";
import type { CharacterDraft, CharacterIssue, DerivedCharacter, IssueSummary } from "../contracts.js";
import { deriveCharacter } from "../engine/rulesEngine.js";
import { validateCharacter } from "../engine/validators.js";
import { normalizeDraft } from "../io/draftIO.js";
import { getBuilderStepForField, type BuilderStepId } from "../ai/contracts.js";

export type PlayabilityState = "blocked" | "needs-review" | "ready";

export interface GuidedCharacterIssue extends CharacterIssue {
  stepId: BuilderStepId;
  blocking: boolean;
  actionLabel: string;
}

export interface StepCompletion {
  stepId: BuilderStepId;
  label: string;
  status: "complete" | "blocked" | "attention" | "upcoming";
  issueCount: number;
  actionLabel: string;
}

export interface RulesPreviewResult {
  draft: CharacterDraft;
  derived: DerivedCharacter | null;
  issues: GuidedCharacterIssue[];
  summary: IssueSummary;
  playability: PlayabilityState;
  nextAction: {
    stepId: BuilderStepId;
    label: string;
    detail: string;
  };
  completion: StepCompletion[];
  contentPack: {
    rulesetId: string;
    label: string;
    licenseNotice: string;
    counts: Record<string, number>;
    percentages: Record<string, number>;
  };
}

const STEP_LABELS: Record<BuilderStepId, string> = {
  ruleset: "Choose a ruleset",
  identity: "Set identity",
  abilities: "Tune abilities",
  proficiencies: "Pick proficiencies",
  gear: "Choose gear and spells",
  review: "Review and share"
};

const STEP_FIELDS: Record<BuilderStepId, Array<keyof CharacterDraft | string>> = {
  ruleset: ["rulesetId", "experienceMode"],
  identity: ["name", "level", "alignment", "backgroundId", "speciesId", "classId", "subclassId"],
  abilities: ["abilityMethodId", "assignedScores"],
  proficiencies: ["selectedSkillIds", "skillRanks", "selectedFeatIds"],
  gear: ["selectedItemIds", "selectedSpellIds"],
  review: []
};

function buildActionLabel(issue: CharacterIssue): string {
  const fallback = "Review this choice";
  if (issue.code.includes("name")) {
    return "Add a character name";
  }
  if (issue.code.includes("level")) {
    return "Set a legal level";
  }
  if (issue.code.includes("species")) {
    return "Choose a species or race";
  }
  if (issue.code.includes("background")) {
    return "Choose a background";
  }
  if (issue.code.includes("class")) {
    return "Choose a valid class";
  }
  if (issue.code.includes("subclass")) {
    return "Review subclass timing";
  }
  if (issue.code.includes("ability")) {
    return "Fix ability scores";
  }
  if (issue.code.includes("skill")) {
    return "Adjust skill choices";
  }
  if (issue.code.includes("feat")) {
    return "Review feat choices";
  }
  if (issue.code.includes("spell")) {
    return "Adjust spell picks";
  }
  if (issue.code.includes("item")) {
    return "Choose starting gear";
  }
  return fallback;
}

function hasRequiredStepFields(draft: CharacterDraft, stepId: BuilderStepId): boolean {
  if (stepId === "review") {
    return true;
  }

  return STEP_FIELDS[stepId].every((field) => {
    if (field === "assignedScores") {
      return Object.values(draft.assignedScores || {}).every((value) => Number.isFinite(Number(value)));
    }
    const value = draft[field as keyof CharacterDraft];
    if (Array.isArray(value)) {
      return value.length > 0 || stepId !== "gear";
    }
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    return value != null;
  });
}

function summarizeCatalog(draft: CharacterDraft) {
  const ruleset = RULESETS.find((entry) => entry.id === draft.rulesetId) ?? RULESETS[0];
  const coverage = getCoverageReport(ruleset.id);
  return {
    rulesetId: ruleset.id,
    label: `${ruleset.shortName} SRD-oriented pack`,
    licenseNotice: ruleset.licenseNotice,
    counts: coverage.counts,
    percentages: coverage.percentages
  };
}

function buildNextAction(issues: GuidedCharacterIssue[], draft: CharacterDraft): RulesPreviewResult["nextAction"] {
  const urgentIssue = issues.find((entry) => entry.severity === "error") ?? issues.find((entry) => entry.severity === "warning");
  if (urgentIssue) {
    return {
      stepId: urgentIssue.stepId,
      label: urgentIssue.actionLabel,
      detail: urgentIssue.message
    };
  }

  const ruleset = RULESETS.find((entry) => entry.id === draft.rulesetId) ?? RULESETS[0];
  const characterClass = findClassById(ruleset, draft.classId);
  const background = findById(ruleset.backgrounds, draft.backgroundId);
  const species = findById(ruleset.species, draft.speciesId);

  return {
    stepId: "review",
    label: "Ready for table review",
    detail: `${draft.name || "This character"} is a level ${draft.level} ${species?.name ?? "adventurer"} ${characterClass?.name ?? "character"}${background ? ` with the ${background.name} background` : ""}.`
  };
}

export function buildRulesPreview(rawDraft: CharacterDraft | Partial<CharacterDraft>): RulesPreviewResult {
  const draft = normalizeDraft(rawDraft);
  const derived = deriveCharacter(draft);
  const validation = validateCharacter(draft);
  const issues: GuidedCharacterIssue[] = validation.issues.map((entry) => {
    const stepId = getBuilderStepForField(entry.field);
    return {
      ...entry,
      stepId,
      blocking: entry.severity === "error",
      actionLabel: buildActionLabel(entry)
    };
  });

  const playability: PlayabilityState = validation.summary.errors > 0
    ? "blocked"
    : validation.summary.warnings > 0
      ? "needs-review"
      : "ready";

  const completion = (Object.keys(STEP_LABELS) as BuilderStepId[]).map((stepId) => {
    const stepIssues = issues.filter((issue) => issue.stepId === stepId);
    const hasError = stepIssues.some((issue) => issue.severity === "error");
    const hasWarning = stepIssues.some((issue) => issue.severity === "warning");
    const complete = hasRequiredStepFields(draft, stepId) && !hasError;
    const status: StepCompletion["status"] = hasError ? "blocked" : hasWarning ? "attention" : complete ? "complete" : "upcoming";
    return {
      stepId,
      label: STEP_LABELS[stepId],
      status,
      issueCount: stepIssues.length,
      actionLabel: stepIssues[0]?.actionLabel ?? (complete ? "Complete" : STEP_LABELS[stepId])
    };
  });

  return {
    draft,
    derived,
    issues,
    summary: validation.summary,
    playability,
    nextAction: buildNextAction(issues, draft),
    completion,
    contentPack: summarizeCatalog(draft)
  };
}
