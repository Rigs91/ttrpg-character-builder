import { createCharacterAiService } from "./ai/characterAssistService.js";
import { createRepositoryFromEnv } from "./createRepositoryFromEnv.js";
import { createApp } from "./app.js";

async function main(): Promise<void> {
  const port = Number(process.env.PORT || 8787);
  const host = process.env.HOST || "0.0.0.0";
  const { repository, storageMode } = await createRepositoryFromEnv();
  const aiService = createCharacterAiService();
  const app = await createApp({
    repository,
    storageMode,
    logger: true,
    aiService
  });

  try {
    await app.listen({ port, host });
    app.log.info(`Forge Character API listening on http://${host}:${port} (${storageMode})`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void main();
