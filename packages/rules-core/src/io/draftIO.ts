import { characterDraftSchema, type CharacterDraft } from "../contracts.js";
import { createDefaultDraft } from "../engine/rulesEngine.js";

export function stripBom(text: string) {
  return text.replace(/^\uFEFF/, "");
}

export function normalizeDraft(raw: Partial<CharacterDraft>): CharacterDraft {
  const base = createDefaultDraft(raw.rulesetId);
  return characterDraftSchema.parse({
    ...base,
    ...raw,
    assignedScores: { ...base.assignedScores, ...(raw.assignedScores || {}) },
    skillRanks: { ...(raw.skillRanks || {}) },
    selectedSkillIds: raw.selectedSkillIds || [],
    selectedFeatIds: raw.selectedFeatIds || [],
    selectedSpellIds: raw.selectedSpellIds || [],
    selectedItemIds: raw.selectedItemIds || [],
    updatedAt: raw.updatedAt || new Date().toISOString()
  });
}

export function parseCharacterDraftJson(text: string) {
  const parsed = JSON.parse(stripBom(text));
  return normalizeDraft(parsed);
}

export function serializeCharacterDraft(draft: CharacterDraft) {
  return `${JSON.stringify(characterDraftSchema.parse(draft), null, 2)}\n`;
}
