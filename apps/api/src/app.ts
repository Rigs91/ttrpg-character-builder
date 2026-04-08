import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";
import { ZodError } from "zod";

import type { CharacterAiService } from "./ai/characterAssistService.js";
import type { ForgeRepository } from "./repositories/types.js";
import { SessionHub } from "./realtime/sessionHub.js";
import { registerAiRoutes } from "./routes/ai.js";
import { registerRealtimeRoutes } from "./realtime/registerRealtimeRoutes.js";
import { registerCharacterRoutes } from "./routes/characters.js";
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

  await app.register(cors, {
    origin: true
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        message: "Request validation failed.",
        issues: error.issues
      });
    }

    app.log.error(error);
    return reply.code(500).send({
      message: "Unexpected API error."
    });
  });

  app.get("/health", async () => {
    const aiCatalog = options.aiService ? await options.aiService.getModelCatalog() : null;
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
