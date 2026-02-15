function safe(value, fallback = "") {
  if (value == null) {
    return fallback;
  }
  return String(value);
}

function pipeList(values) {
  if (!values || !values.length) {
    return "";
  }
  return values.join("|");
}

function chunkString(value, chunkSize) {
  const chunks = [];
  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize));
  }
  return chunks;
}

function summarizeIssues(issues) {
  const all = issues || [];
  return {
    total: all.length,
    errors: all.filter((item) => item.severity === "error").length,
    warnings: all.filter((item) => item.severity === "warning").length,
    info: all.filter((item) => item.severity === "info").length
  };
}

function compactSelection(items, extraMapper = null) {
  return (items || []).map((item) => {
    const base = {
      id: item.id,
      slug: item.slug,
      name: item.name
    };
    return extraMapper ? { ...base, ...extraMapper(item) } : base;
  });
}

function compactDerived(derived) {
  if (!derived) {
    return null;
  }

  return {
    ruleset: {
      id: derived.ruleset?.id,
      name: derived.ruleset?.name,
      shortName: derived.ruleset?.shortName,
      editionYear: derived.ruleset?.editionYear,
      family: derived.ruleset?.family
    },
    className: derived.characterClass?.name || null,
    subclassName: derived.subclass?.name || null,
    speciesName: derived.species?.name || null,
    backgroundName: derived.background?.name || null,
    level: derived.level,
    pointBuyTotal: derived.pointBuyTotal,
    abilityScores: derived.abilityScores,
    abilityModifiers: derived.abilityModifiers,
    proficiencyBonus: derived.proficiencyBonus,
    baseAttackBonus: derived.baseAttackBonus,
    saves: derived.saves,
    hitPoints: derived.hitPoints,
    armorClass: derived.armorClass,
    initiative: derived.initiative,
    passivePerception: derived.passivePerception,
    speed: derived.speed,
    carryingCapacity: derived.carryingCapacity,
    spellcasting: derived.spellcasting,
    selectedSkills: compactSelection(derived.selectedSkills, (item) => ({ ability: item.ability })),
    selectedFeats: compactSelection(derived.selectedFeats),
    selectedItems: compactSelection(derived.selectedItems, (item) => ({ category: item.category })),
    selectedSpells: compactSelection(derived.selectedSpells, (item) => ({ level: item.level, school: item.school })),
    classFeatures: (derived.classFeatures || []).map((feature) => ({
      level: feature.level,
      name: feature.name
    }))
  };
}

export function buildParsableCharacterPayload(state, derived, issues) {
  const issueSummary = summarizeIssues(issues);
  return {
    exportVersion: "forge-character-v1",
    exportedAt: new Date().toISOString(),
    state,
    derived: compactDerived(derived),
    issueSummary,
    issues
  };
}

export function buildParsableCharacterLines(state, derived, issues) {
  const payload = buildParsableCharacterPayload(state, derived, issues);
  const issueSummary = payload.issueSummary;

  const lines = [
    "@@FORGE_CHARACTER_EXPORT@@ version=1",
    `@@FIELD@@ exported_at=${payload.exportedAt}`,
    "@@SECTION@@ identity",
    `@@FIELD@@ ruleset_id=${safe(state.rulesetId)}`,
    `@@FIELD@@ ruleset_name=${safe(derived?.ruleset?.name)}`,
    `@@FIELD@@ character_name=${safe(state.name)}`,
    `@@FIELD@@ player_name=${safe(state.playerName)}`,
    `@@FIELD@@ level=${safe(derived?.level ?? state.level, "1")}`,
    `@@FIELD@@ alignment=${safe(state.alignment)}`,
    `@@FIELD@@ species=${safe(derived?.species?.name)}`,
    `@@FIELD@@ background=${safe(derived?.background?.name)}`,
    `@@FIELD@@ class=${safe(derived?.characterClass?.name)}`,
    `@@FIELD@@ subclass=${safe(derived?.subclass?.name, "None")}`,
    `@@FIELD@@ experience_mode=${safe(state.experienceMode)}`,
    "@@SECTION@@ abilities",
    `@@FIELD@@ str=${safe(derived?.abilityScores?.str)}`,
    `@@FIELD@@ dex=${safe(derived?.abilityScores?.dex)}`,
    `@@FIELD@@ con=${safe(derived?.abilityScores?.con)}`,
    `@@FIELD@@ int=${safe(derived?.abilityScores?.int)}`,
    `@@FIELD@@ wis=${safe(derived?.abilityScores?.wis)}`,
    `@@FIELD@@ cha=${safe(derived?.abilityScores?.cha)}`,
    `@@FIELD@@ str_mod=${safe(derived?.abilityModifiers?.str)}`,
    `@@FIELD@@ dex_mod=${safe(derived?.abilityModifiers?.dex)}`,
    `@@FIELD@@ con_mod=${safe(derived?.abilityModifiers?.con)}`,
    `@@FIELD@@ int_mod=${safe(derived?.abilityModifiers?.int)}`,
    `@@FIELD@@ wis_mod=${safe(derived?.abilityModifiers?.wis)}`,
    `@@FIELD@@ cha_mod=${safe(derived?.abilityModifiers?.cha)}`,
    "@@SECTION@@ combat",
    `@@FIELD@@ hit_points=${safe(derived?.hitPoints)}`,
    `@@FIELD@@ armor_class=${safe(derived?.armorClass)}`,
    `@@FIELD@@ initiative=${safe(derived?.initiative)}`,
    `@@FIELD@@ speed=${safe(derived?.speed)}`,
    `@@FIELD@@ passive_perception=${safe(derived?.passivePerception)}`,
    `@@FIELD@@ proficiency_bonus=${safe(derived?.proficiencyBonus)}`,
    `@@FIELD@@ base_attack_bonus=${safe(derived?.baseAttackBonus)}`,
    "@@SECTION@@ selections",
    `@@LIST@@ skills=${pipeList((derived?.selectedSkills || []).map((item) => item.name))}`,
    `@@LIST@@ feats=${pipeList((derived?.selectedFeats || []).map((item) => item.name))}`,
    `@@LIST@@ spells=${pipeList((derived?.selectedSpells || []).map((item) => item.name))}`,
    `@@LIST@@ items=${pipeList((derived?.selectedItems || []).map((item) => item.name))}`,
    "@@SECTION@@ spellcasting",
    `@@FIELD@@ casting_ability=${safe(derived?.spellcasting?.castingAbility)}`,
    `@@FIELD@@ spell_save_dc=${safe(derived?.spellcasting?.saveDC)}`,
    `@@FIELD@@ spell_attack_bonus=${safe(derived?.spellcasting?.spellAttackBonus)}`,
    `@@FIELD@@ spell_pick_limit=${safe(derived?.spellcasting?.spellPickLimit)}`,
    "@@SECTION@@ validation",
    `@@FIELD@@ validation_total=${issueSummary.total}`,
    `@@FIELD@@ validation_errors=${issueSummary.errors}`,
    `@@FIELD@@ validation_warnings=${issueSummary.warnings}`,
    `@@FIELD@@ validation_info=${issueSummary.info}`,
    "@@SECTION@@ notes",
    `@@FIELD@@ character_notes=${safe(state.notes)}`,
    "@@JSON_START@@"
  ];

  const jsonText = JSON.stringify(payload);
  const chunks = chunkString(jsonText, 96);
  for (const chunk of chunks) {
    lines.push(`@@JSON@@ ${chunk}`);
  }
  lines.push("@@JSON_END@@");

  return lines;
}
