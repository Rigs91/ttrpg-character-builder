import { randomUUID } from "node:crypto";

import {
  buildIssueSummary,
  type CharacterCreateInput,
  type CharacterRecord,
  type CharacterRevisionCreateInput,
  type CharacterRevisionRecord,
  type ContentPackVersionInput,
  type ContentPackVersionRecord,
  type SessionCreateInput,
  type SessionImportCreateInput,
  type SessionImportReviewInput,
  type SessionImportRecord,
  type SessionImportResult,
  type SessionRecord,
  type SessionSeatCreateInput,
  type SessionSeatRecord,
  type SessionStatusUpdateInput,
  type UserRecord,
  type UserRefInput
} from "../contracts.js";
import type { CharacterListOptions, ForgeRepository } from "./types.js";

type CharacterStored = Omit<CharacterRecord, "latestRevision" | "revisions"> & {
  revisionIds: string[];
};

type SessionStored = Omit<SessionRecord, "seats" | "imports"> & {
  seatIds: string[];
  importIds: string[];
};

type StoredImport = Omit<SessionImportRecord, "character">;

function nowIso(): string {
  return new Date().toISOString();
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function makeJoinCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export class InMemoryForgeRepository implements ForgeRepository {
  private users = new Map<string, UserRecord>();
  private contentPackVersions = new Map<string, ContentPackVersionRecord>();
  private characters = new Map<string, CharacterStored>();
  private characterRevisions = new Map<string, CharacterRevisionRecord>();
  private sessions = new Map<string, SessionStored>();
  private sessionSeats = new Map<string, SessionSeatRecord>();
  private sessionImports = new Map<string, StoredImport>();

  async upsertUser(input: UserRefInput): Promise<UserRecord> {
    const timestamp = nowIso();
    const email = input.email?.toLowerCase() ?? null;
    const existing = email
      ? [...this.users.values()].find((user) => user.email?.toLowerCase() === email)
      : null;

    if (existing) {
      existing.name = input.name;
      existing.updatedAt = timestamp;
      return clone(existing);
    }

    const user: UserRecord = {
      id: randomUUID(),
      name: input.name,
      email,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.users.set(user.id, user);
    return clone(user);
  }

  async upsertContentPackVersion(input: ContentPackVersionInput): Promise<ContentPackVersionRecord> {
    const existing = [...this.contentPackVersions.values()].find(
      (entry) => entry.rulesetId === input.rulesetId && entry.version === input.version
    );
    const timestamp = nowIso();

    if (existing) {
      existing.label = input.label ?? existing.label;
      existing.checksum = input.checksum ?? existing.checksum;
      existing.updatedAt = timestamp;
      return clone(existing);
    }

    const contentPackVersion: ContentPackVersionRecord = {
      id: randomUUID(),
      rulesetId: input.rulesetId,
      version: input.version,
      label: input.label ?? null,
      checksum: input.checksum ?? null,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.contentPackVersions.set(contentPackVersion.id, contentPackVersion);
    return clone(contentPackVersion);
  }

  async listCharacters(options: CharacterListOptions = {}): Promise<CharacterRecord[]> {
    const search = options.search?.trim().toLowerCase();
    const limit = Math.max(1, Math.min(options.limit ?? 50, 100));

    return [...this.characters.values()]
      .filter((character) => !options.rulesetId || character.rulesetId === options.rulesetId)
      .filter((character) => {
        if (!search) {
          return true;
        }
        return `${character.name} ${character.notes ?? ""} ${character.owner?.name ?? ""}`.toLowerCase().includes(search);
      })
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, limit)
      .map((character) => this.requireCharacter(character.id));
  }

  async createCharacter(
    input: CharacterCreateInput["character"],
    owner: UserRecord | null,
    contentPackVersion: ContentPackVersionRecord | null
  ): Promise<CharacterRecord> {
    const timestamp = nowIso();
    const issueSummary = buildIssueSummary(input.snapshot.issues);
    const revisionId = randomUUID();
    const characterId = randomUUID();

    const revision: CharacterRevisionRecord = {
      id: revisionId,
      characterId,
      revisionNumber: 1,
      reason: "Initial publish",
      state: clone(input.snapshot.state),
      derived: input.snapshot.derived == null ? null : clone(input.snapshot.derived),
      issues: clone(input.snapshot.issues),
      issueSummary,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const character: CharacterStored = {
      id: characterId,
      owner: owner ? clone(owner) : null,
      contentPackVersion: contentPackVersion ? clone(contentPackVersion) : null,
      name: input.name,
      rulesetId: input.rulesetId,
      experienceMode: input.experienceMode,
      notes: input.notes ?? null,
      state: clone(input.snapshot.state),
      latestDerived: input.snapshot.derived == null ? null : clone(input.snapshot.derived),
      latestIssues: clone(input.snapshot.issues),
      issueSummary,
      revisionIds: [revisionId],
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.characterRevisions.set(revisionId, revision);
    this.characters.set(characterId, character);

    return this.requireCharacter(characterId);
  }

  async getCharacter(id: string): Promise<CharacterRecord | null> {
    if (!this.characters.has(id)) {
      return null;
    }

    return this.requireCharacter(id);
  }

  async createCharacterRevision(characterId: string, input: CharacterRevisionCreateInput): Promise<CharacterRecord | null> {
    const character = this.characters.get(characterId);
    if (!character) {
      return null;
    }

    const revisionNumber = character.revisionIds.length + 1;
    const timestamp = nowIso();
    const issueSummary = buildIssueSummary(input.snapshot.issues);
    const revision: CharacterRevisionRecord = {
      id: randomUUID(),
      characterId,
      revisionNumber,
      reason: input.reason ?? null,
      state: clone(input.snapshot.state),
      derived: input.snapshot.derived == null ? null : clone(input.snapshot.derived),
      issues: clone(input.snapshot.issues),
      issueSummary,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    character.state = clone(input.snapshot.state);
    character.latestDerived = input.snapshot.derived == null ? null : clone(input.snapshot.derived);
    character.latestIssues = clone(input.snapshot.issues);
    character.issueSummary = issueSummary;
    character.updatedAt = timestamp;
    character.revisionIds.push(revision.id);

    this.characterRevisions.set(revision.id, revision);

    return this.requireCharacter(characterId);
  }

  async restoreCharacterRevision(characterId: string, revisionId: string, reason?: string): Promise<CharacterRecord | null> {
    const revision = this.characterRevisions.get(revisionId);
    if (!revision || revision.characterId !== characterId) {
      return null;
    }

    return this.createCharacterRevision(characterId, {
      reason: reason ?? `Restored revision #${revision.revisionNumber}`,
      snapshot: {
        state: clone(revision.state),
        derived: revision.derived == null ? undefined : clone(revision.derived),
        issues: clone(revision.issues)
      }
    });
  }

  async deleteCharacter(characterId: string): Promise<boolean> {
    const character = this.characters.get(characterId);
    if (!character) {
      return false;
    }

    for (const revisionId of character.revisionIds) {
      this.characterRevisions.delete(revisionId);
    }
    this.characters.delete(characterId);
    return true;
  }

  async createSession(input: SessionCreateInput, owner: UserRecord | null): Promise<SessionRecord> {
    const timestamp = nowIso();
    let joinCode = makeJoinCode();
    while ([...this.sessions.values()].some((session) => session.joinCode === joinCode)) {
      joinCode = makeJoinCode();
    }

    const sessionId = randomUUID();
    const session: SessionStored = {
      id: sessionId,
      owner: owner ? clone(owner) : null,
      title: input.title,
      rulesetId: input.rulesetId,
      joinCode,
      status: "ACTIVE",
      seatIds: [],
      importIds: [],
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const requestedSeats = [...input.seats];
    if (owner && !requestedSeats.some((seat) => seat.role === "DM")) {
      requestedSeats.unshift({ displayName: owner.name, role: "DM" });
    }

    requestedSeats.forEach((seatInput) => {
      const seat: SessionSeatRecord = {
        id: randomUUID(),
        user: owner && seatInput.displayName === owner.name ? clone(owner) : null,
        displayName: seatInput.displayName,
        role: seatInput.role,
        joinedAt: timestamp,
        updatedAt: timestamp
      };
      this.sessionSeats.set(seat.id, seat);
      session.seatIds.push(seat.id);
    });

    this.sessions.set(sessionId, session);
    return this.requireSession(sessionId);
  }

  async getSession(id: string): Promise<SessionRecord | null> {
    if (!this.sessions.has(id)) {
      return null;
    }

    return this.requireSession(id);
  }

  async getSessionByJoinCode(joinCode: string): Promise<SessionRecord | null> {
    const normalized = joinCode.trim().toUpperCase();
    const session = [...this.sessions.values()].find((entry) => entry.joinCode === normalized);
    return session ? this.requireSession(session.id) : null;
  }

  async updateSessionStatus(sessionId: string, input: SessionStatusUpdateInput): Promise<SessionRecord | null> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    session.status = input.status;
    session.updatedAt = nowIso();
    return this.requireSession(sessionId);
  }

  async createSessionSeat(sessionId: string, input: SessionSeatCreateInput, user: UserRecord | null): Promise<SessionRecord | null> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    const timestamp = nowIso();
    const seat: SessionSeatRecord = {
      id: randomUUID(),
      user: user ? clone(user) : null,
      displayName: input.displayName,
      role: input.role,
      joinedAt: timestamp,
      updatedAt: timestamp
    };
    this.sessionSeats.set(seat.id, seat);
    session.seatIds.push(seat.id);
    session.updatedAt = timestamp;

    return this.requireSession(sessionId);
  }

  async createSessionImport(
    sessionId: string,
    input: SessionImportCreateInput,
    submittedBy: UserRecord | null
  ): Promise<SessionImportResult | null> {
    const session = this.sessions.get(sessionId);
    const character = this.characters.get(input.characterId);

    if (!session || !character) {
      return null;
    }

    const timestamp = nowIso();
    const sessionImport: StoredImport = {
      id: randomUUID(),
      sessionId,
      characterId: input.characterId,
      submittedByUser: submittedBy ? clone(submittedBy) : null,
      submittedByName: input.submittedBy?.name ?? submittedBy?.name ?? null,
      status: "PENDING",
      note: input.note ?? null,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.sessionImports.set(sessionImport.id, sessionImport);
    session.importIds.push(sessionImport.id);
    session.updatedAt = timestamp;

    const aggregateSession = this.requireSession(sessionId);
    const aggregateImport = aggregateSession.imports.find((entry) => entry.id === sessionImport.id);
    if (!aggregateImport) {
      return null;
    }

    return {
      session: aggregateSession,
      sessionImport: aggregateImport
    };
  }

  async updateSessionImportStatus(
    sessionId: string,
    importId: string,
    input: SessionImportReviewInput
  ): Promise<SessionImportResult | null> {
    const session = this.sessions.get(sessionId);
    const sessionImport = this.sessionImports.get(importId);
    if (!session || !sessionImport || sessionImport.sessionId !== sessionId) {
      return null;
    }

    const timestamp = nowIso();
    sessionImport.status = input.status;
    sessionImport.note = input.note ?? sessionImport.note;
    sessionImport.updatedAt = timestamp;
    session.updatedAt = timestamp;

    const aggregateSession = this.requireSession(sessionId);
    const aggregateImport = aggregateSession.imports.find((entry) => entry.id === importId);
    if (!aggregateImport) {
      return null;
    }

    return {
      session: aggregateSession,
      sessionImport: aggregateImport
    };
  }

  private requireCharacter(id: string): CharacterRecord {
    const character = this.characters.get(id);
    if (!character) {
      throw new Error(`Character ${id} not found.`);
    }

    const revisions = character.revisionIds
      .map((revisionId) => this.characterRevisions.get(revisionId))
      .filter((revision): revision is CharacterRevisionRecord => Boolean(revision))
      .sort((left, right) => left.revisionNumber - right.revisionNumber);

    return clone({
      ...character,
      latestRevision: revisions[revisions.length - 1],
      revisions
    });
  }

  private requireSession(id: string): SessionRecord {
    const session = this.sessions.get(id);
    if (!session) {
      throw new Error(`Session ${id} not found.`);
    }

    const seats = session.seatIds
      .map((seatId) => this.sessionSeats.get(seatId))
      .filter((seat): seat is SessionSeatRecord => Boolean(seat));

    const imports = session.importIds
      .map((importId) => this.sessionImports.get(importId))
      .filter((sessionImport): sessionImport is StoredImport => Boolean(sessionImport))
      .map((sessionImport) => {
        const character = this.requireCharacter(sessionImport.characterId);
        return {
          ...sessionImport,
          character: {
            id: character.id,
            name: character.name,
            rulesetId: character.rulesetId,
            experienceMode: character.experienceMode,
            updatedAt: character.updatedAt
          }
        } satisfies SessionImportRecord;
      });

    return clone({
      ...session,
      seats,
      imports
    });
  }
}
