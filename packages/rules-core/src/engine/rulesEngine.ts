import { abilityKeys, type AbilityKey, type AttackLine, type CharacterDraft, type DerivedCharacter, type SavingThrowLine, type SkillAllocation, type SpellcastingSummary } from "../contracts.js";
import { DEFAULT_ABILITY_SCORES, RULESETS, findById, findClassById, getRulesetById, type AbilityMethod, type BackgroundEntry, type ClassEntry, type FeatEntry, type ItemEntry, type RulesetRecord } from "../catalog.js";
import { CLASS_PROFILES_5E, FIVE_E_FULL_CASTER_SLOTS, FIVE_E_HALF_CASTER_SLOTS, FIVE_E_PACT_SLOTS, THREE_FIVE_SKILL_POINTS } from "../rules/metadata.js";

const SIMPLE_WEAPONS = new Set(["club", "dagger", "mace", "quarterstaff", "shortbow"]);
const MARTIAL_WEAPONS = new Set(["greatsword", "longbow", "longsword", "rapier"]);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toNumber(value: unknown, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function uniqueIds(ids: string[]) {
  return Array.from(new Set(ids.filter(Boolean)));
}

function normalizeAbilityAssignments(assignedScores: Partial<Record<AbilityKey, number>> | undefined) {
  const normalized = { ...DEFAULT_ABILITY_SCORES };
  for (const key of abilityKeys) {
    normalized[key] = clamp(Math.round(toNumber(assignedScores?.[key], DEFAULT_ABILITY_SCORES[key])), 1, 30);
  }
  return normalized;
}

function baseAttackBonus(level: number, progression: "good" | "average" | "poor" = "poor") {
  if (progression === "good") {
    return level;
  }
  if (progression === "average") {
    return Math.floor(level * 0.75);
  }
  return Math.floor(level * 0.5);
}

function buildSaveLine(level: number, saveTags: string[]) {
  const good = 2 + Math.floor(level / 2);
  const poor = Math.floor(level / 3);
  return {
    fort: saveTags.includes("fort") ? good : poor,
    ref: saveTags.includes("ref") ? good : poor,
    will: saveTags.includes("will") ? good : poor
  };
}

function parseArmorBonus(propertyText: string | undefined) {
  if (!propertyText) {
    return null;
  }
  const text = String(propertyText);
  const fiveE = text.match(/AC\s*(\d+)(?:\s*\+\s*Dex(?:\s*\(max\s*(\d+)\))?)?/i);
  if (fiveE) {
    return { mode: "base" as const, base: Number(fiveE[1]), dexCap: fiveE[2] ? Number(fiveE[2]) : null };
  }
  const threeFive = text.match(/AC\s*\+\s*(\d+)/i);
  if (threeFive) {
    return { mode: "bonus" as const, bonus: Number(threeFive[1]) };
  }
  return null;
}

function parseDamageDice(properties: string) {
  const match = String(properties || "").match(/(\d+d\d+(?:\s*\+\s*\d+)*)/i);
  return match ? match[1] : "1d4";
}

function includesAny(text: string, values: string[]) {
  return values.some((value) => text.includes(value));
}

function skillIdByName(ruleset: RulesetRecord, name: string) {
  return ruleset.skills.find((skill) => skill.name === name)?.id || "";
}

function featIdByName(ruleset: RulesetRecord, name: string) {
  return ruleset.feats.find((feat) => feat.name === name)?.id || "";
}

function getBackgroundGrantedSkillIds(background: BackgroundEntry | null, ruleset: RulesetRecord) {
  if (!background) {
    return [];
  }
  return uniqueIds(background.skillProficiencies.map((name) => skillIdByName(ruleset, name)).filter(Boolean));
}

function getBackgroundGrantedFeatIds(background: BackgroundEntry | null, ruleset: RulesetRecord) {
  if (!background?.originFeat) {
    return [];
  }
  const featId = featIdByName(ruleset, background.originFeat);
  return featId ? [featId] : [];
}

function getSelectedCollection<T extends { id: string }>(collection: T[] | undefined, ids: string[]) {
  const idSet = new Set(ids);
  return (collection || []).filter((entry) => idSet.has(entry.id));
}

function isWeapon(item: ItemEntry) {
  return String(item.category || "").toLowerCase().includes("weapon");
}

function isArmor(item: ItemEntry) {
  return String(item.category || "").toLowerCase().includes("armor");
}

function isShield(item: ItemEntry) {
  return String(item.name || "").toLowerCase().includes("shield");
}

function detectUnarmoredDefense(characterClass: ClassEntry | null, ruleset: RulesetRecord, hasArmor: boolean, hasShield: boolean, modifiers: Record<AbilityKey, number>) {
  if (!characterClass || ruleset.family !== "5e" || hasArmor) {
    return null;
  }
  const profile = CLASS_PROFILES_5E[characterClass.slug];
  if (profile?.unarmoredDefense === "barbarian") {
    return 10 + modifiers.dex + modifiers.con + (hasShield ? 2 : 0);
  }
  if (profile?.unarmoredDefense === "monk" && !hasShield) {
    return 10 + modifiers.dex + modifiers.wis;
  }
  return null;
}

function computeAbilityScores(state: CharacterDraft, ruleset: RulesetRecord) {
  const assigned = normalizeAbilityAssignments(state.assignedScores);
  const species = findById(ruleset.species, state.speciesId);
  const background = findById(ruleset.backgrounds, state.backgroundId);
  const speciesBonuses = species?.abilityBonuses || {};
  const backgroundBonuses = background?.defaultAbilityBonuses || {};
  const finalScores = { ...assigned };
  for (const key of abilityKeys) {
    finalScores[key] += toNumber(speciesBonuses[key], 0) + toNumber(backgroundBonuses[key], 0);
  }
  const modifiers = Object.fromEntries(abilityKeys.map((key) => [key, Math.floor((toNumber(finalScores[key], 10) - 10) / 2)])) as Record<AbilityKey, number>;
  return { assigned, finalScores, modifiers };
}

export function abilityModifier(score: number) {
  return Math.floor((toNumber(score, 10) - 10) / 2);
}

export function calculatePointBuyTotal(assignedScores: Partial<Record<AbilityKey, number>> | undefined, method: AbilityMethod | undefined) {
  if (!method || method.id !== "point-buy") {
    return 0;
  }
  const scores = normalizeAbilityAssignments(assignedScores);
  return abilityKeys.reduce((total, key) => total + (Number(method.costTable?.[scores[key]]) || 0), 0);
}

export function calculateProficiencyBonus(level: number, ruleset: RulesetRecord) {
  return ruleset.family === "5e" ? 2 + Math.floor((level - 1) / 4) : 0;
}

function calculateSkillBudget(level: number, characterClass: ClassEntry | null, intModifier: number) {
  if (!characterClass) {
    return 0;
  }
  const base = THREE_FIVE_SKILL_POINTS[characterClass.slug] ?? 2;
  const perLevel = Math.max(1, base + intModifier);
  return perLevel * 4 + Math.max(0, level - 1) * perLevel;
}

function resolveSkillAllocations(state: CharacterDraft, ruleset: RulesetRecord, characterClass: ClassEntry | null, abilityModifiers: Record<AbilityKey, number>, proficiencyBonus: number) {
  const background = findById(ruleset.backgrounds, state.backgroundId);
  const grantedSkillIds = getBackgroundGrantedSkillIds(background, ruleset);
  const selectedSkillIds = uniqueIds(state.selectedSkillIds || []);
  const totalIds = new Set([...grantedSkillIds, ...selectedSkillIds]);
  const allocations: SkillAllocation[] = [];
  for (const skill of ruleset.skills) {
    const modifier = abilityModifiers[skill.ability] || 0;
    if (ruleset.family === "5e") {
      const proficient = totalIds.has(skill.id);
      allocations.push({
        id: skill.id,
        name: skill.name,
        ability: skill.ability,
        total: modifier + (proficient ? proficiencyBonus : 0),
        proficient,
        source: grantedSkillIds.includes(skill.id) ? "background" : proficient ? "class" : "manual"
      });
      continue;
    }
    const legacyRank = selectedSkillIds.includes(skill.id) ? 1 : 0;
    const rank = Math.max(legacyRank, toNumber(state.skillRanks?.[skill.id], 0));
    allocations.push({ id: skill.id, name: skill.name, ability: skill.ability, total: modifier + rank, proficient: rank > 0, source: rank > 0 ? "ranked" : "manual", ranks: rank });
  }
  return { allocations, skillBudget: ruleset.family === "3.5e" ? calculateSkillBudget(state.level, characterClass, abilityModifiers.int) : null };
}

function calculateHitPoints(level: number, ruleset: RulesetRecord, characterClass: ClassEntry | null, modifiers: Record<AbilityKey, number>, feats: FeatEntry[]) {
  if (!characterClass) {
    return 0;
  }
  const hitDie = toNumber(characterClass.hitDie, 8);
  const averageRoll = Math.floor(hitDie / 2) + 1;
  let hp = hitDie + modifiers.con + Math.max(0, level - 1) * (averageRoll + modifiers.con);
  if (feats.some((feat) => feat.slug === "tough")) {
    hp += level * 2;
  }
  if (feats.some((feat) => feat.slug === "toughness") && ruleset.family === "3.5e") {
    hp += 3;
  }
  return Math.max(level, hp);
}

function calculateArmorClass(ruleset: RulesetRecord, characterClass: ClassEntry | null, selectedItems: ItemEntry[], modifiers: Record<AbilityKey, number>) {
  const armor = selectedItems.find(isArmor) || null;
  const shield = selectedItems.find(isShield) || null;
  let armorClass = 10 + modifiers.dex;
  if (armor) {
    const parsed = parseArmorBonus(armor.properties);
    if (parsed?.mode === "base") {
      const dexContribution = parsed.dexCap == null ? modifiers.dex : Math.min(modifiers.dex, parsed.dexCap);
      armorClass = parsed.base + dexContribution;
    } else if (parsed?.mode === "bonus") {
      armorClass = 10 + modifiers.dex + parsed.bonus;
    }
  }
  const unarmoredDefense = detectUnarmoredDefense(characterClass, ruleset, Boolean(armor), Boolean(shield), modifiers);
  if (unarmoredDefense != null) {
    armorClass = Math.max(armorClass, unarmoredDefense);
  }
  if (shield) {
    const shieldBonusMatch = String(shield.properties || "").match(/\+\s*(\d+)\s*AC|Shield\s*\+\s*(\d+)/i);
    const shieldBonus = shieldBonusMatch ? Number(shieldBonusMatch[1] || shieldBonusMatch[2]) : 2;
    armorClass += shieldBonus;
  }
  return Math.max(1, armorClass);
}

function getWeaponAbility(item: ItemEntry, modifiers: Record<AbilityKey, number>) {
  const properties = String(item.properties || "").toLowerCase();
  if (includesAny(properties, ["ranged", "bow", "crossbow"])) {
    return "dex" as const;
  }
  if (properties.includes("finesse")) {
    return modifiers.dex >= modifiers.str ? "dex" : "str";
  }
  return "str" as const;
}

function itemMatchesWeaponGroup(item: ItemEntry, group: string) {
  if (group === "simple") {
    return SIMPLE_WEAPONS.has(item.slug);
  }
  if (group === "martial") {
    return MARTIAL_WEAPONS.has(item.slug);
  }
  return item.slug === group;
}

function hasWeaponProficiency(characterClass: ClassEntry | null, item: ItemEntry) {
  if (!characterClass) {
    return false;
  }
  const profile = CLASS_PROFILES_5E[characterClass.slug];
  if (!profile) {
    return true;
  }
  return profile.weapons.some((group) => itemMatchesWeaponGroup(item, group));
}

function buildAttacks(ruleset: RulesetRecord, characterClass: ClassEntry | null, selectedItems: ItemEntry[], abilityModifiers: Record<AbilityKey, number>, proficiencyBonus: number, baseAttack: number | null): AttackLine[] {
  return selectedItems
    .filter(isWeapon)
    .slice(0, 6)
    .map((item) => {
      const ability = getWeaponAbility(item, abilityModifiers);
      const abilityMod = abilityModifiers[ability];
      const proficient = ruleset.family === "5e" ? hasWeaponProficiency(characterClass, item) : true;
      const attackBonus = (ruleset.family === "5e" ? proficiencyBonus : baseAttack || 0) + abilityMod + (ruleset.family === "5e" && !proficient ? -proficiencyBonus : 0);
      const notes: string[] = [];
      const properties = String(item.properties || "").toLowerCase();
      if (!proficient) {
        notes.push("Not proficient");
      }
      if (properties.includes("finesse")) {
        notes.push("Finesse");
      }
      if (properties.includes("thrown")) {
        notes.push("Thrown");
      }
      return {
        name: item.name,
        attackBonus,
        damage: `${parseDamageDice(item.properties)} ${abilityMod >= 0 ? `+${abilityMod}` : abilityMod}`,
        ability,
        notes: notes.join(" | ") || item.properties
      };
    });
}

function getFiveESpellProgression(characterClass: ClassEntry | null) {
  return characterClass ? CLASS_PROFILES_5E[characterClass.slug]?.spellProgression || "none" : "none";
}

function calculateSpellcasting(level: number, ruleset: RulesetRecord, characterClass: ClassEntry | null, modifiers: Record<AbilityKey, number>): SpellcastingSummary | null {
  if (!characterClass?.spellcasting) {
    return null;
  }
  const castingAbility = characterClass.spellcasting.ability || "int";
  const castingModifier = modifiers[castingAbility] || 0;
  const proficiencyBonus = calculateProficiencyBonus(level, ruleset);
  const cantrips = Math.max(0, toNumber(characterClass.spellcasting.cantripsAtLevel1, 0) + Math.floor((level - 1) / 4));
  const knownBase = toNumber(characterClass.spellcasting.spellsKnownAtLevel1, 0);
  const preparedOrKnown = characterClass.spellcasting.preparedBy ? Math.max(1, level + castingModifier) : Math.max(knownBase, knownBase + Math.max(0, level - 1));
  const maxSpellLevel = ruleset.family === "5e" ? Math.min(9, Math.ceil(level / 2)) : Math.min(9, Math.floor((level + 1) / 2));

  if (ruleset.family === "5e") {
    const progression = getFiveESpellProgression(characterClass);
    const slots = progression === "full" ? FIVE_E_FULL_CASTER_SLOTS[level] || {} : progression === "half" ? FIVE_E_HALF_CASTER_SLOTS[level] || {} : {};
    const pactSlots = progression === "pact" ? FIVE_E_PACT_SLOTS[level] : undefined;
    return {
      castingAbility,
      castingModifier,
      spellAttackBonus: castingModifier + proficiencyBonus,
      saveDC: 8 + proficiencyBonus + castingModifier,
      cantrips,
      preparedOrKnown,
      spellPickLimit: cantrips + preparedOrKnown,
      maxSpellLevel,
      slots,
      pactSlots,
      casterLevel: level
    };
  }

  return {
    castingAbility,
    castingModifier,
    spellAttackBonus: baseAttackBonus(level, characterClass.baseAttackProgression || "poor") + castingModifier,
    saveDC: 10 + castingModifier + Math.max(0, maxSpellLevel),
    cantrips,
    preparedOrKnown,
    spellPickLimit: cantrips + preparedOrKnown,
    maxSpellLevel,
    slots: maxSpellLevel > 0 ? { [maxSpellLevel]: Math.max(1, Math.ceil(level / 4)) } : {},
    casterLevel: level
  };
}

function mergeSelectedFeats(ruleset: RulesetRecord, background: BackgroundEntry | null, selectedFeatIds: string[]) {
  const grantedFeatIds = getBackgroundGrantedFeatIds(background, ruleset);
  const finalFeatIds = uniqueIds([...(selectedFeatIds || []), ...grantedFeatIds]);
  return { grantedFeatIds, feats: getSelectedCollection(ruleset.feats, finalFeatIds) };
}

function buildSavingThrows(ruleset: RulesetRecord, characterClass: ClassEntry | null, level: number, modifiers: Record<AbilityKey, number>) {
  if (!characterClass) {
    return null;
  }
  if (ruleset.family === "5e") {
    const proficient = new Set((CLASS_PROFILES_5E[characterClass.slug]?.saveAbilities || []) as AbilityKey[]);
    const proficiencyBonus = calculateProficiencyBonus(level, ruleset);
    return Object.fromEntries(abilityKeys.map((key) => [key, modifiers[key] + (proficient.has(key) ? proficiencyBonus : 0)])) as SavingThrowLine;
  }
  const base = buildSaveLine(level, characterClass.savingThrowProficiencies || []);
  return { fort: (base.fort || 0) + modifiers.con, ref: (base.ref || 0) + modifiers.dex, will: (base.will || 0) + modifiers.wis };
}

function buildValidationHints(ruleset: RulesetRecord, selectedItems: ItemEntry[], spellcasting: SpellcastingSummary | null, background: BackgroundEntry | null) {
  const hints: string[] = [];
  if (selectedItems.length === 0) {
    hints.push("Select starting gear or a starter loadout before publishing.");
  }
  if (spellcasting && Object.keys(spellcasting.slots).length === 0 && !spellcasting.pactSlots) {
    hints.push("Spellcasting is unlocked, but current level does not yet grant full slot depth.");
  }
  if (background?.originFeat) {
    hints.push(`${background.originFeat} is granted automatically from the chosen background.`);
  }
  if (ruleset.family === "3.5e") {
    hints.push("Allocate skill ranks carefully: 3.5e skill points are budget-limited.");
  }
  return hints;
}

export function deriveCharacter(draft: CharacterDraft, providedRulesets: RulesetRecord[] = RULESETS): DerivedCharacter | null {
  const ruleset = providedRulesets.find((entry) => entry.id === draft.rulesetId) || getRulesetById(draft.rulesetId);
  if (!ruleset) {
    return null;
  }
  const level = clamp(toNumber(draft.level, 1), ruleset.levelBounds.min, ruleset.levelBounds.max);
  const characterClass = findClassById(ruleset, draft.classId);
  const species = findById(ruleset.species, draft.speciesId);
  const background = findById(ruleset.backgrounds, draft.backgroundId);
  const subclass = characterClass ? findById(characterClass.subclasses, draft.subclassId) : null;
  const abilityMethod = findById(ruleset.abilityMethods, draft.abilityMethodId) || ruleset.abilityMethods[0];
  const abilityInfo = computeAbilityScores(draft, ruleset);
  const proficiencyBonus = calculateProficiencyBonus(level, ruleset);
  const selectedItems = getSelectedCollection(ruleset.items, uniqueIds(draft.selectedItemIds || []));
  const selectedSpells = getSelectedCollection(ruleset.spells, uniqueIds(draft.selectedSpellIds || []));
  const { grantedFeatIds, feats } = mergeSelectedFeats(ruleset, background, draft.selectedFeatIds || []);
  const baseAttack = ruleset.family === "3.5e" && characterClass ? baseAttackBonus(level, characterClass.baseAttackProgression || "poor") : null;
  const spellcasting = calculateSpellcasting(level, ruleset, characterClass, abilityInfo.modifiers);
  const skillData = resolveSkillAllocations(draft, ruleset, characterClass, abilityInfo.modifiers, proficiencyBonus);
  const proficientPerception = skillData.allocations.some((skill) => skill.name === "Perception" && skill.proficient);

  return {
    rulesetId: ruleset.id,
    rulesetName: ruleset.name,
    rulesFamily: ruleset.family,
    level,
    className: characterClass?.name || null,
    subclassName: subclass?.name || null,
    speciesName: species?.name || null,
    backgroundName: background?.name || null,
    pointBuyTotal: calculatePointBuyTotal(draft.assignedScores, abilityMethod),
    abilityScores: abilityInfo.finalScores,
    abilityModifiers: abilityInfo.modifiers,
    proficiencyBonus,
    baseAttackBonus: baseAttack,
    saves: buildSavingThrows(ruleset, characterClass, level, abilityInfo.modifiers),
    hitPoints: calculateHitPoints(level, ruleset, characterClass, abilityInfo.modifiers, feats),
    armorClass: calculateArmorClass(ruleset, characterClass, selectedItems, abilityInfo.modifiers),
    initiative: abilityInfo.modifiers.dex,
    passivePerception: 10 + abilityInfo.modifiers.wis + (proficientPerception && ruleset.family === "5e" ? proficiencyBonus : 0),
    speed: species?.speed || 30,
    carryingCapacity: Math.max(1, abilityInfo.finalScores.str) * (ruleset.family === "5e" ? 15 : 10),
    spellcasting,
    selectedSkills: skillData.allocations.filter((skill) => skill.proficient),
    selectedFeats: feats.map((feat) => ({ id: feat.id, slug: feat.slug, name: feat.name })),
    selectedItems: selectedItems.map((item) => ({ id: item.id, slug: item.slug, name: item.name, category: item.category })),
    selectedSpells: selectedSpells.map((spell) => ({ id: spell.id, slug: spell.slug, name: spell.name, level: spell.level, school: spell.school })),
    attacks: buildAttacks(ruleset, characterClass, selectedItems, abilityInfo.modifiers, proficiencyBonus, baseAttack),
    classFeatures: (characterClass?.featuresByLevel || []).filter((feature) => feature.level <= level).map((feature) => ({ level: feature.level, name: feature.name, description: feature.description })),
    toolProficiencies: background?.toolProficiencies || [],
    languageProficiencies: background?.languageProficiencies || 0,
    grantedFeatIds,
    validationHints: buildValidationHints(ruleset, selectedItems, spellcasting, background)
  };
}

export function createDefaultDraft(rulesetId = RULESETS[0].id): CharacterDraft {
  const ruleset = getRulesetById(rulesetId);
  const defaultClass = ruleset.classes[0];
  return {
    rulesetId: ruleset.id,
    experienceMode: "new",
    name: "",
    playerName: "",
    level: 1,
    alignment: ruleset.alignments[0] || "",
    backgroundId: ruleset.backgrounds[0]?.id || "",
    speciesId: ruleset.species[0]?.id || "",
    classId: defaultClass?.id || "",
    subclassId: defaultClass?.subclasses?.[0]?.id || "",
    notes: "",
    abilityMethodId: ruleset.abilityMethods[0]?.id || "point-buy",
    assignedScores: { ...DEFAULT_ABILITY_SCORES },
    selectedSkillIds: [],
    skillRanks: {},
    selectedFeatIds: [],
    selectedSpellIds: [],
    selectedItemIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
