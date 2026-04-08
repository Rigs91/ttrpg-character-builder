import { afterEach, describe, expect, it, vi } from "vitest";
import { createDefaultDraft } from "@forge/rules-core";

import { OllamaCharacterAiService, pickDefaultModel } from "../src/ai/characterAssistService.js";
import { AiServiceError } from "../src/ai/errors.js";
import { OllamaClient } from "../src/ai/ollamaClient.js";

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("OllamaCharacterAiService", () => {
  it("prefers qwen2.5 instruct as the default model when available", () => {
    const selected = pickDefaultModel([
      { name: "qwen3:8b" },
      { name: "qwen2.5:7b-instruct" }
    ]);

    expect(selected).toBe("qwen2.5:7b-instruct");
  });

  it("reports Ollama as unavailable when model discovery fails", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new Error("offline"));
    const service = new OllamaCharacterAiService(new OllamaClient("http://localhost:11434", fetchMock));

    const catalog = await service.getModelCatalog();
    expect(catalog.available).toBe(false);
    expect(catalog.models).toEqual([]);
  });

  it("builds a structured assist preview from Ollama JSON output", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({
        models: [
          {
            name: "qwen2.5:7b-instruct",
            details: { family: "qwen2" }
          }
        ]
      }))
      .mockResolvedValueOnce(jsonResponse({
        response: JSON.stringify({
          name: "Aria",
          characterClass: "Cleric",
          species: "Dwarf",
          level: 3
        })
      }));
    const service = new OllamaCharacterAiService(new OllamaClient("http://localhost:11434", fetchMock));

    const result = await service.assist({
      messages: [{ role: "user", content: "Make me a dwarven cleric named Aria at level 3." }],
      currentDraft: createDefaultDraft("5e-2024"),
      activeStep: "identity"
    });

    expect(result.previewDraft.name).toBe("Aria");
    expect(result.previewDraft.classId).toBe("5e24-class-cleric");
    expect(result.previewDraft.speciesId).toBe("5e24-species-dwarf");
    expect(result.modelUsed).toBe("qwen2.5:7b-instruct");
  });

  it("drops hallucinated risky fields when the user did not ask for them", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({
        models: [
          {
            name: "qwen2.5:7b-instruct",
            details: { family: "qwen2" }
          }
        ]
      }))
      .mockResolvedValueOnce(jsonResponse({
        response: JSON.stringify({
          name: "Aria",
          characterClass: "Cleric",
          species: "Dwarf",
          level: 3,
          background: "Sage",
          subclass: "Devoted Defender",
          abilities: {
            wis: 18
          }
        })
      }));
    const service = new OllamaCharacterAiService(new OllamaClient("http://localhost:11434", fetchMock));

    const result = await service.assist({
      messages: [{ role: "user", content: "Make me a level 3 dwarven cleric named Aria focused on healing and defense." }],
      currentDraft: createDefaultDraft("5e-2024"),
      activeStep: "identity"
    });

    expect(result.previewDraft.name).toBe("Aria");
    expect(result.previewDraft.classId).toBe("5e24-class-cleric");
    expect(result.previewDraft.speciesId).toBe("5e24-species-dwarf");
    expect(result.patch.backgroundId).toBeUndefined();
    expect(result.patch.assignedScores).toBeUndefined();
    expect(result.issues.some((issue) => issue.code === "ability.too_high")).toBe(false);
    expect(result.issues.some((issue) => issue.code === "character.subclass.invalid")).toBe(false);
    expect(result.unresolvedQuestions.some((question) => question.prompt.includes("Devoted Defender"))).toBe(false);
  });

  it("rejects malformed JSON responses from the model", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({
        models: [
          {
            name: "qwen2.5:7b-instruct",
            details: { family: "qwen2" }
          }
        ]
      }))
      .mockResolvedValueOnce(jsonResponse({
        response: "not-json"
      }));
    const service = new OllamaCharacterAiService(new OllamaClient("http://localhost:11434", fetchMock));

    await expect(service.assist({
      messages: [{ role: "user", content: "Make me a cleric." }],
      currentDraft: createDefaultDraft("5e-2024"),
      activeStep: "identity"
    })).rejects.toMatchObject({
      code: "ai.invalid_json",
      statusCode: 502
    });
  });

  it("rejects unsupported model selections", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(jsonResponse({
      models: [
        {
          name: "qwen2.5:7b-instruct",
          details: { family: "qwen2" }
        }
      ]
    }));
    const service = new OllamaCharacterAiService(new OllamaClient("http://localhost:11434", fetchMock));

    await expect(service.assist({
      messages: [{ role: "user", content: "Make me a cleric." }],
      currentDraft: createDefaultDraft("5e-2024"),
      activeStep: "identity",
      model: "qwen3:8b"
    })).rejects.toMatchObject({
      code: "ai.unsupported_model",
      statusCode: 400
    });
  });

  it("treats qwen3-style empty responses as a model failure", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({
        models: [
          {
            name: "qwen3:8b",
            details: { family: "qwen3" }
          }
        ]
      }))
      .mockResolvedValueOnce(jsonResponse({
        response: "",
        thinking: "I am still reasoning."
      }));
    const service = new OllamaCharacterAiService(new OllamaClient("http://localhost:11434", fetchMock));

    await expect(service.assist({
      messages: [{ role: "user", content: "Make me a fighter." }],
      currentDraft: createDefaultDraft("5e-2024"),
      activeStep: "identity"
    })).rejects.toMatchObject({
      code: "ai.empty_response",
      statusCode: 502
    });
  });
});
