import type { AbilityKey } from "../contracts.js";

export interface FeatPrerequisite {
  minAbility?: Partial<Record<AbilityKey, number>>;
  requiresSpellcasting?: boolean;
  requiredFeats?: string[];
}

export const FEAT_PREREQUISITES: Record<string, FeatPrerequisite> = {
  "great-cleave": { minAbility: { str: 13 }, requiredFeats: ["power-attack", "cleave"] },
  "great-weapon-master": { minAbility: { str: 13 } },
  mobility: { minAbility: { dex: 13 } },
  "point-blank-shot": { minAbility: { dex: 13 } },
  "power-attack": { minAbility: { str: 13 } },
  resilient: { minAbility: { con: 13 } },
  "spell-focus": { requiresSpellcasting: true },
  "combat-casting": { requiresSpellcasting: true },
  "war-caster": { requiresSpellcasting: true },
  "weapon-focus": { minAbility: { str: 13 } }
};

export interface ClassProfile5e {
  armor: string[];
  weapons: string[];
  saveAbilities: AbilityKey[];
  spellProgression: "full" | "half" | "pact" | "none";
  unarmoredDefense?: "barbarian" | "monk";
}

export const CLASS_PROFILES_5E: Record<string, ClassProfile5e> = {
  barbarian: {
    armor: ["light", "medium", "shield"],
    weapons: ["simple", "martial"],
    saveAbilities: ["str", "con"],
    spellProgression: "none",
    unarmoredDefense: "barbarian"
  },
  bard: { armor: ["light"], weapons: ["simple", "hand-crossbow", "longsword", "rapier", "shortsword"], saveAbilities: ["dex", "cha"], spellProgression: "full" },
  cleric: { armor: ["light", "medium", "shield"], weapons: ["simple"], saveAbilities: ["wis", "cha"], spellProgression: "full" },
  druid: { armor: ["light", "medium", "shield"], weapons: ["club", "dagger", "dart", "javelin", "mace", "quarterstaff", "scimitar", "sickle", "sling", "spear"], saveAbilities: ["int", "wis"], spellProgression: "full" },
  fighter: { armor: ["light", "medium", "heavy", "shield"], weapons: ["simple", "martial"], saveAbilities: ["str", "con"], spellProgression: "none" },
  monk: { armor: [], weapons: ["simple", "shortsword"], saveAbilities: ["str", "dex"], spellProgression: "none", unarmoredDefense: "monk" },
  paladin: { armor: ["light", "medium", "heavy", "shield"], weapons: ["simple", "martial"], saveAbilities: ["wis", "cha"], spellProgression: "half" },
  ranger: { armor: ["light", "medium", "shield"], weapons: ["simple", "martial"], saveAbilities: ["str", "dex"], spellProgression: "half" },
  rogue: { armor: ["light"], weapons: ["simple", "hand-crossbow", "longsword", "rapier", "shortsword"], saveAbilities: ["dex", "int"], spellProgression: "none" },
  sorcerer: { armor: [], weapons: ["dagger", "dart", "sling", "quarterstaff", "light-crossbow"], saveAbilities: ["con", "cha"], spellProgression: "full" },
  warlock: { armor: ["light"], weapons: ["simple"], saveAbilities: ["wis", "cha"], spellProgression: "pact" },
  wizard: { armor: [], weapons: ["dagger", "dart", "sling", "quarterstaff", "light-crossbow"], saveAbilities: ["int", "wis"], spellProgression: "full" }
};

export const THREE_FIVE_SKILL_POINTS: Record<string, number> = {
  barbarian: 4,
  bard: 6,
  cleric: 2,
  druid: 4,
  fighter: 2,
  monk: 4,
  paladin: 2,
  ranger: 6,
  rogue: 8,
  sorcerer: 2,
  wizard: 2
};

export const FIVE_E_FULL_CASTER_SLOTS: Record<number, Partial<Record<number, number>>> = {
  1: { 1: 2 },
  2: { 1: 3 },
  3: { 1: 4, 2: 2 },
  4: { 1: 4, 2: 3 },
  5: { 1: 4, 2: 3, 3: 2 },
  6: { 1: 4, 2: 3, 3: 3 },
  7: { 1: 4, 2: 3, 3: 3, 4: 1 },
  8: { 1: 4, 2: 3, 3: 3, 4: 2 },
  9: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  11: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
  12: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
  13: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
  14: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
  15: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
  16: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
  17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
  18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
  19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
  20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 }
};

export const FIVE_E_HALF_CASTER_SLOTS: Record<number, Partial<Record<number, number>>> = {
  1: {},
  2: { 1: 2 },
  3: { 1: 3 },
  4: { 1: 3 },
  5: { 1: 4, 2: 2 },
  6: { 1: 4, 2: 2 },
  7: { 1: 4, 2: 3 },
  8: { 1: 4, 2: 3 },
  9: { 1: 4, 2: 3, 3: 2 },
  10: { 1: 4, 2: 3, 3: 2 },
  11: { 1: 4, 2: 3, 3: 3 },
  12: { 1: 4, 2: 3, 3: 3 },
  13: { 1: 4, 2: 3, 3: 3, 4: 1 },
  14: { 1: 4, 2: 3, 3: 3, 4: 1 },
  15: { 1: 4, 2: 3, 3: 3, 4: 2 },
  16: { 1: 4, 2: 3, 3: 3, 4: 2 },
  17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 }
};

export const FIVE_E_PACT_SLOTS: Record<number, { slots: number; level: number }> = {
  1: { slots: 1, level: 1 },
  2: { slots: 2, level: 1 },
  3: { slots: 2, level: 2 },
  4: { slots: 2, level: 2 },
  5: { slots: 2, level: 3 },
  6: { slots: 2, level: 3 },
  7: { slots: 2, level: 4 },
  8: { slots: 2, level: 4 },
  9: { slots: 2, level: 5 },
  10: { slots: 2, level: 5 },
  11: { slots: 3, level: 5 },
  12: { slots: 3, level: 5 },
  13: { slots: 3, level: 5 },
  14: { slots: 3, level: 5 },
  15: { slots: 3, level: 5 },
  16: { slots: 3, level: 5 },
  17: { slots: 4, level: 5 },
  18: { slots: 4, level: 5 },
  19: { slots: 4, level: 5 },
  20: { slots: 4, level: 5 }
};
