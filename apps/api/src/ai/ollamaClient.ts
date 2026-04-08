import { AiServiceError } from "./errors.js";

interface OllamaModelTag {
  name: string;
  size?: number;
  modified_at?: string;
  details?: {
    family?: string;
  };
}

interface OllamaTagsResponse {
  models?: OllamaModelTag[];
}

interface OllamaGenerateResponse {
  response?: string;
  thinking?: string;
}

export class OllamaClient {
  constructor(
    private readonly baseUrl = "http://localhost:11434",
    private readonly fetchImpl: typeof fetch = globalThis.fetch.bind(globalThis)
  ) {}

  async listModels() {
    const response = await this.fetchImpl(`${this.baseUrl}/api/tags`);
    if (!response.ok) {
      throw new AiServiceError("ai.ollama_unavailable", `Ollama tags request failed with status ${response.status}.`, 503);
    }

    const payload = (await response.json()) as OllamaTagsResponse;
    return payload.models ?? [];
  }

  async generateJson(model: string, prompt: string) {
    const response = await this.fetchImpl(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0.2,
          num_predict: 512
        }
      })
    });

    if (!response.ok) {
      throw new AiServiceError("ai.ollama_generate_failed", `Ollama generation failed with status ${response.status}.`, 502);
    }

    return (await response.json()) as OllamaGenerateResponse;
  }
}

export type { OllamaModelTag };
