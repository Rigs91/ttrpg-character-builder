const DEFAULT_REPLY = "I can help with class choice, ability scores, point-buy math, spell picks, and rule reminders for your selected edition.";

function includesAny(text, phrases) {
  return phrases.some((phrase) => text.includes(phrase));
}

function topAbilitySuggestions(characterClass) {
  if (!characterClass) {
    return "Pick your class first so I can prioritize ability scores.";
  }

  const abilities = characterClass.primaryAbilities?.map((ability) => ability.toUpperCase()) || [];
  if (!abilities.length) {
    return "This class does not define primary abilities in the current data pack.";
  }

  return `Prioritize ${abilities.join(" and ")} for ${characterClass.name}. Keep Constitution solid for durability.`;
}

function beginnerClassSuggestion(ruleset) {
  const classPool = ruleset.classes || [];
  const picks = classPool.filter((entry) => ["fighter", "cleric", "wizard", "rogue", "ranger"].some((tag) => entry.slug.includes(tag)));
  const shortlist = picks.slice(0, 3).map((entry) => entry.name);
  if (shortlist.length === 0) {
    return "Try a class with simple combat loops and clear features in your chosen ruleset.";
  }

  return `Beginner-friendly picks for ${ruleset.name}: ${shortlist.join(", ")}.`;
}

function pointBuyAdvice(ruleset, total) {
  const method = ruleset.abilityMethods?.find((entry) => entry.id === "point-buy");
  if (!method) {
    return "This ruleset currently does not expose a point-buy profile.";
  }

  const remaining = method.budget - total;
  const status = remaining >= 0 ? `${remaining} points remaining.` : `${Math.abs(remaining)} points over budget.`;
  return `Point-buy budget is ${method.budget} (${method.min}-${method.max} per score). You are currently at ${total}. ${status}`;
}

function spellAdvice(state, ruleset, derived) {
  const classData = ruleset.classes.find((entry) => entry.id === state.classId);
  if (!classData) {
    return "Choose a class first so I can filter spell suggestions.";
  }

  if (!classData.spellcasting) {
    return `${classData.name} is not a primary spellcasting class in this ruleset. Focus on items, feats, and tactics.`;
  }

  const compatible = (ruleset.spells || []).filter((spell) => spell.classes.includes(classData.slug));
  const picks = compatible
    .filter((spell) => spell.level <= Math.max(1, state.level - 1))
    .slice(0, 6)
    .map((spell) => spell.name);

  if (!picks.length) {
    return `No matching spells were found for ${classData.name} at level ${state.level} in the current content pack.`;
  }

  const dc = derived.spellcasting?.saveDC ? ` Current save DC: ${derived.spellcasting.saveDC}.` : "";
  return `Good options for ${classData.name}: ${picks.join(", ")}.${dc}`;
}

function issueSummary(issues) {
  if (!issues.length) {
    return "Build is currently valid. You can complete and print the character sheet.";
  }

  const blocking = issues.filter((issue) => issue.severity === "error").length;
  const warnings = issues.filter((issue) => issue.severity === "warning").length;
  return `You have ${blocking} blocking issue(s) and ${warnings} warning(s). Open the Review step for details.`;
}

export function buildChatReply(message, context) {
  const text = message.trim().toLowerCase();
  if (!text) {
    return DEFAULT_REPLY;
  }

  const { state, ruleset, derived, issues } = context;
  const characterClass = ruleset.classes.find((entry) => entry.id === state.classId);

  if (includesAny(text, ["hello", "hi", "hey", "help"])) {
    return `Working in ${ruleset.shortName}. Ask about class picks, point-buy, spell picks, or validation.`;
  }

  if (includesAny(text, ["beginner", "new player", "easy class"])) {
    return beginnerClassSuggestion(ruleset);
  }

  if (includesAny(text, ["ability", "stat", "score", "point buy", "point-buy"])) {
    return `${topAbilitySuggestions(characterClass)} ${pointBuyAdvice(ruleset, derived.pointBuyTotal)}`;
  }

  if (includesAny(text, ["spell", "magic", "cantrip", "dc"])) {
    return spellAdvice(state, ruleset, derived);
  }

  if (includesAny(text, ["issue", "error", "valid", "validate", "wrong"])) {
    return issueSummary(issues);
  }

  if (includesAny(text, ["item", "gear", "armor", "weapon"])) {
    const topItems = (ruleset.items || []).slice(0, 5).map((item) => item.name).join(", ");
    return `Starter gear ideas for ${ruleset.shortName}: ${topItems}. Match armor to your Dexterity and class proficiencies.`;
  }

  if (includesAny(text, ["feature", "class feature", "what do i get"])) {
    if (!characterClass) {
      return "Choose a class and level, then I can list unlocked class features.";
    }

    const features = characterClass.featuresByLevel
      .filter((feature) => feature.level <= state.level)
      .slice(0, 6)
      .map((feature) => `${feature.name} (L${feature.level})`)
      .join(", ");

    return features
      ? `Unlocked for ${characterClass.name} at level ${state.level}: ${features}.`
      : `No features listed for ${characterClass.name} at level ${state.level} in this pack.`;
  }

  return DEFAULT_REPLY;
}