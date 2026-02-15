import { getRuleset, deriveCharacterSheet, calculatePointBuyTotal } from "./rulesEngine.js";
import { findById } from "../data/rulesets.js";

function issue(code, severity, field, message) {
  return { code, severity, field, message };
}

function validateAbilityBounds(assignedScores, method) {
  const issues = [];
  const keys = ["str", "dex", "con", "int", "wis", "cha"];

  for (const key of keys) {
    const score = Number(assignedScores?.[key]);
    if (!Number.isFinite(score)) {
      issues.push(issue("ability.not_number", "error", `assignedScores.${key}`, `${key.toUpperCase()} must be a number.`));
      continue;
    }

    if (method?.min != null && score < method.min) {
      issues.push(issue("ability.too_low", "error", `assignedScores.${key}`, `${key.toUpperCase()} is below ${method.min}.`));
    }

    if (method?.max != null && score > method.max) {
      issues.push(issue("ability.too_high", "error", `assignedScores.${key}`, `${key.toUpperCase()} is above ${method.max}.`));
    }
  }

  return issues;
}

function validateStandardArray(assignedScores, method) {
  if (!method?.array?.length) {
    return [];
  }

  const values = Object.values(assignedScores || {}).map((value) => Number(value));
  if (values.some((value) => !Number.isFinite(value))) {
    return [issue("ability.array.invalid", "error", "assignedScores", "All ability scores must be numeric for Standard Array.")];
  }

  const left = [...values].sort((a, b) => a - b).join(",");
  const right = [...method.array].sort((a, b) => a - b).join(",");
  if (left !== right) {
    return [issue("ability.array.mismatch", "error", "assignedScores", `Standard Array must use exactly ${method.array.join(", ")}.`)];
  }

  return [];
}

function ensureIdsExist(ids, collection, fieldPrefix, codePrefix) {
  const set = new Set((collection || []).map((entry) => entry.id));
  const issues = [];

  for (const id of ids || []) {
    if (!set.has(id)) {
      issues.push(issue(`${codePrefix}.not_found`, "error", fieldPrefix, `Unknown selection: ${id}.`));
    }
  }

  return issues;
}

export function validateCharacter(state, rulesets) {
  const issues = [];
  const ruleset = getRuleset(state?.rulesetId, rulesets);
  if (!ruleset) {
    return [issue("ruleset.missing", "error", "rulesetId", "No ruleset selected.")];
  }

  const level = Number(state?.level ?? 1);
  const minLevel = ruleset.levelBounds?.min ?? 1;
  const maxLevel = ruleset.levelBounds?.max ?? 20;

  if (!state?.name || !String(state.name).trim()) {
    issues.push(issue("character.name.required", "error", "name", "Character name is required."));
  }

  if (!Number.isFinite(level) || level < minLevel || level > maxLevel) {
    issues.push(issue("character.level.invalid", "error", "level", `Level must be between ${minLevel} and ${maxLevel}.`));
  }

  const species = findById(ruleset.species, state?.speciesId);
  const background = findById(ruleset.backgrounds, state?.backgroundId);
  const characterClass = findById(ruleset.classes, state?.classId);

  if (!species) {
    issues.push(issue("character.species.required", "error", "speciesId", "Choose a species/race."));
  }

  if (!background) {
    issues.push(issue("character.background.required", "error", "backgroundId", "Choose a background."));
  }

  if (!characterClass) {
    issues.push(issue("character.class.required", "error", "classId", "Choose a class."));
  }

  const method = findById(ruleset.abilityMethods, state?.abilityMethodId) || ruleset.abilityMethods[0];
  issues.push(...validateAbilityBounds(state?.assignedScores, method));

  if (method?.id === "point-buy") {
    const total = calculatePointBuyTotal(state?.assignedScores, method);
    if (total > method.budget) {
      issues.push(issue("ability.point_buy.over_budget", "error", "assignedScores", `Point-buy total ${total} exceeds budget ${method.budget}.`));
    }
  }

  if (method?.id === "standard-array") {
    issues.push(...validateStandardArray(state?.assignedScores, method));
  }

  if (state?.subclassId && characterClass) {
    const subclassExists = (characterClass.subclasses || []).some((entry) => entry.id === state.subclassId);
    if (!subclassExists) {
      issues.push(issue("character.subclass.invalid", "error", "subclassId", "Selected subclass is invalid for current class."));
    }
  }

  issues.push(...ensureIdsExist(state?.selectedSkillIds, ruleset.skills, "selectedSkillIds", "skill"));
  issues.push(...ensureIdsExist(state?.selectedFeatIds, ruleset.feats, "selectedFeatIds", "feat"));
  issues.push(...ensureIdsExist(state?.selectedSpellIds, ruleset.spells, "selectedSpellIds", "spell"));
  issues.push(...ensureIdsExist(state?.selectedItemIds, ruleset.items, "selectedItemIds", "item"));

  if (characterClass) {
    const selectedSkillCount = (state?.selectedSkillIds || []).length;
    if (selectedSkillCount > Number(characterClass.skillChoices || 0)) {
      issues.push(
        issue(
          "skill.too_many",
          "error",
          "selectedSkillIds",
          `${characterClass.name} allows up to ${characterClass.skillChoices} class skill selections.`
        )
      );
    }

    if (selectedSkillCount === 0) {
      issues.push(issue("skill.none_selected", "warning", "selectedSkillIds", "No skills selected yet."));
    }
  }

  const derived = deriveCharacterSheet(state, rulesets);
  if (derived?.spellcasting) {
    const max = derived.spellcasting.spellPickLimit;
    const chosen = (state?.selectedSpellIds || []).length;
    if (chosen > max) {
      issues.push(issue("spell.too_many", "error", "selectedSpellIds", `Selected ${chosen} spells but limit is ${max} for current build.`));
    }
  } else if ((state?.selectedSpellIds || []).length > 0) {
    issues.push(issue("spell.not_caster", "warning", "selectedSpellIds", "This class is not a primary spellcaster in this ruleset."));
  }

  if ((state?.selectedItemIds || []).length === 0) {
    issues.push(issue("item.none_selected", "warning", "selectedItemIds", "Select starting gear to complete sheet output."));
  }

  if ((state?.selectedFeatIds || []).length === 0) {
    issues.push(issue("feat.none_selected", "info", "selectedFeatIds", "No feats selected yet."));
  }

  return issues;
}
