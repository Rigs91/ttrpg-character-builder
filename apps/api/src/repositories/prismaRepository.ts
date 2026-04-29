import { randomUUID } from "node:crypto";

import { PrismaClient } from "@prisma/client";

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

const characterInclude = {
  owner: true,
  contentPackVersion: true,
  revisions: {
    orderBy: {
      revisionNumber: "asc" as const
    }
  }
};

const sessionInclude = {
  owner: true,
  seats: {
    include: {
      user: true
    }
  },
  imports: {
    orderBy: {
      createdAt: "asc" as const
    },
    include: {
      submittedByUser: true,
      character: true
    }
  }
};

type PrismaCharacterAggregate = any;
type PrismaSessionAggregate = any;

function toJson(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value ?? null)) as unknown;
}

function makeJoinCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function mapUser(user: { id: string; name: string; email: string | null; createdAt: Date; updatedAt: Date } | null): UserRecord | null {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
}

function mapContentPackVersion(
  contentPackVersion:
    | {
        id: string;
        rulesetId: string;
        version: string;
        label: string | null;
        checksum: string | null;
        createdAt: Date;
        updatedAt: Date;
      }
    | null
): ContentPackVersionRecord | null {
  if (!contentPackVersion) {
    return null;
  }

  return {
    id: contentPackVersion.id,
    rulesetId: contentPackVersion.rulesetId,
    version: contentPackVersion.version,
    label: contentPackVersion.label,
    checksum: contentPackVersion.checksum,
    createdAt: contentPackVersion.createdAt.toISOString(),
    updatedAt: contentPackVersion.updatedAt.toISOString()
  };
}

function mapRevision(revision: {
  id: string;
  characterId: string;
  revisionNumber: number;
  reason: string | null;
  state: unknown;
  derived: unknown | null;
  issues: unknown;
  issueSummary: unknown;
  createdAt: Date;
  updatedAt: Date;
}): CharacterRevisionRecord {
  const issues = Array.isArray(revision.issues) ? revision.issues : [];
  return {
    id: revision.id,
    characterId: revision.characterId,
    revisionNumber: revision.revisionNumber,
    reason: revision.reason,
    state: revision.state,
    derived: revision.derived,
    issues: issues as CharacterRevisionRecord["issues"],
    issueSummary: (revision.issueSummary ?? buildIssueSummary()) as CharacterRevisionRecord["issueSummary"],
    createdAt: revision.createdAt.toISOString(),
    updatedAt: revision.updatedAt.toISOString()
  };
}

function mapCharacter(character: PrismaCharacterAggregate): CharacterRecord {
  const revisions = character.revisions.map(mapRevision);
  return {
    id: character.id,
    owner: mapUser(character.owner),
    contentPackVersion: mapContentPackVersion(character.contentPackVersion),
    name: character.name,
    rulesetId: character.rulesetId,
    experienceMode: character.experienceMode as CharacterRecord["experienceMode"],
    notes: character.notes,
    state: character.state,
    latestDerived: character.latestDerived,
    latestIssues: (Array.isArray(character.latestIssues) ? character.latestIssues : []) as CharacterRecord["latestIssues"],
    issueSummary: (character.issueSummary ?? buildIssueSummary()) as CharacterRecord["issueSummary"],
    latestRevision: revisions[revisions.length - 1],
    revisions,
    createdAt: character.createdAt.toISOString(),
    updatedAt: character.updatedAt.toISOString()
  };
}

function mapSeat(seat: PrismaSessionAggregate["seats"][number]): SessionSeatRecord {
  return {
    id: seat.id,
    user: mapUser(seat.user),
    displayName: seat.displayName,
    role: seat.role as SessionSeatRecord["role"],
    joinedAt: seat.joinedAt.toISOString(),
    updatedAt: seat.updatedAt.toISOString()
  };
}

function mapSessionImport(sessionImport: PrismaSessionAggregate["imports"][number]): SessionImportRecord {
  return {
    id: sessionImport.id,
    sessionId: sessionImport.sessionId,
    characterId: sessionImport.characterId,
    submittedByUser: mapUser(sessionImport.submittedByUser),
    submittedByName: sessionImport.submittedByName,
    status: sessionImport.status as SessionImportRecord["status"],
    note: sessionImport.note,
    createdAt: sessionImport.createdAt.toISOString(),
    updatedAt: sessionImport.updatedAt.toISOString(),
    character: {
      id: sessionImport.character.id,
      name: sessionImport.character.name,
      rulesetId: sessionImport.character.rulesetId,
      experienceMode: sessionImport.character.experienceMode as SessionImportRecord["character"]["experienceMode"],
      updatedAt: sessionImport.character.updatedAt.toISOString()
    }
  };
}

function mapSession(session: PrismaSessionAggregate): SessionRecord {
  return {
    id: session.id,
    owner: mapUser(session.owner),
    title: session.title,
    rulesetId: session.rulesetId,
    joinCode: session.joinCode,
    status: session.status as SessionRecord["status"],
    seats: session.seats.map(mapSeat),
    imports: session.imports.map(mapSessionImport),
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString()
  };
}

export class PrismaForgeRepository implements ForgeRepository {
  constructor(private readonly client: PrismaClient) {}

  async upsertUser(input: UserRefInput): Promise<UserRecord> {
    const email = input.email?.toLowerCase();
    if (!email) {
      const user = await this.client.user.create({
        data: {
          name: input.name
        }
      });
      return mapUser(user)!;
    }

    const user = await this.client.user.upsert({
      where: { email },
      update: { name: input.name },
      create: {
        name: input.name,
        email
      }
    });

    return mapUser(user)!;
  }

  async upsertContentPackVersion(input: ContentPackVersionInput): Promise<ContentPackVersionRecord> {
    const contentPackVersion = await this.client.contentPackVersion.upsert({
      where: {
        rulesetId_version: {
          rulesetId: input.rulesetId,
          version: input.version
        }
      },
      update: {
        label: input.label ?? undefined,
        checksum: input.checksum ?? undefined
      },
      create: {
        rulesetId: input.rulesetId,
        version: input.version,
        label: input.label,
        checksum: input.checksum
      }
    });

    return mapContentPackVersion(contentPackVersion)!;
  }

  async listCharacters(options: CharacterListOptions = {}): Promise<CharacterRecord[]> {
    const search = options.search?.trim();
    const characters = await this.client.character.findMany({
      where: {
        rulesetId: options.rulesetId || undefined,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { notes: { contains: search, mode: "insensitive" as const } },
                { owner: { name: { contains: search, mode: "insensitive" as const } } }
              ]
            }
          : {})
      },
      orderBy: {
        updatedAt: "desc"
      },
      take: Math.max(1, Math.min(options.limit ?? 50, 100)),
      include: characterInclude
    });

    return characters.map(mapCharacter);
  }

  async createCharacter(
    input: CharacterCreateInput["character"],
    owner: UserRecord | null,
    contentPackVersion: ContentPackVersionRecord | null
  ): Promise<CharacterRecord> {
    const issues = input.snapshot.issues;
    const issueSummary = buildIssueSummary(issues);

    const character = await this.client.character.create({
      data: {
        name: input.name,
        rulesetId: input.rulesetId,
        experienceMode: input.experienceMode,
        notes: input.notes ?? null,
        state: toJson(input.snapshot.state),
        latestDerived: toJson(input.snapshot.derived ?? null),
        latestIssues: toJson(issues),
        issueSummary: toJson(issueSummary),
        owner: owner ? { connect: { id: owner.id } } : undefined,
        contentPackVersion: contentPackVersion ? { connect: { id: contentPackVersion.id } } : undefined,
        revisions: {
          create: {
            revisionNumber: 1,
            reason: "Initial publish",
            state: toJson(input.snapshot.state),
            derived: toJson(input.snapshot.derived ?? null),
            issues: toJson(issues),
            issueSummary: toJson(issueSummary)
          }
        }
      },
      include: characterInclude
    });

    return mapCharacter(character);
  }

  async getCharacter(id: string): Promise<CharacterRecord | null> {
    const character = await this.client.character.findUnique({
      where: { id },
      include: characterInclude
    });

    return character ? mapCharacter(character) : null;
  }

  async createCharacterRevision(characterId: string, input: CharacterRevisionCreateInput): Promise<CharacterRecord | null> {
    const issues = input.snapshot.issues;
    const issueSummary = buildIssueSummary(issues);

    const character = await this.client.$transaction(async (tx: any) => {
      const existing = await tx.character.findUnique({
        where: { id: characterId },
        include: {
          revisions: {
            select: {
              revisionNumber: true
            },
            orderBy: {
              revisionNumber: "desc"
            },
            take: 1
          }
        }
      });

      if (!existing) {
        return null;
      }

      const nextRevisionNumber = (existing.revisions[0]?.revisionNumber ?? 0) + 1;

      await tx.characterRevision.create({
        data: {
          characterId,
          revisionNumber: nextRevisionNumber,
          reason: input.reason ?? null,
          state: toJson(input.snapshot.state),
          derived: toJson(input.snapshot.derived ?? null),
          issues: toJson(issues),
          issueSummary: toJson(issueSummary)
        }
      });

      await tx.character.update({
        where: { id: characterId },
        data: {
          state: toJson(input.snapshot.state),
          latestDerived: toJson(input.snapshot.derived ?? null),
          latestIssues: toJson(issues),
          issueSummary: toJson(issueSummary)
        }
      });

      return tx.character.findUnique({
        where: { id: characterId },
        include: characterInclude
      });
    });

    return character ? mapCharacter(character) : null;
  }

  async restoreCharacterRevision(characterId: string, revisionId: string, reason?: string): Promise<CharacterRecord | null> {
    const revision = await this.client.characterRevision.findUnique({
      where: { id: revisionId }
    });
    if (!revision || revision.characterId !== characterId) {
      return null;
    }

    return this.createCharacterRevision(characterId, {
      reason: reason ?? `Restored revision #${revision.revisionNumber}`,
      snapshot: {
        state: revision.state,
        derived: revision.derived ?? undefined,
        issues: (Array.isArray(revision.issues) ? revision.issues : []) as CharacterRevisionCreateInput["snapshot"]["issues"]
      }
    });
  }

  async deleteCharacter(characterId: string): Promise<boolean> {
    try {
      await this.client.character.delete({
        where: { id: characterId }
      });
      return true;
    } catch {
      return false;
    }
  }

  async createSession(input: SessionCreateInput, owner: UserRecord | null): Promise<SessionRecord> {
    const requestedSeats = [...input.seats];
    if (owner && !requestedSeats.some((seat) => seat.role === "DM")) {
      requestedSeats.unshift({
        displayName: owner.name,
        role: "DM"
      });
    }

    let joinCode = makeJoinCode();
    for (let attempts = 0; attempts < 12; attempts += 1) {
      const exists = await this.client.session.findUnique({ where: { joinCode } });
      if (!exists) {
        break;
      }
      joinCode = makeJoinCode();
    }

    const session = await this.client.session.create({
      data: {
        title: input.title,
        rulesetId: input.rulesetId,
        joinCode,
        status: "ACTIVE",
        owner: owner ? { connect: { id: owner.id } } : undefined,
        seats: {
          create: requestedSeats.map((seat) => ({
            displayName: seat.displayName,
            role: seat.role,
            userId: owner && seat.displayName === owner.name ? owner.id : undefined
          }))
        }
      },
      include: sessionInclude
    });

    return mapSession(session);
  }

  async getSession(id: string): Promise<SessionRecord | null> {
    const session = await this.client.session.findUnique({
      where: { id },
      include: sessionInclude
    });

    return session ? mapSession(session) : null;
  }

  async getSessionByJoinCode(joinCode: string): Promise<SessionRecord | null> {
    const session = await this.client.session.findUnique({
      where: { joinCode: joinCode.trim().toUpperCase() },
      include: sessionInclude
    });

    return session ? mapSession(session) : null;
  }

  async updateSessionStatus(sessionId: string, input: SessionStatusUpdateInput): Promise<SessionRecord | null> {
    try {
      const session = await this.client.session.update({
        where: { id: sessionId },
        data: {
          status: input.status
        },
        include: sessionInclude
      });
      return mapSession(session);
    } catch {
      return null;
    }
  }

  async createSessionSeat(sessionId: string, input: SessionSeatCreateInput, user: UserRecord | null): Promise<SessionRecord | null> {
    const session = await this.client.$transaction(async (tx: any) => {
      const existing = await tx.session.findUnique({ where: { id: sessionId } });
      if (!existing) {
        return null;
      }

      await tx.sessionSeat.create({
        data: {
          sessionId,
          displayName: input.displayName,
          role: input.role,
          userId: user?.id
        }
      });

      return tx.session.findUnique({
        where: { id: sessionId },
        include: sessionInclude
      });
    });

    return session ? mapSession(session) : null;
  }

  async createSessionImport(
    sessionId: string,
    input: SessionImportCreateInput,
    submittedBy: UserRecord | null
  ): Promise<SessionImportResult | null> {
    const result = await this.client.$transaction(async (tx: any) => {
      const session = await tx.session.findUnique({ where: { id: sessionId } });
      const character = await tx.character.findUnique({ where: { id: input.characterId } });

      if (!session || !character) {
        return null;
      }

      const sessionImport = await tx.sessionImport.create({
        data: {
          sessionId,
          characterId: input.characterId,
          submittedByName: input.submittedBy?.name ?? submittedBy?.name ?? null,
          note: input.note ?? null,
          submittedByUserId: submittedBy?.id
        }
      });

      const aggregateSession = await tx.session.findUnique({
        where: { id: sessionId },
        include: sessionInclude
      });

      return {
        sessionImportId: sessionImport.id,
        session: aggregateSession
      };
    });

    if (!result?.session) {
      return null;
    }

    const session = mapSession(result.session);
    const sessionImport = session.imports.find((entry) => entry.id === result.sessionImportId);
    if (!sessionImport) {
      return null;
    }

    return {
      session,
      sessionImport
    };
  }

  async updateSessionImportStatus(
    sessionId: string,
    importId: string,
    input: SessionImportReviewInput
  ): Promise<SessionImportResult | null> {
    const result = await this.client.$transaction(async (tx: any) => {
      const existing = await tx.sessionImport.findUnique({
        where: { id: importId }
      });
      if (!existing || existing.sessionId !== sessionId) {
        return null;
      }

      await tx.sessionImport.update({
        where: { id: importId },
        data: {
          status: input.status,
          note: input.note ?? undefined
        }
      });

      const session = await tx.session.findUnique({
        where: { id: sessionId },
        include: sessionInclude
      });

      return session;
    });

    if (!result) {
      return null;
    }

    const session = mapSession(result);
    const sessionImport = session.imports.find((entry) => entry.id === importId);
    if (!sessionImport) {
      return null;
    }

    return {
      session,
      sessionImport
    };
  }

  async close(): Promise<void> {
    await this.client.$disconnect();
  }
}
