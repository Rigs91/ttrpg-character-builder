import { z } from "zod";

import {
  characterDraftSchema,
  characterIssueSchema,
  type CharacterDraft,
  type CharacterIssue,
  type DerivedCharacter
} from "../contracts.js";

export const builderStepIds = ["ruleset", "identity", "abilities", "proficiencies", "gear", "review"] as const;
export type BuilderStepId = (typeof builderStepIds)[number];

const builderStepFieldPrefixes: Record<BuilderStepId, string[]> = {
  ruleset: ["rulesetId", "experienceMode"],
  identity: ["name", "playerName", "level", "alignment", "backgroundId", "speciesId", "classId", "subclassId", "notes"],
  abilities: ["assignedScores", "abilityMethodId"],
  proficiencies: ["selectedSkillIds", "skillRanks", "selectedFeatIds"],
  gear: ["selectedItemIds", "selectedSpellIds"],
  review: [""]
};

export function getBuilderStepForField(field: string): BuilderStepId {
  for (const stepId of builderStepIds) {
    if (builderStepFieldPrefixes[stepId].some((prefix) => !prefix || field.startsWith(prefix))) {
      return stepId;
    }
  }
  return "review";
}

const numberFromJsonSchema = (min: number, max: number) =>
  z.preprocess((value) => {
    if (value == null || value === "") {
      return undefined;
    }
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric : value;
    }
    return value;
  }, z.number().int().min(min).max(max));

export const abilityScorePatchSchema = z.object({
  str: numberFromJsonSchema(1, 30).optional(),
  dex: numberFromJsonSchema(1, 30).optional(),
  con: numberFromJsonSchema(1, 30).optional(),
  int: numberFromJsonSchema(1, 30).optional(),
  wis: numberFromJsonSchema(1, 30).optional(),
  cha: numberFromJsonSchema(1, 30).optional()
});
export type AbilityScorePatch = z.infer<typeof abilityScorePatchSchema>;

export const aiChatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().trim().min(1)
});
export type AiChatMessage = z.infer<typeof aiChatMessageSchema>;

export const characterIntentSchema = z.object({
  edition: z.string().trim().min(1).optional(),
  ruleset: z.string().trim().min(1).optional(),
  experienceMode: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  playerName: z.string().trim().min(1).optional(),
  level: numberFromJsonSchema(1, 20).optional(),
  alignment: z.string().trim().min(1).optional(),
  background: z.string().trim().min(1).optional(),
  species: z.string().trim().min(1).optional(),
  characterClass: z.string().trim().min(1).optional(),
  subclass: z.string().trim().min(1).optional(),
  notes: z.string().trim().min(1).optional(),
  abilityMethod: z.string().trim().min(1).optional(),
  abilities: abilityScorePatchSchema.optional(),
  skills: z.array(z.string().trim().min(1)).optional(),
  skillRanks: z.record(z.string().trim().min(1), numberFromJsonSchema(0, 30)).optional(),
  feats: z.array(z.string().trim().min(1)).optional(),
  spells: z.array(z.string().trim().min(1)).optional(),
  items: z.array(z.string().trim().min(1)).optional(),
  questions: z.array(z.string().trim().min(1)).optional(),
  rationale: z.string().trim().min(1).optional()
});
export type CharacterIntent = z.infer<typeof characterIntentSchema>;

export const characterDraftPatchSchema = z.object({
  rulesetId: z.string().trim().min(1).optional(),
  experienceMode: z.enum(["new", "experienced"]).optional(),
  name: z.string().optional(),
  playerName: z.string().optional(),
  level: numberFromJsonSchema(1, 20).optional(),
  alignment: z.string().optional(),
  backgroundId: z.string().trim().min(1).optional(),
  speciesId: z.string().trim().min(1).optional(),
  classId: z.string().trim().min(1).optional(),
  subclassId: z.string().optional(),
  notes: z.string().optional(),
  abilityMethodId: z.string().trim().min(1).optional(),
  assignedScores: abilityScorePatchSchema.optional(),
  selectedSkillIds: z.array(z.string().trim().min(1)).optional(),
  skillRanks: z.record(z.string().trim().min(1), numberFromJsonSchema(0, 30)).optional(),
  selectedFeatIds: z.array(z.string().trim().min(1)).optional(),
  selectedSpellIds: z.array(z.string().trim().min(1)).optional(),
  selectedItemIds: z.array(z.string().trim().min(1)).optional()
});
export type CharacterDraftPatch = z.infer<typeof characterDraftPatchSchema>;

export const unresolvedQuestionSchema = z.object({
  id: z.string().trim().min(1),
  stepId: z.enum(builderStepIds),
  prompt: z.string().trim().min(1),
  reason: z.string().trim().min(1),
  field: z.string().trim().min(1).optional(),
  options: z.array(z.string().trim().min(1)).optional()
});
export type UnresolvedQuestion = z.infer<typeof unresolvedQuestionSchema>;

export const appliedFieldSchema = z.object({
  field: z.string().trim().min(1),
  label: z.string().trim().min(1),
  stepId: z.enum(builderStepIds),
  summary: z.string().trim().min(1)
});
export type AppliedField = z.infer<typeof appliedFieldSchema>;

export const aiModelDescriptorSchema = z.object({
  name: z.string().trim().min(1),
  sizeBytes: z.number().int().nonnegative().optional(),
  family: z.string().trim().min(1).optional(),
  modifiedAt: z.string().trim().min(1).optional()
});
export type AiModelDescriptor = z.infer<typeof aiModelDescriptorSchema>;

export const aiModelCatalogResponseSchema = z.object({
  available: z.boolean(),
  defaultModel: z.string().trim().min(1).nullable(),
  models: z.array(aiModelDescriptorSchema),
  reason: z.string().trim().min(1).optional()
});
export type AiModelCatalogResponse = z.infer<typeof aiModelCatalogResponseSchema>;

export const characterAssistRequestSchema = z.object({
  messages: z.array(aiChatMessageSchema).min(1),
  currentDraft: characterDraftSchema,
  activeStep: z.enum(builderStepIds).optional(),
  model: z.string().trim().min(1).optional()
});
export type CharacterAssistRequest = z.infer<typeof characterAssistRequestSchema>;

export interface CharacterAssistResponse {
  assistantMessage: string;
  patch: CharacterDraftPatch;
  previewDraft: CharacterDraft;
  derived: DerivedCharacter | null;
  issues: CharacterIssue[];
  appliedFields: AppliedField[];
  unresolvedQuestions: UnresolvedQuestion[];
  modelUsed: string;
}

export interface CharacterAssistSynthesisResult {
  assistantMessage: string;
  patch: CharacterDraftPatch;
  previewDraft: CharacterDraft;
  derived: DerivedCharacter | null;
  issues: CharacterIssue[];
  appliedFields: AppliedField[];
  unresolvedQuestions: UnresolvedQuestion[];
}

export const characterAssistEnvelopeSchema = z.object({
  assistantMessage: z.string().trim().min(1),
  patch: characterDraftPatchSchema,
  previewDraft: characterDraftSchema,
  derived: z.unknown().nullable(),
  issues: z.array(characterIssueSchema),
  appliedFields: z.array(appliedFieldSchema),
  unresolvedQuestions: z.array(unresolvedQuestionSchema),
  modelUsed: z.string().trim().min(1)
});
