import type { FastifyInstance } from "fastify";

import { sessionCreateSchema, sessionImportCreateSchema } from "../contracts.js";
import type { ForgeRepository } from "../repositories/types.js";
import { SessionHub } from "../realtime/sessionHub.js";

export async function registerSessionRoutes(
  app: FastifyInstance,
  repository: ForgeRepository,
  sessionHub: SessionHub
): Promise<void> {
  app.get("/api/sessions/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const session = await repository.getSession(params.id);
    if (!session) {
      return reply.code(404).send({
        message: `Session ${params.id} was not found.`
      });
    }

    return {
      session
    };
  });

  app.post("/api/sessions", async (request, reply) => {
    const payload = sessionCreateSchema.parse(request.body);
    const owner = payload.owner ? await repository.upsertUser(payload.owner) : null;
    const session = await repository.createSession(payload, owner);

    return reply.code(201).send({
      session
    });
  });

  app.post("/api/sessions/:id/imports", async (request, reply) => {
    const params = request.params as { id: string };
    const payload = sessionImportCreateSchema.parse(request.body);
    const submittedBy = payload.submittedBy ? await repository.upsertUser(payload.submittedBy) : null;
    const result = await repository.createSessionImport(params.id, payload, submittedBy);

    if (!result) {
      return reply.code(404).send({
        message: `Session ${params.id} or character ${payload.characterId} was not found.`
      });
    }

    sessionHub.emitCharacterImported(result.session, result.sessionImport);
    sessionHub.emitSessionRosterUpdated(result.session);

    return reply.code(201).send({
      session: result.session,
      sessionImport: result.sessionImport
    });
  });
}
