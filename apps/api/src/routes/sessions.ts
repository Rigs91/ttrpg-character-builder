import type { FastifyInstance } from "fastify";

import {
  sessionCreateSchema,
  sessionImportCreateSchema,
  sessionImportReviewSchema,
  sessionSeatCreateSchema,
  sessionStatusUpdateSchema
} from "../contracts.js";
import type { ForgeRepository } from "../repositories/types.js";
import { SessionHub } from "../realtime/sessionHub.js";

export async function registerSessionRoutes(
  app: FastifyInstance,
  repository: ForgeRepository,
  sessionHub: SessionHub
): Promise<void> {
  app.get("/api/sessions/join/:joinCode", async (request, reply) => {
    const params = request.params as { joinCode: string };
    const session = repository.getSessionByJoinCode
      ? await repository.getSessionByJoinCode(params.joinCode)
      : null;
    if (!session) {
      return reply.code(404).send({
        error: {
          code: "session.join_code_not_found",
          message: `Session join code ${params.joinCode} was not found.`,
          requestId: request.id
        }
      });
    }

    return {
      session
    };
  });

  app.get("/api/sessions/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const session = await repository.getSession(params.id);
    if (!session) {
      return reply.code(404).send({
        error: {
          code: "session.not_found",
          message: `Session ${params.id} was not found.`,
          requestId: request.id
        }
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
        error: {
          code: "session.import_target_not_found",
          message: `Session ${params.id} or character ${payload.characterId} was not found.`,
          requestId: request.id
        }
      });
    }

    sessionHub.emitCharacterImported(result.session, result.sessionImport);
    sessionHub.emitSessionRosterUpdated(result.session);

    return reply.code(201).send({
      session: result.session,
      sessionImport: result.sessionImport
    });
  });

  app.patch("/api/sessions/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const payload = sessionStatusUpdateSchema.parse(request.body);
    if (!repository.updateSessionStatus) {
      return reply.code(501).send({
        error: {
          code: "session.status_unsupported",
          message: "This repository does not support session status updates.",
          requestId: request.id
        }
      });
    }

    const session = await repository.updateSessionStatus(params.id, payload);
    if (!session) {
      return reply.code(404).send({
        error: {
          code: "session.not_found",
          message: `Session ${params.id} was not found.`,
          requestId: request.id
        }
      });
    }

    sessionHub.emitSessionRosterUpdated(session);
    return { session };
  });

  app.post("/api/sessions/:id/seats", async (request, reply) => {
    const params = request.params as { id: string };
    const payload = sessionSeatCreateSchema.parse(request.body);
    if (!repository.createSessionSeat) {
      return reply.code(501).send({
        error: {
          code: "session.seat_unsupported",
          message: "This repository does not support session seat updates.",
          requestId: request.id
        }
      });
    }

    const user = payload.user ? await repository.upsertUser(payload.user) : null;
    const session = await repository.createSessionSeat(params.id, payload, user);
    if (!session) {
      return reply.code(404).send({
        error: {
          code: "session.not_found",
          message: `Session ${params.id} was not found.`,
          requestId: request.id
        }
      });
    }

    sessionHub.emitSessionRosterUpdated(session);
    return reply.code(201).send({ session });
  });

  app.patch("/api/sessions/:id/imports/:importId", async (request, reply) => {
    const params = request.params as { id: string; importId: string };
    const payload = sessionImportReviewSchema.parse(request.body);
    if (!repository.updateSessionImportStatus) {
      return reply.code(501).send({
        error: {
          code: "session.import_review_unsupported",
          message: "This repository does not support import review.",
          requestId: request.id
        }
      });
    }

    const result = await repository.updateSessionImportStatus(params.id, params.importId, payload);
    if (!result) {
      return reply.code(404).send({
        error: {
          code: "session.import_not_found",
          message: `Import ${params.importId} was not found for session ${params.id}.`,
          requestId: request.id
        }
      });
    }

    sessionHub.emitCharacterImported(result.session, result.sessionImport);
    sessionHub.emitSessionRosterUpdated(result.session);
    return {
      session: result.session,
      sessionImport: result.sessionImport
    };
  });
}
