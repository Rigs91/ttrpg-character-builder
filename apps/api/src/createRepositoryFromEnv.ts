import { PrismaClient } from "@prisma/client";

import type { ForgeRepository } from "./repositories/types.js";
import { InMemoryForgeRepository } from "./repositories/inMemoryRepository.js";
import { PrismaForgeRepository } from "./repositories/prismaRepository.js";

export interface RepositoryResolution {
  repository: ForgeRepository;
  storageMode: "memory" | "prisma";
}

export async function createRepositoryFromEnv(): Promise<RepositoryResolution> {
  const requestedMode = process.env.FORGE_STORAGE?.toLowerCase();
  const shouldUsePrisma = requestedMode === "prisma" || (!requestedMode && Boolean(process.env.DATABASE_URL));

  if (!shouldUsePrisma) {
    return {
      repository: new InMemoryForgeRepository(),
      storageMode: "memory"
    };
  }

  try {
    const client = new PrismaClient();
    await client.$connect();
    return {
      repository: new PrismaForgeRepository(client),
      storageMode: "prisma"
    };
  } catch (error) {
    if (requestedMode === "prisma") {
      throw error;
    }

    console.warn("Prisma storage was unavailable. Falling back to in-memory API storage.");
    return {
      repository: new InMemoryForgeRepository(),
      storageMode: "memory"
    };
  }
}
