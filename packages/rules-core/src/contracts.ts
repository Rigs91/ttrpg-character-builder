import { z } from "zod";

export const abilityKeys = ["str", "dex", "con", "int", "wis", "cha"] as const;
export type AbilityKey = (typeof abilityKeys)[number];

export const issueSeveritySchema = z.enum(["error", "warning", "info"]);
export type IssueSeverity = z.infer<typeof issueSeveritySchema>;

export const abilityScoresSchema = z.object({
  str: z.number().int().min(1).max(30),
  dex: z.number().int().min(1).max(30),
  con: z.number().int().min(1).max(30),
  int: z.number().int().min(1).max(30),
  wis: z.number().int().min(1).max(30),
  cha: z.number().int().min(1).max(30)
});
export type AbilityScores = z.infer<typeof abilityScoresSchema>;

export const characterIssueSchema = z.object({
  code: z.string(),
  severity: issueSeveritySchema,
  field: z.string(),
  message: z.string()
});
export type CharacterIssue = z.infer<typeof characterIssueSchema>;

export const skillRanksSchema = z.record(z.string(), z.number().min(0).max(23)).default({});
export type SkillRanks = z.infer<typeof skillRanksSchema>;

export const characterDraftSchema = z.object({
  draftId: z.string().optional(),
  userId: z.string().optional(),
  rulesetId: z.string(),
  experienceMode: z.enum(["new", "experienced"]).default("new"),
  name: z.string().default(""),
  playerName: z.string().default(""),
  level: z.number().int().min(1).max(20).default(1),
  alignment: z.string().default(""),
  backgroundId: z.string().default(""),
  speciesId: z.string().default(""),
  classId: z.string().default(""),
  subclassId: z.string().default(""),
  notes: z.string().default(""),
  abilityMethodId: z.string().default("point-buy"),
  assignedScores: abilityScoresSchema,
  selectedSkillIds: z.array(z.string()).default([]),
  skillRanks: skillRanksSchema,
  selectedFeatIds: z.array(z.string()).default([]),
  selectedSpellIds: z.array(z.string()).default([]),
  selectedItemIds: z.array(z.string()).default([]),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  savedAt: z.string().datetime().optional()
});
export type CharacterDraft = z.infer<typeof characterDraftSchema>;

export const issueSummarySchema = z.object({
  total: z.number().int().nonnegative(),
  errors: z.number().int().nonnegative(),
  warnings: z.number().int().nonnegative(),
  info: z.number().int().nonnegative()
});
export type IssueSummary = z.infer<typeof issueSummarySchema>;

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email().nullable().optional(),
  displayName: z.string(),
  createdAt: z.string().datetime()
});
export type UserRecord = z.infer<typeof userSchema>;

export const contentPackVersionSchema = z.object({
  id: z.string(),
  rulesetId: z.string(),
  label: z.string(),
  checksum: z.string(),
  createdAt: z.string().datetime()
});
export type ContentPackVersionRecord = z.infer<typeof contentPackVersionSchema>;

export const characterRecordSchema = z.object({
  id: z.string(),
  userId: z.string().nullable().optional(),
  draft: characterDraftSchema,
  issueSummary: issueSummarySchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type CharacterRecord = z.infer<typeof characterRecordSchema>;

export const characterRevisionSchema = z.object({
  id: z.string(),
  characterId: z.string(),
  revisionNumber: z.number().int().positive(),
  notes: z.string().default(""),
  draft: characterDraftSchema,
  issueSummary: issueSummarySchema,
  createdAt: z.string().datetime()
});
export type CharacterRevisionRecord = z.infer<typeof characterRevisionSchema>;

export const sessionStatusSchema = z.enum(["draft", "active", "archived"]);
export type SessionStatus = z.infer<typeof sessionStatusSchema>;

export const sessionSeatSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  characterId: z.string().nullable().optional(),
  displayName: z.string(),
  status: z.enum(["open", "occupied", "pending"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type SessionSeatRecord = z.infer<typeof sessionSeatSchema>;

export const sessionImportStatusSchema = z.enum(["pending", "accepted", "rejected"]);
export type SessionImportStatus = z.infer<typeof sessionImportStatusSchema>;

export const sessionImportSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  characterId: z.string(),
  submittedBy: z.string().nullable().optional(),
  status: sessionImportStatusSchema,
  issueSummary: issueSummarySchema,
  notes: z.string().default(""),
  submittedAt: z.string().datetime(),
  reviewedAt: z.string().datetime().nullable().optional()
});
export type SessionImportRecord = z.infer<typeof sessionImportSchema>;

export const sessionSchema = z.object({
  id: z.string(),
  hostUserId: z.string().nullable().optional(),
  joinCode: z.string(),
  title: z.string(),
  status: sessionStatusSchema,
  rulesetId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  roster: z.array(sessionSeatSchema).default([]),
  imports: z.array(sessionImportSchema).default([])
});
export type SessionRecord = z.infer<typeof sessionSchema>;

const sessionJoinedEventSchema = z.object({
  type: z.literal("session.joined"),
  sessionId: z.string(),
  joinCode: z.string(),
  participant: z.string()
});

const characterPublishedEventSchema = z.object({
  type: z.literal("character.published"),
  sessionId: z.string(),
  characterId: z.string(),
  revisionId: z.string()
});

const characterImportedEventSchema = z.object({
  type: z.literal("character.imported"),
  sessionId: z.string(),
  characterId: z.string(),
  importId: z.string(),
  status: sessionImportStatusSchema
});

const sessionRosterUpdatedEventSchema = z.object({
  type: z.literal("session.roster.updated"),
  sessionId: z.string(),
  rosterCount: z.number().int().nonnegative(),
  pendingImports: z.number().int().nonnegative()
});

export const websocketEventSchema = z.union([
  sessionJoinedEventSchema,
  characterPublishedEventSchema,
  characterImportedEventSchema,
  sessionRosterUpdatedEventSchema
]);
export type WebsocketEvent = z.infer<typeof websocketEventSchema>;

export interface SkillAllocation {
  id: string;
  name: string;
  ability: AbilityKey;
  total: number;
  proficient: boolean;
  source: "background" | "class" | "ranked" | "manual";
  ranks?: number;
}

export interface SavingThrowLine {
  fort?: number;
  ref?: number;
  will?: number;
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
}

export interface AttackLine {
  name: string;
  attackBonus: number;
  damage: string;
  ability: AbilityKey;
  notes: string;
}

export interface SpellcastingSummary {
  castingAbility: AbilityKey;
  castingModifier: number;
  spellAttackBonus: number;
  saveDC: number;
  cantrips: number;
  preparedOrKnown: number;
  spellPickLimit: number;
  maxSpellLevel: number;
  slots: Partial<Record<number, number>>;
  pactSlots?: { slots: number; level: number };
  casterLevel?: number;
}

export interface DerivedCharacter {
  rulesetId: string;
  rulesetName: string;
  rulesFamily: string;
  level: number;
  className: string | null;
  subclassName: string | null;
  speciesName: string | null;
  backgroundName: string | null;
  pointBuyTotal: number;
  abilityScores: AbilityScores;
  abilityModifiers: Record<AbilityKey, number>;
  proficiencyBonus: number;
  baseAttackBonus: number | null;
  saves: SavingThrowLine | null;
  hitPoints: number;
  armorClass: number;
  initiative: number;
  passivePerception: number;
  speed: number;
  carryingCapacity: number;
  spellcasting: SpellcastingSummary | null;
  selectedSkills: SkillAllocation[];
  selectedFeats: Array<{ id: string; slug: string; name: string }>;
  selectedItems: Array<{ id: string; slug: string; name: string; category: string }>;
  selectedSpells: Array<{ id: string; slug: string; name: string; level: number; school: string }>;
  attacks: AttackLine[];
  classFeatures: Array<{ level: number; name: string; description: string }>;
  toolProficiencies: string[];
  languageProficiencies: number;
  grantedFeatIds: string[];
  validationHints: string[];
}
