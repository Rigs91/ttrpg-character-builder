import { characterAssistRequestSchema, type AiModelCatalogResponse } from "@forge/rules-core";
import type { FastifyInstance } from "fastify";

import { AiServiceError } from "../ai/errors.js";
import type { CharacterAiService } from "../ai/characterAssistService.js";

export async function registerAiRoutes(app: FastifyInstance, aiService: CharacterAiService): Promise<void> {
  app.get("/api/ai/models", async (request) => {
    const query = request.query as { refresh?: string };
    const catalog = await aiService.getModelCatalog({ forceRefresh: query.refresh === "true" });
    return catalog satisfies AiModelCatalogResponse;
  });

  app.post("/api/ai/character-assist", async (request, reply) => {
    try {
      const payload = characterAssistRequestSchema.parse(request.body);
      return await aiService.assist(payload);
    } catch (error) {
      if (error instanceof AiServiceError) {
        return reply.code(error.statusCode).send({
          error: {
            code: error.code,
            message: error.message,
            requestId: request.id
          }
        });
      }
      throw error;
    }
  });
}
