import { buildRulesPreview, RULESETS } from "@forge/rules-core";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

const rulesPreviewRequestSchema = z.object({
  draft: z.unknown()
});

export async function registerRulesRoutes(app: FastifyInstance): Promise<void> {
  app.post("/api/rules/preview", async (request) => {
    const payload = rulesPreviewRequestSchema.parse(request.body);
    return {
      preview: buildRulesPreview(payload.draft as Record<string, unknown>)
    };
  });

  app.get("/api/content-packs", async () => {
    return {
      contentPacks: RULESETS.map((ruleset) => {
        const preview = buildRulesPreview({ rulesetId: ruleset.id });
        return {
          rulesetId: ruleset.id,
          name: ruleset.name,
          shortName: ruleset.shortName,
          family: ruleset.family,
          editionYear: ruleset.editionYear,
          licenseNotice: ruleset.licenseNotice,
          counts: preview.contentPack.counts,
          percentages: preview.contentPack.percentages
        };
      })
    };
  });
}
