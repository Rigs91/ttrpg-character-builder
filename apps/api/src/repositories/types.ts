import type {
  CharacterCreateInput,
  CharacterRecord,
  CharacterRevisionCreateInput,
  ContentPackVersionInput,
  ContentPackVersionRecord,
  SessionCreateInput,
  SessionImportCreateInput,
  SessionImportResult,
  SessionRecord,
  UserRecord,
  UserRefInput
} from "../contracts.js";

export interface ForgeRepository {
  upsertUser(input: UserRefInput): Promise<UserRecord>;
  upsertContentPackVersion(input: ContentPackVersionInput): Promise<ContentPackVersionRecord>;
  createCharacter(
    input: CharacterCreateInput["character"],
    owner: UserRecord | null,
    contentPackVersion: ContentPackVersionRecord | null
  ): Promise<CharacterRecord>;
  getCharacter(id: string): Promise<CharacterRecord | null>;
  createCharacterRevision(characterId: string, input: CharacterRevisionCreateInput): Promise<CharacterRecord | null>;
  createSession(input: SessionCreateInput, owner: UserRecord | null): Promise<SessionRecord>;
  getSession(id: string): Promise<SessionRecord | null>;
  createSessionImport(sessionId: string, input: SessionImportCreateInput, submittedBy: UserRecord | null): Promise<SessionImportResult | null>;
  close?(): Promise<void>;
}
