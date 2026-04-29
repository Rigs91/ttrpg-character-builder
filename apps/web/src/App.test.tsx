import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { createDefaultDraft } from "@forge/rules-core";

import App from "./App";

function jsonResponse(payload: unknown, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  }));
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("App", () => {
  it("renders the builder workspace shell and initial step rail", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockImplementation((input, init) => {
      const url = String(input);
      if (url.endsWith("/api/ai/models")) {
        return jsonResponse({
          available: true,
          defaultModel: "qwen2.5:7b-instruct",
          models: [
            {
              name: "qwen2.5:7b-instruct"
            }
          ]
        });
      }
      return jsonResponse({ message: `Unhandled request ${url}`, method: init?.method || "GET" }, 500);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("AI ready")).toBeTruthy();
    });

    expect(screen.getByRole("heading", { name: "Forge Character Workspace" })).toBeTruthy();
    expect(screen.getByText("Guided TTRPG Character Builder")).toBeTruthy();
    expect(screen.getByText("Build readiness")).toBeTruthy();
    expect(screen.getByText("Next best action")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Ruleset/ })).toBeTruthy();
    expect(screen.getByText("Current step diagnostics")).toBeTruthy();
    expect(screen.getByText("AI Draft Agent")).toBeTruthy();
  });

  it("applies a reviewable AI preview back into the builder form", async () => {
    const previewDraft = createDefaultDraft("5e-2024");
    previewDraft.name = "Aria";
    previewDraft.classId = "5e24-class-cleric";
    previewDraft.speciesId = "5e24-species-dwarf";
    previewDraft.level = 3;

    const fetchMock = vi.fn<typeof fetch>().mockImplementation((input) => {
      const url = String(input);
      if (url.endsWith("/api/ai/models")) {
        return jsonResponse({
          available: true,
          defaultModel: "qwen2.5:7b-instruct",
          models: [
            {
              name: "qwen2.5:7b-instruct"
            }
          ]
        });
      }
      if (url.endsWith("/api/ai/character-assist")) {
        return jsonResponse({
          assistantMessage: "Aria is ready for review.",
          patch: {
            name: "Aria",
            classId: "5e24-class-cleric",
            speciesId: "5e24-species-dwarf",
            level: 3
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
            },
            {
              field: "classId",
              label: "Class",
              stepId: "identity",
              summary: "Class -> Cleric"
            }
          ],
          unresolvedQuestions: [],
          modelUsed: "qwen2.5:7b-instruct"
        });
      }
      return jsonResponse({ message: `Unhandled request ${url}` }, 500);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("AI ready")).toBeTruthy();
    });

    fireEvent.change(
      screen.getByPlaceholderText("Example: make me a level 3 dwarven cleric focused on defense and healing."),
      { target: { value: "Make me a level 3 dwarven cleric named Aria." } }
    );
    fireEvent.click(screen.getByRole("button", { name: "Generate reviewable draft" }));

    await waitFor(() => {
      expect(screen.getByText("Review proposal")).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: "Apply preview" }));
    fireEvent.click(screen.getByRole("button", { name: /Identity/ }));

    await waitFor(() => {
      expect(screen.getByDisplayValue("Aria")).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: "Undo Applied AI draft preview" }));

    await waitFor(() => {
      expect(screen.queryByDisplayValue("Aria")).toBeNull();
    });
  });
});
