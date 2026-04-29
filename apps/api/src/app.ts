import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";
import { ZodError } from "zod";

import type { CharacterAiService } from "./ai/characterAssistService.js";
import type { ForgeRepository } from "./repositories/types.js";
import { SessionHub } from "./realtime/sessionHub.js";
import { registerAiRoutes } from "./routes/ai.js";
import { registerRealtimeRoutes } from "./realtime/registerRealtimeRoutes.js";
import { registerCharacterRoutes } from "./routes/characters.js";
import { registerRulesRoutes } from "./routes/rules.js";
import { registerSessionRoutes } from "./routes/sessions.js";

export interface CreateAppOptions {
  repository: ForgeRepository;
  sessionHub?: SessionHub;
  logger?: boolean;
  storageMode?: "memory" | "prisma";
  aiService?: CharacterAiService;
}

export async function createApp(options: CreateAppOptions): Promise<FastifyInstance> {
  const sessionHub = options.sessionHub ?? new SessionHub();
  const storageMode = options.storageMode ?? "memory";
  const app = Fastify({
    logger: options.logger ?? true
  });

  app.addHook("onRequest", async (request, reply) => {
    reply.header("X-Request-Id", request.id);
  });

  const configuredOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  await app.register(cors, {
    origin: configuredOrigins.length ? configuredOrigins : true
  });

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        error: {
          code: "request.validation_failed",
          message: "Request validation failed.",
          details: error.issues,
          requestId: request.id
        }
      });
    }

    app.log.error(error);
    return reply.code(500).send({
      error: {
        code: "api.unexpected_error",
        message: "Unexpected API error.",
        requestId: request.id
      }
    });
  });

  app.get("/health", async () => {
    const aiCatalog = options.aiService ? await options.aiService.getModelCatalog().catch(() => null) : null;
    return {
      status: "ok",
      storageMode,
      capabilities: {
        characters: true,
        revisions: true,
        sessions: true,
        realtime: true,
        ai: aiCatalog?.available ?? false
      }
    };
  });

  app.get("/ready", async () => {
    const aiCatalog = options.aiService ? await options.aiService.getModelCatalog() : null;
    return {
      status: aiCatalog && !aiCatalog.available ? "degraded" : "ready",
      storageMode,
      checks: {
        api: { ok: true },
        storage: { ok: true, mode: storageMode },
        ai: {
          ok: aiCatalog?.available ?? false,
          configured: Boolean(options.aiService),
          defaultModel: aiCatalog?.defaultModel ?? null,
          reason: aiCatalog?.reason
        }
      }
    };
  });

  await registerRulesRoutes(app);
  await registerRealtimeRoutes(app, options.repository, sessionHub);
  await registerCharacterRoutes(app, options.repository, sessionHub);
  await registerSessionRoutes(app, options.repository, sessionHub);
  if (options.aiService) {
    await registerAiRoutes(app, options.aiService);
  }

  app.addHook("onClose", async () => {
    if (options.repository.close) {
      await options.repository.close();
    }
  });

  return app;
}
