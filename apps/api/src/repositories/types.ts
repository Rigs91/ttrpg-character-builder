import type {
  CharacterCreateInput,
  CharacterRecord,
  CharacterRevisionCreateInput,
  ContentPackVersionInput,
  ContentPackVersionRecord,
  SessionCreateInput,
  SessionImportReviewInput,
  SessionImportCreateInput,
  SessionImportResult,
  SessionRecord,
  SessionSeatCreateInput,
  SessionStatusUpdateInput,
  UserRecord,
  UserRefInput
} from "../contracts.js";

export interface CharacterListOptions {
  search?: string;
  rulesetId?: string;
  limit?: number;
}

export interface ForgeRepository {
  upsertUser(input: UserRefInput): Promise<UserRecord>;
  upsertContentPackVersion(input: ContentPackVersionInput): Promise<ContentPackVersionRecord>;
  listCharacters?(options?: CharacterListOptions): Promise<CharacterRecord[]>;
  createCharacter(
    input: CharacterCreateInput["character"],
    owner: UserRecord | null,
    contentPackVersion: ContentPackVersionRecord | null
  ): Promise<CharacterRecord>;
  getCharacter(id: string): Promise<CharacterRecord | null>;
  createCharacterRevision(characterId: string, input: CharacterRevisionCreateInput): Promise<CharacterRecord | null>;
  restoreCharacterRevision?(characterId: string, revisionId: string, reason?: string): Promise<CharacterRecord | null>;
  deleteCharacter?(characterId: string): Promise<boolean>;
  createSession(input: SessionCreateInput, owner: UserRecord | null): Promise<SessionRecord>;
  getSession(id: string): Promise<SessionRecord | null>;
  getSessionByJoinCode?(joinCode: string): Promise<SessionRecord | null>;
  updateSessionStatus?(sessionId: string, input: SessionStatusUpdateInput): Promise<SessionRecord | null>;
  createSessionSeat?(sessionId: string, input: SessionSeatCreateInput, user: UserRecord | null): Promise<SessionRecord | null>;
  createSessionImport(sessionId: string, input: SessionImportCreateInput, submittedBy: UserRecord | null): Promise<SessionImportResult | null>;
  updateSessionImportStatus?(sessionId: string, importId: string, input: SessionImportReviewInput): Promise<SessionImportResult | null>;
  close?(): Promise<void>;
}
