import type { FastifyInstance } from "fastify";
import type { CharacterDraft } from "@forge/rules-core";

import { characterCreateSchema, characterRevisionCreateSchema } from "../contracts.js";
import type { ForgeRepository } from "../repositories/types.js";
import { SessionHub } from "../realtime/sessionHub.js";
import {
  withAuthoritativeCreateSnapshot,
  withAuthoritativeRevisionSnapshot
} from "../rules/authoritativeSnapshot.js";

export async function registerCharacterRoutes(
  app: FastifyInstance,
  repository: ForgeRepository,
  sessionHub: SessionHub
): Promise<void> {
  app.get("/api/characters", async (request) => {
    const query = request.query as { search?: string; rulesetId?: string; limit?: string };
    const characters = repository.listCharacters
      ? await repository.listCharacters({
          search: query.search,
          rulesetId: query.rulesetId,
          limit: query.limit ? Number(query.limit) : undefined
        })
      : [];

    return {
      characters
    };
  });

  app.get("/api/characters/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const character = await repository.getCharacter(params.id);
    if (!character) {
      return reply.code(404).send({
        message: `Character ${params.id} was not found.`
      });
    }

    return {
      character
    };
  });

  app.post("/api/characters", async (request, reply) => {
    const payload = characterCreateSchema.parse(request.body);
    const owner = payload.owner ? await repository.upsertUser(payload.owner) : null;
    const contentPackVersion = payload.contentPack
      ? await repository.upsertContentPackVersion(payload.contentPack)
      : null;

    const authoritativeCharacter = withAuthoritativeCreateSnapshot(payload.character);
    const character = await repository.createCharacter(authoritativeCharacter, owner, contentPackVersion);
    sessionHub.emitCharacterPublished(character);

    return reply.code(201).send({
      character
    });
  });

  app.post("/api/characters/:id/revisions", async (request, reply) => {
    const params = request.params as { id: string };
    const payload = characterRevisionCreateSchema.parse(request.body);
    const existing = await repository.getCharacter(params.id);
    if (!existing) {
      return reply.code(404).send({
        error: {
          code: "character.not_found",
          message: `Character ${params.id} was not found.`,
          requestId: request.id
        }
      });
    }

    const currentDraft = existing.state && typeof existing.state === "object" ? existing.state as Partial<CharacterDraft> : null;
    const character = await repository.createCharacterRevision(
      params.id,
      withAuthoritativeRevisionSnapshot(payload, currentDraft)
    );
    if (!character) {
      return reply.code(404).send({
        error: {
          code: "character.not_found",
          message: `Character ${params.id} was not found.`,
          requestId: request.id
        }
      });
    }

    sessionHub.emitCharacterPublished(character);

    return reply.code(201).send({
      character
    });
  });

  app.post("/api/characters/:id/revisions/:revisionId/restore", async (request, reply) => {
    const params = request.params as { id: string; revisionId: string };
    if (!repository.restoreCharacterRevision) {
      return reply.code(501).send({
        error: {
          code: "character.restore_unsupported",
          message: "This repository does not support revision restore.",
          requestId: request.id
        }
      });
    }

    const character = await repository.restoreCharacterRevision(params.id, params.revisionId);
    if (!character) {
      return reply.code(404).send({
        error: {
          code: "character.revision_not_found",
          message: `Revision ${params.revisionId} was not found for character ${params.id}.`,
          requestId: request.id
        }
      });
    }

    sessionHub.emitCharacterPublished(character);
    return {
      character
    };
  });

  app.delete("/api/characters/:id", async (request, reply) => {
    const params = request.params as { id: string };
    if (!repository.deleteCharacter) {
      return reply.code(501).send({
        error: {
          code: "character.delete_unsupported",
          message: "This repository does not support character deletion.",
          requestId: request.id
        }
      });
    }

    const deleted = await repository.deleteCharacter(params.id);
    if (!deleted) {
      return reply.code(404).send({
        error: {
          code: "character.not_found",
          message: `Character ${params.id} was not found.`,
          requestId: request.id
        }
      });
    }

    return reply.code(204).send();
  });
}
