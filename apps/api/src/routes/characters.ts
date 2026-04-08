import type { FastifyInstance } from "fastify";

import { characterCreateSchema, characterRevisionCreateSchema } from "../contracts.js";
import type { ForgeRepository } from "../repositories/types.js";
import { SessionHub } from "../realtime/sessionHub.js";

export async function registerCharacterRoutes(
  app: FastifyInstance,
  repository: ForgeRepository,
  sessionHub: SessionHub
): Promise<void> {
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

    const character = await repository.createCharacter(payload.character, owner, contentPackVersion);
    sessionHub.emitCharacterPublished(character);

    return reply.code(201).send({
      character
    });
  });

  app.post("/api/characters/:id/revisions", async (request, reply) => {
    const params = request.params as { id: string };
    const payload = characterRevisionCreateSchema.parse(request.body);
    const character = await repository.createCharacterRevision(params.id, payload);
    if (!character) {
      return reply.code(404).send({
        message: `Character ${params.id} was not found.`
      });
    }

    sessionHub.emitCharacterPublished(character);

    return reply.code(201).send({
      character
    });
  });
}
