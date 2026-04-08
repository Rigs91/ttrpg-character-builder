import { z } from "zod";

export const issueSeveritySchema = z.enum(["error", "warning", "info"]);

export const forgeIssueSchema = z.object({
  code: z.string().min(1),
  severity: issueSeveritySchema,
  field: z.string().min(1).optional(),
  message: z.string().min(1),
  context: z.unknown().optional()
});

export const issueSummarySchema = z.object({
  total: z.number().int().nonnegative(),
  errors: z.number().int().nonnegative(),
  warnings: z.number().int().nonnegative(),
  info: z.number().int().nonnegative()
});

export const userRefSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional()
});

export const contentPackVersionSchema = z.object({
  rulesetId: z.string().min(1),
  version: z.string().min(1),
  label: z.string().min(1).optional(),
  checksum: z.string().min(1).optional()
});

export const characterSnapshotSchema = z.object({
  state: z.unknown(),
  derived: z.unknown().optional(),
  issues: z.array(forgeIssueSchema).default([])
});

export const characterCreateSchema = z.object({
  owner: userRefSchema.optional(),
  contentPack: contentPackVersionSchema.optional(),
  character: z.object({
    name: z.string().min(1),
    rulesetId: z.string().min(1),
    experienceMode: z.enum(["new", "experienced"]).default("new"),
    notes: z.string().optional(),
    snapshot: characterSnapshotSchema
  })
});

export const characterRevisionCreateSchema = z.object({
  reason: z.string().min(1).optional(),
  snapshot: characterSnapshotSchema
});

export const sessionSeatSchema = z.object({
  displayName: z.string().min(1),
  role: z.enum(["DM", "PLAYER", "OBSERVER"]).default("PLAYER")
});

export const sessionCreateSchema = z.object({
  owner: userRefSchema.optional(),
  title: z.string().min(1),
  rulesetId: z.string().min(1),
  seats: z.array(sessionSeatSchema).default([])
});

export const sessionImportCreateSchema = z.object({
  characterId: z.string().min(1),
  submittedBy: userRefSchema.optional(),
  note: z.string().min(1).optional()
});

export type ForgeIssue = z.infer<typeof forgeIssueSchema>;
export type IssueSummary = z.infer<typeof issueSummarySchema>;
export type UserRefInput = z.infer<typeof userRefSchema>;
export type ContentPackVersionInput = z.infer<typeof contentPackVersionSchema>;
export type CharacterSnapshotInput = z.infer<typeof characterSnapshotSchema>;
export type CharacterCreateInput = z.infer<typeof characterCreateSchema>;
export type CharacterRevisionCreateInput = z.infer<typeof characterRevisionCreateSchema>;
export type SessionSeatInput = z.infer<typeof sessionSeatSchema>;
export type SessionCreateInput = z.infer<typeof sessionCreateSchema>;
export type SessionImportCreateInput = z.infer<typeof sessionImportCreateSchema>;

export interface UserRecord {
  id: string;
  name: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContentPackVersionRecord {
  id: string;
  rulesetId: string;
  version: string;
  label: string | null;
  checksum: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterRevisionRecord {
  id: string;
  characterId: string;
  revisionNumber: number;
  reason: string | null;
  state: unknown;
  derived: unknown | null;
  issues: ForgeIssue[];
  issueSummary: IssueSummary;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterRecord {
  id: string;
  owner: UserRecord | null;
  contentPackVersion: ContentPackVersionRecord | null;
  name: string;
  rulesetId: string;
  experienceMode: "new" | "experienced";
  notes: string | null;
  state: unknown;
  latestDerived: unknown | null;
  latestIssues: ForgeIssue[];
  issueSummary: IssueSummary;
  latestRevision: CharacterRevisionRecord;
  revisions: CharacterRevisionRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface SessionSeatRecord {
  id: string;
  user: UserRecord | null;
  displayName: string;
  role: "DM" | "PLAYER" | "OBSERVER";
  joinedAt: string;
  updatedAt: string;
}

export interface SessionImportRecord {
  id: string;
  sessionId: string;
  characterId: string;
  submittedByUser: UserRecord | null;
  submittedByName: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  note: string | null;
  createdAt: string;
  updatedAt: string;
  character: Pick<CharacterRecord, "id" | "name" | "rulesetId" | "experienceMode" | "updatedAt">;
}

export interface SessionRecord {
  id: string;
  owner: UserRecord | null;
  title: string;
  rulesetId: string;
  joinCode: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  seats: SessionSeatRecord[];
  imports: SessionImportRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface SessionImportResult {
  session: SessionRecord;
  sessionImport: SessionImportRecord;
}

export interface RealtimeEnvelope<TType extends string, TPayload> {
  type: TType;
  occurredAt: string;
  payload: TPayload;
}

export type SessionJoinedEvent = RealtimeEnvelope<
  "session.joined",
  {
    sessionId: string;
    joinCode: string;
    title: string;
    seatCount: number;
    importCount: number;
  }
>;

export type CharacterPublishedEvent = RealtimeEnvelope<
  "character.published",
  {
    characterId: string;
    revisionNumber: number;
    rulesetId: string;
    characterName: string;
    issueSummary: IssueSummary;
  }
>;

export type CharacterImportedEvent = RealtimeEnvelope<
  "character.imported",
  {
    sessionId: string;
    sessionImportId: string;
    characterId: string;
    characterName: string;
    submittedByName: string | null;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
  }
>;

export type SessionRosterUpdatedEvent = RealtimeEnvelope<
  "session.roster.updated",
  {
    sessionId: string;
    seatCount: number;
    importCount: number;
    pendingImports: number;
  }
>;

export type ForgeRealtimeEvent =
  | SessionJoinedEvent
  | CharacterPublishedEvent
  | CharacterImportedEvent
  | SessionRosterUpdatedEvent;

export function buildIssueSummary(issues: readonly ForgeIssue[] = []): IssueSummary {
  return {
    total: issues.length,
    errors: issues.filter((issue) => issue.severity === "error").length,
    warnings: issues.filter((issue) => issue.severity === "warning").length,
    info: issues.filter((issue) => issue.severity === "info").length
  };
}
