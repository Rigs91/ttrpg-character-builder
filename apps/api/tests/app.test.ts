import { afterEach, describe, expect, it } from "vitest";
import { createDefaultDraft, type CharacterAssistRequest, type CharacterAssistResponse } from "@forge/rules-core";

import type { CharacterAiService } from "../src/ai/characterAssistService.js";
import { createApp } from "../src/app.js";
import type { ForgeRealtimeEvent } from "../src/contracts.js";
import { InMemoryForgeRepository } from "../src/repositories/inMemoryRepository.js";
import { SessionHub } from "../src/realtime/sessionHub.js";

async function buildTestHarness(aiService?: CharacterAiService) {
  const repository = new InMemoryForgeRepository();
  const sessionHub = new SessionHub();
  const app = await createApp({
    repository,
    sessionHub,
    logger: false,
    storageMode: "memory",
    aiService
  });

  return {
    repository,
    sessionHub,
    app
  };
}

function buildStubAiService(): CharacterAiService {
  return {
    async getModelCatalog() {
      return {
        available: true,
        defaultModel: "qwen2.5:7b-instruct",
        models: [
          {
            name: "qwen2.5:7b-instruct",
            family: "qwen2"
          }
        ]
      };
    },
    async assist(request: CharacterAssistRequest): Promise<CharacterAssistResponse> {
      const previewDraft = createDefaultDraft(request.currentDraft.rulesetId);
      previewDraft.name = "Aria";
      return {
        assistantMessage: "Aria is ready for review.",
        patch: {
          name: "Aria"
        },
        previewDraft,
        derived: null,
        issues: [],
        appliedFields: [
          {
            field: "name",
            label: "Character name",
            stepId: "identity",
            summary: "Character name -> Aria"
          }
        ],
        unresolvedQuestions: [],
        modelUsed: "qwen2.5:7b-instruct"
      };
    }
  };
}

const closers: Array<() => Promise<void>> = [];

afterEach(async () => {
  while (closers.length) {
    const close = closers.pop();
    if (close) {
      await close();
    }
  }
});

describe("Forge Character API", () => {
  it("creates, fetches, and revises characters while publishing websocket events", async () => {
    const { app, sessionHub } = await buildTestHarness();
    closers.push(() => app.close());

    const events: ForgeRealtimeEvent[] = [];
    const unsubscribe = sessionHub.subscribeGlobal((event) => {
      events.push(event);
    });

    const createResponse = await app.inject({
      method: "POST",
      url: "/api/characters",
      payload: {
        owner: {
          name: "Nyx Vale",
          email: "nyx@example.com"
        },
        contentPack: {
          rulesetId: "5e-2014",
          version: "2026.03.12",
          label: "SRD Spring Build"
        },
        character: {
          name: "Aelar Dawn",
          rulesetId: "5e-2014",
          experienceMode: "new",
          notes: "Scout and archer.",
          snapshot: {
            state: {
              level: 1,
              classId: "fighter"
            },
            derived: {
              armorClass: 15,
              hitPoints: 12
            },
            issues: [
              {
                code: "item.none_selected",
                severity: "warning",
                message: "Select starting gear."
              }
            ]
          }
        }
      }
    });

    expect(createResponse.statusCode).toBe(201);
    const createdBody = createResponse.json() as { character: { id: string; latestRevision: { revisionNumber: number } } };
    expect(createdBody.character.latestRevision.revisionNumber).toBe(1);
    expect(events.at(-1)?.type).toBe("character.published");

    const getResponse = await app.inject({
      method: "GET",
      url: `/api/characters/${createdBody.character.id}`
    });

    expect(getResponse.statusCode).toBe(200);
    const fetchedBody = getResponse.json() as { character: { id: string; revisions: Array<{ revisionNumber: number }> } };
    expect(fetchedBody.character.id).toBe(createdBody.character.id);
    expect(fetchedBody.character.revisions).toHaveLength(1);

    const reviseResponse = await app.inject({
      method: "POST",
      url: `/api/characters/${createdBody.character.id}/revisions`,
      payload: {
        reason: "Level 2 update",
        snapshot: {
          state: {
            level: 2,
            classId: "fighter"
          },
          derived: {
            armorClass: 16,
            hitPoints: 20
          },
          issues: []
        }
      }
    });

    expect(reviseResponse.statusCode).toBe(201);
    const revisedBody = reviseResponse.json() as {
      character: { latestRevision: { revisionNumber: number }; revisions: Array<{ revisionNumber: number }> };
    };
    expect(revisedBody.character.latestRevision.revisionNumber).toBe(2);
    expect(revisedBody.character.revisions).toHaveLength(2);
    expect(events.map((event) => event.type)).toEqual(["character.published", "character.published"]);

    unsubscribe();
  });

  it("creates sessions, records imports, and emits session join/import/roster events", async () => {
    const { app, sessionHub, repository } = await buildTestHarness();
    closers.push(() => app.close());

    const globalEvents: ForgeRealtimeEvent[] = [];
    const sessionEvents: ForgeRealtimeEvent[] = [];
    const unsubscribeGlobal = sessionHub.subscribeGlobal((event) => {
      globalEvents.push(event);
    });

    const characterResponse = await app.inject({
      method: "POST",
      url: "/api/characters",
      payload: {
        character: {
          name: "Thera",
          rulesetId: "3.5e",
          experienceMode: "experienced",
          notes: "Veteran spellblade.",
          snapshot: {
            state: {
              level: 5,
              classId: "wizard"
            },
            derived: {
              baseAttackBonus: 2
            },
            issues: []
          }
        }
      }
    });
    const characterId = (characterResponse.json() as { character: { id: string } }).character.id;

    const sessionResponse = await app.inject({
      method: "POST",
      url: "/api/sessions",
      payload: {
        owner: {
          name: "GM Rowan",
          email: "gm@example.com"
        },
        title: "Temple of Smoke",
        rulesetId: "3.5e",
        seats: [
          {
            displayName: "Rogue Seat",
            role: "PLAYER"
          }
        ]
      }
    });

    expect(sessionResponse.statusCode).toBe(201);
    const sessionBody = sessionResponse.json() as { session: { id: string; seats: Array<unknown>; joinCode: string } };
    const sessionId = sessionBody.session.id;
    expect(sessionBody.session.seats.length).toBe(2);
    expect(sessionBody.session.joinCode).toHaveLength(6);

    const unsubscribeSession = sessionHub.subscribeSession(sessionId, (event) => {
      sessionEvents.push(event);
    });
    const storedSession = await repository.getSession(sessionId);
    if (!storedSession) {
      throw new Error("Expected session to exist in the repository.");
    }
    sessionHub.emitSessionJoined(storedSession);
    expect(sessionEvents[0]?.type).toBe("session.joined");

    const importResponse = await app.inject({
      method: "POST",
      url: `/api/sessions/${sessionId}/imports`,
      payload: {
        characterId,
        submittedBy: {
          name: "Player Ember"
        },
        note: "Requesting entry to the roster."
      }
    });

    expect(importResponse.statusCode).toBe(201);
    const importedBody = importResponse.json() as {
      session: { imports: Array<{ id: string }> };
      sessionImport: { status: string; characterId: string };
    };
    expect(importedBody.sessionImport.status).toBe("PENDING");
    expect(importedBody.sessionImport.characterId).toBe(characterId);
    expect(importedBody.session.imports).toHaveLength(1);
    expect(sessionEvents.map((event) => event.type)).toEqual([
      "session.joined",
      "character.imported",
      "session.roster.updated"
    ]);

    const fetchedSessionResponse = await app.inject({
      method: "GET",
      url: `/api/sessions/${sessionId}`
    });

    expect(fetchedSessionResponse.statusCode).toBe(200);
    const fetchedSession = fetchedSessionResponse.json() as {
      session: { imports: Array<{ characterId: string }>; seats: Array<unknown> };
    };
    expect(fetchedSession.session.imports[0]?.characterId).toBe(characterId);
    expect(fetchedSession.session.seats.length).toBe(2);
    expect(globalEvents.some((event) => event.type === "character.imported")).toBe(true);
    expect(globalEvents.some((event) => event.type === "session.roster.updated")).toBe(true);

    unsubscribeSession();
    unsubscribeGlobal();
  });

  it("exposes AI capabilities and assist routes when an AI service is configured", async () => {
    const { app } = await buildTestHarness(buildStubAiService());
    closers.push(() => app.close());

    const healthResponse = await app.inject({
      method: "GET",
      url: "/health"
    });

    expect(healthResponse.statusCode).toBe(200);
    const healthBody = healthResponse.json() as { capabilities: { ai: boolean } };
    expect(healthBody.capabilities.ai).toBe(true);

    const modelResponse = await app.inject({
      method: "GET",
      url: "/api/ai/models"
    });

    expect(modelResponse.statusCode).toBe(200);
    const modelBody = modelResponse.json() as { defaultModel: string; models: Array<{ name: string }> };
    expect(modelBody.defaultModel).toBe("qwen2.5:7b-instruct");
    expect(modelBody.models[0]?.name).toBe("qwen2.5:7b-instruct");

    const assistResponse = await app.inject({
      method: "POST",
      url: "/api/ai/character-assist",
      payload: {
        messages: [{ role: "user", content: "Make me a cleric named Aria." }],
        currentDraft: createDefaultDraft("5e-2024"),
        activeStep: "identity"
      }
    });

    expect(assistResponse.statusCode).toBe(200);
    const assistBody = assistResponse.json() as { previewDraft: { name: string }; modelUsed: string };
    expect(assistBody.previewDraft.name).toBe("Aria");
    expect(assistBody.modelUsed).toBe("qwen2.5:7b-instruct");
  });
});
