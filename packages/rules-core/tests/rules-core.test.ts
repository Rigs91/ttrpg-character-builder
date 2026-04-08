import { describe, expect, it } from "vitest";
import { buildParsableCharacterLines, createDefaultDraft, deriveCharacter, parseCharacterDraftJson, synthesizeCharacterAssist, validateCharacter } from "../src/index.js";

describe("rules core", () => {
  it("rejects illegal class spell choices", () => {
    const draft = createDefaultDraft("5e-2014");
    draft.name = "Bad Fighter";
    draft.classId = "5e14-class-fighter";
    draft.subclassId = "5e14-subclass-fighter-champion";
    draft.backgroundId = "5e14-background-soldier";
    draft.speciesId = "5e14-species-human";
    draft.selectedSkillIds = ["5e14-skill-athletics", "5e14-skill-perception"];
    draft.selectedSpellIds = ["5e14-spell-fireball"];

    const validation = validateCharacter(draft);
    expect(validation.issues.some((entry) => entry.code === "spell.illegal_choice")).toBe(true);
  });

  it("applies monk unarmored defense", () => {
    const draft = createDefaultDraft("5e-2014");
    draft.name = "Monk";
    draft.classId = "5e14-class-monk";
    draft.subclassId = "5e14-subclass-monk-open-hand";
    draft.assignedScores = { str: 8, dex: 15, con: 13, int: 10, wis: 14, cha: 12 };
    draft.abilityMethodId = "standard-array";
    const derived = deriveCharacter(draft);

    expect(derived?.armorClass).toBe(10 + (derived?.abilityModifiers.dex ?? 0) + (derived?.abilityModifiers.wis ?? 0));
  });

  it("accepts BOM-safe draft import", () => {
    const draft = createDefaultDraft("5e-2014");
    draft.name = "BOM";
    const imported = parseCharacterDraftJson(`\uFEFF${JSON.stringify(draft)}`);
    expect(imported.name).toBe("BOM");
  });

  it("builds parsable export lines", () => {
    const draft = createDefaultDraft("5e-2014");
    draft.name = "Exporter";
    draft.selectedSkillIds = ["5e14-skill-athletics", "5e14-skill-perception"];
    draft.selectedItemIds = ["5e14-item-chain-mail", "5e14-item-longsword"];
    const validation = validateCharacter(draft);
    const derived = deriveCharacter(draft);
    const lines = buildParsableCharacterLines(draft, derived, validation.issues);

    expect(lines.some((line) => line.includes("@@JSON_START@@"))).toBe(true);
    expect(lines.some((line) => line.includes("character_name=Exporter"))).toBe(true);
  });

  it("fills a partial identity prompt into a legal preview draft", () => {
    const currentDraft = createDefaultDraft("5e-2024");
    const result = synthesizeCharacterAssist({
      currentDraft,
      intent: {
        name: "Aria",
        characterClass: "Cleric",
        species: "Dwarf",
        level: 3
      }
    });

    expect(result.previewDraft.name).toBe("Aria");
    expect(result.previewDraft.classId).toBe("5e24-class-cleric");
    expect(result.previewDraft.speciesId).toBe("5e24-species-dwarf");
    expect(result.previewDraft.level).toBe(3);
    expect(result.appliedFields.some((field) => field.field === "classId")).toBe(true);
  });

  it("refines an existing draft while preserving unspecified fields", () => {
    const currentDraft = createDefaultDraft("5e-2024");
    currentDraft.name = "Nyx";
    currentDraft.playerName = "Sam";
    currentDraft.speciesId = "5e24-species-human";

    const result = synthesizeCharacterAssist({
      currentDraft,
      intent: {
        characterClass: "Wizard",
        background: "Sage",
        notes: "Focused on battlefield control."
      }
    });

    expect(result.previewDraft.name).toBe("Nyx");
    expect(result.previewDraft.playerName).toBe("Sam");
    expect(result.previewDraft.classId).toBe("5e24-class-wizard");
    expect(result.previewDraft.backgroundId).toBe("5e24-background-sage");
    expect(result.previewDraft.notes).toContain("battlefield control");
  });

  it("surfaces unresolved questions for unknown catalog entries", () => {
    const currentDraft = createDefaultDraft("5e-2024");
    const result = synthesizeCharacterAssist({
      currentDraft,
      intent: {
        characterClass: "Time Lord",
        items: ["Quantum Spoon"]
      }
    });

    expect(result.unresolvedQuestions.some((question) => question.field === "classId")).toBe(true);
    expect(result.unresolvedQuestions.some((question) => question.field === "selectedItemIds")).toBe(true);
  });

  it("maps 3.5 skill ranks by skill name", () => {
    const currentDraft = createDefaultDraft("3.5e");
    const result = synthesizeCharacterAssist({
      currentDraft,
      intent: {
        characterClass: "Wizard",
        skillRanks: {
          Spellcraft: 4,
          Concentration: 4
        }
      }
    });

    expect(result.previewDraft.classId).toBe("35-class-wizard");
    expect(result.previewDraft.skillRanks["35-skill-spellcraft"]).toBe(4);
    expect(result.previewDraft.skillRanks["35-skill-concentration"]).toBe(4);
  });

  it("keeps illegal spell requests visible through validation instead of silently dropping them", () => {
    const currentDraft = createDefaultDraft("5e-2014");
    currentDraft.name = "Fighter";

    const result = synthesizeCharacterAssist({
      currentDraft,
      intent: {
        characterClass: "Fighter",
        spells: ["Fireball"]
      }
    });

    expect(result.previewDraft.selectedSpellIds).toEqual(["5e14-spell-fireball"]);
    expect(result.issues.some((issue) => issue.code === "spell.illegal_choice")).toBe(true);
  });
});
