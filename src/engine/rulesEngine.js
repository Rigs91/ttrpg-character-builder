import { DEFAULT_ABILITY_SCORES, findById } from "../data/rulesets.js";

const ABILITY_KEYS = ["str", "dex", "con", "int", "wis", "cha"];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeAbilityAssignments(assignedScores) {
  const normalized = { ...DEFAULT_ABILITY_SCORES };
  for (const key of ABILITY_KEYS) {
    const value = toNumber(assignedScores?.[key], DEFAULT_ABILITY_SCORES[key]);
    normalized[key] = clamp(Math.round(value), 1, 30);
  }
  return normalized;
}

function buildSaveLine(level, saveTags) {
  const good = 2 + Math.floor(level / 2);
  const poor = Math.floor(level / 3);
  return {
    fort: saveTags.includes("fort") ? good : poor,
    ref: saveTags.includes("ref") ? good : poor,
    will: saveTags.includes("will") ? good : poor
  };
}

function baseAttackBonus(level, progression) {
  if (progression === "good") {
    return level;
  }
  if (progression === "average") {
    return Math.floor(level * 0.75);
  }
  return Math.floor(level * 0.5);
}

function detectArmorItem(items) {
  return items.find((entry) => String(entry.category || "").toLowerCase().includes("armor"));
}

function detectShieldItem(items) {
  return items.find((entry) => String(entry.name || "").toLowerCase().includes("shield"));
}

function parseArmorBonus(propertyText) {
  if (!propertyText) {
    return null;
  }

  const text = String(propertyText);
  const fiveE = text.match(/AC\s*(\d+)(?:\s*\+\s*Dex(?:\s*\(max\s*(\d+)\))?)?/i);
  if (fiveE) {
    return {
      mode: "base",
      base: Number(fiveE[1]),
      dexCap: fiveE[2] ? Number(fiveE[2]) : null
    };
  }

  const threeFive = text.match(/AC\s*\+\s*(\d+)/i);
  if (threeFive) {
    return {
      mode: "bonus",
      bonus: Number(threeFive[1])
    };
  }

  return null;
}

function getSelectedCollection(collection, ids) {
  const idSet = new Set(ids || []);
  return (collection || []).filter((entry) => idSet.has(entry.id));
}

export function getRuleset(rulesetId, rulesets) {
  return (rulesets || []).find((entry) => entry.id === rulesetId) || (rulesets || [])[0] || null;
}

export function createEmptyAssignment() {
  return { ...DEFAULT_ABILITY_SCORES };
}

export function abilityModifier(score) {
  return Math.floor((toNumber(score, 10) - 10) / 2);
}

export function calculatePointBuyTotal(assignedScores, method) {
  if (!method || method.id !== "point-buy") {
    return 0;
  }

  const scores = normalizeAbilityAssignments(assignedScores);
  return ABILITY_KEYS.reduce((total, key) => {
    const score = scores[key];
    const cost = method.costTable?.[score];
    return total + (Number.isFinite(cost) ? cost : 999);
  }, 0);
}

export function computeAbilityScores(state, ruleset) {
  const assigned = normalizeAbilityAssignments(state?.assignedScores);
  const species = findById(ruleset?.species, state?.speciesId);
  const background = findById(ruleset?.backgrounds, state?.backgroundId);

  const speciesBonuses = species?.abilityBonuses || {};
  const backgroundBonuses = background?.defaultAbilityBonuses || {};

  const finalScores = { ...assigned };
  for (const key of ABILITY_KEYS) {
    finalScores[key] += toNumber(speciesBonuses[key], 0) + toNumber(backgroundBonuses[key], 0);
  }

  const modifiers = Object.fromEntries(ABILITY_KEYS.map((key) => [key, abilityModifier(finalScores[key])]));

  return {
    assigned,
    finalScores,
    modifiers,
    speciesBonuses,
    backgroundBonuses
  };
}

export function calculateProficiencyBonus(level, ruleset) {
  if (!ruleset) {
    return 0;
  }
  if (ruleset.family === "5e") {
    return 2 + Math.floor((level - 1) / 4);
  }
  return 0;
}

export function calculateHitPoints(state, ruleset, computedScores) {
  const characterClass = findById(ruleset?.classes, state?.classId);
  const level = clamp(toNumber(state?.level, 1), 1, 20);
  if (!characterClass) {
    return 0;
  }

  const conMod = computedScores.modifiers.con;
  const hitDie = toNumber(characterClass.hitDie, 8);
  const averageRoll = Math.floor(hitDie / 2) + 1;
  let hp = hitDie + conMod + Math.max(0, level - 1) * (averageRoll + conMod);

  const feats = getSelectedCollection(ruleset?.feats, state?.selectedFeatIds);
  if (feats.some((feat) => feat.slug === "tough")) {
    hp += level * 2;
  }

  return Math.max(level, hp);
}

export function calculateArmorClass(state, ruleset, computedScores) {
  const selectedItems = getSelectedCollection(ruleset?.items, state?.selectedItemIds);
  const dexMod = computedScores.modifiers.dex;
  const armor = detectArmorItem(selectedItems);
  const shield = detectShieldItem(selectedItems);

  let armorClass = 10 + dexMod;

  if (armor) {
    const parsed = parseArmorBonus(armor.properties);
    if (parsed) {
      if (parsed.mode === "base") {
        const dexContribution = parsed.dexCap == null ? dexMod : Math.min(dexMod, parsed.dexCap);
        armorClass = parsed.base + dexContribution;
      }
      if (parsed.mode === "bonus") {
        armorClass = 10 + dexMod + parsed.bonus;
      }
    }
  }

  if (shield) {
    const shieldBonusMatch = String(shield.properties || "").match(/\+\s*(\d+)\s*AC|Shield\s*\+\s*(\d+)/i);
    const shieldBonus = shieldBonusMatch ? Number(shieldBonusMatch[1] || shieldBonusMatch[2]) : 2;
    armorClass += shieldBonus;
  }

  return Math.max(1, armorClass);
}

export function calculateSpellcasting(state, ruleset, computedScores) {
  const characterClass = findById(ruleset?.classes, state?.classId);
  if (!characterClass?.spellcasting) {
    return null;
  }

  const level = clamp(toNumber(state?.level, 1), 1, 20);
  const castingAbility = characterClass.spellcasting.ability || "int";
  const castingMod = computedScores.modifiers[castingAbility] || 0;
  const proficiency = calculateProficiencyBonus(level, ruleset);

  const cantrips = Math.max(0, toNumber(characterClass.spellcasting.cantripsAtLevel1, 0) + Math.floor((level - 1) / 4));
  const knownBase = toNumber(characterClass.spellcasting.spellsKnownAtLevel1, 0);
  const knownByLevel = Math.max(0, level - 1);
  const preparedCount = characterClass.spellcasting.preparedBy
    ? Math.max(1, level + castingMod)
    : Math.max(knownBase, knownBase + knownByLevel);

  const spellPickLimit = cantrips + preparedCount;
  const maxSpellLevel = ruleset.family === "5e" ? Math.min(9, Math.ceil(level / 2)) : Math.min(9, Math.floor((level + 1) / 2));

  if (ruleset.family === "5e") {
    return {
      castingAbility,
      castingModifier: castingMod,
      spellAttackBonus: castingMod + proficiency,
      saveDC: 8 + proficiency + castingMod,
      cantrips,
      preparedOrKnown: preparedCount,
      spellPickLimit,
      maxSpellLevel
    };
  }

  return {
    castingAbility,
    castingModifier: castingMod,
    spellAttackBonus: castingMod,
    saveDC: 10 + castingMod + Math.max(0, maxSpellLevel),
    cantrips,
    preparedOrKnown: preparedCount,
    spellPickLimit,
    maxSpellLevel
  };
}

export function deriveCharacterSheet(state, rulesets) {
  const ruleset = getRuleset(state?.rulesetId, rulesets);
  if (!ruleset) {
    return null;
  }

  const level = clamp(toNumber(state?.level, 1), 1, 20);
  const characterClass = findById(ruleset.classes, state?.classId);
  const species = findById(ruleset.species, state?.speciesId);
  const background = findById(ruleset.backgrounds, state?.backgroundId);
  const subclass = characterClass ? findById(characterClass.subclasses, state?.subclassId) : null;
  const abilityMethod = findById(ruleset.abilityMethods, state?.abilityMethodId) || ruleset.abilityMethods[0];

  const abilityInfo = computeAbilityScores(state, ruleset);
  const pointBuyTotal = calculatePointBuyTotal(abilityInfo.assigned, abilityMethod);
  const proficiencyBonus = calculateProficiencyBonus(level, ruleset);
  const hp = calculateHitPoints(state, ruleset, abilityInfo);
  const ac = calculateArmorClass(state, ruleset, abilityInfo);
  const spellcasting = calculateSpellcasting(state, ruleset, abilityInfo);

  const selectedSkills = getSelectedCollection(ruleset.skills, state?.selectedSkillIds);
  const selectedFeats = getSelectedCollection(ruleset.feats, state?.selectedFeatIds);
  const selectedSpells = getSelectedCollection(ruleset.spells, state?.selectedSpellIds);
  const selectedItems = getSelectedCollection(ruleset.items, state?.selectedItemIds);

  const skillBonuses = (ruleset.skills || []).map((skill) => {
    const ability = skill.ability || "int";
    const mod = abilityInfo.modifiers[ability] || 0;
    const selected = selectedSkills.some((entry) => entry.id === skill.id);
    let bonus = mod;

    if (ruleset.family === "5e") {
      bonus += selected ? proficiencyBonus : 0;
    } else {
      bonus += selected ? 3 : 0;
    }

    return {
      ...skill,
      selected,
      bonus
    };
  });

  const classFeatures = (characterClass?.featuresByLevel || []).filter((feature) => feature.level <= level);

  const baseAttack = ruleset.family === "3.5e" && characterClass
    ? baseAttackBonus(level, characterClass.baseAttackProgression || "poor")
    : null;

  const saves = ruleset.family === "3.5e" && characterClass
    ? buildSaveLine(level, characterClass.savingThrowProficiencies || [])
    : null;

  return {
    ruleset,
    level,
    abilityMethod,
    characterClass,
    species,
    background,
    subclass,
    pointBuyTotal,
    abilityScores: abilityInfo.finalScores,
    abilityModifiers: abilityInfo.modifiers,
    speciesBonuses: abilityInfo.speciesBonuses,
    backgroundBonuses: abilityInfo.backgroundBonuses,
    proficiencyBonus,
    baseAttackBonus: baseAttack,
    saves,
    hitPoints: hp,
    armorClass: ac,
    initiative: abilityInfo.modifiers.dex,
    passivePerception: 10 + abilityInfo.modifiers.wis + (selectedSkills.some((skill) => skill.name === "Perception") ? proficiencyBonus : 0),
    speed: species?.speed || 30,
    carryingCapacity: Math.max(1, abilityInfo.finalScores.str) * (ruleset.family === "5e" ? 15 : 10),
    spellcasting,
    selectedSkills,
    selectedFeats,
    selectedSpells,
    selectedItems,
    classFeatures,
    skillBonuses
  };
}
