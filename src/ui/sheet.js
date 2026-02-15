function plus(value) {
  const numeric = Number(value || 0);
  return numeric >= 0 ? `+${numeric}` : `${numeric}`;
}

function tags(items) {
  if (!items || !items.length) {
    return "<span class=\"sheet-tag\">None selected</span>";
  }
  return items.map((item) => `<span class=\"sheet-tag\">${item.name}</span>`).join("");
}

function listLines(items, fallback) {
  if (!items || !items.length) {
    return `<p class=\"helper\">${fallback}</p>`;
  }

  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

export function renderSheet(container, state, derived, issues) {
  if (!container) {
    return;
  }

  if (!derived) {
    container.innerHTML = "<p class='helper'>Select a ruleset and start entering character details.</p>";
    return;
  }

  const ruleset = derived.ruleset;
  const className = derived.characterClass?.name || "Unassigned";
  const speciesName = derived.species?.name || "Unassigned";
  const backgroundName = derived.background?.name || "Unassigned";
  const subclassName = derived.subclass?.name || "None";

  const blockingIssues = issues.filter((item) => item.severity === "error").length;
  const warningIssues = issues.filter((item) => item.severity === "warning").length;

  const abilityCards = Object.entries(derived.abilityScores)
    .map(([ability, score]) => {
      return `<div class=\"stat-card\"><strong>${ability.toUpperCase()} ${score}</strong><span>${plus(derived.abilityModifiers[ability])}</span></div>`;
    })
    .join("");

  const featureLines = derived.classFeatures.map((feature) => `L${feature.level}: ${feature.name}`);
  const spellBlock = derived.spellcasting
    ? `
      <div class=\"sheet-block\">
        <h4>Spellcasting</h4>
        <p>Casting ability: <strong>${derived.spellcasting.castingAbility.toUpperCase()}</strong></p>
        <p>Save DC: <strong>${derived.spellcasting.saveDC}</strong> | Attack bonus: <strong>${plus(derived.spellcasting.spellAttackBonus)}</strong></p>
        <p>Cantrips: <strong>${derived.spellcasting.cantrips}</strong> | Prepared/Known estimate: <strong>${derived.spellcasting.preparedOrKnown}</strong></p>
      </div>
    `
    : "";

  const progressionBlock = ruleset.family === "3.5e"
    ? `
      <div class=\"sheet-block\">
        <h4>3.5e Progression</h4>
        <p>Base Attack Bonus: <strong>${plus(derived.baseAttackBonus || 0)}</strong></p>
        <p>Base Saves: Fort <strong>${plus(derived.saves?.fort || 0)}</strong>, Ref <strong>${plus(derived.saves?.ref || 0)}</strong>, Will <strong>${plus(derived.saves?.will || 0)}</strong></p>
      </div>
    `
    : "";

  container.innerHTML = `
    <div class="sheet-block">
      <h4>Identity</h4>
      <p><strong>${state.name || "Unnamed Hero"}</strong> | ${ruleset.shortName} | Level ${derived.level}</p>
      <p>${speciesName} ${className} (${subclassName})</p>
      <p>Background: ${backgroundName} | Alignment: ${state.alignment || "Unassigned"}</p>
      <p>Player: ${state.playerName || "Unassigned"}</p>
    </div>

    <div class="sheet-grid">
      ${abilityCards}
    </div>

    <div class="sheet-block">
      <h4>Core Combat</h4>
      <p>HP <strong>${derived.hitPoints}</strong> | AC <strong>${derived.armorClass}</strong> | Initiative <strong>${plus(derived.initiative)}</strong></p>
      <p>Speed <strong>${derived.speed} ft</strong> | Passive Perception <strong>${derived.passivePerception}</strong></p>
      <p>${ruleset.family === "5e" ? `Proficiency Bonus <strong>${plus(derived.proficiencyBonus)}</strong>` : "3.5e uses BAB and save progressions"}</p>
    </div>

    ${progressionBlock}
    ${spellBlock}

    <div class="sheet-block">
      <h4>Selected Skills</h4>
      <div class="sheet-tags">${tags(derived.selectedSkills)}</div>
    </div>

    <div class="sheet-block">
      <h4>Selected Feats</h4>
      <div class="sheet-tags">${tags(derived.selectedFeats)}</div>
    </div>

    <div class="sheet-block">
      <h4>Selected Spells</h4>
      <div class="sheet-tags">${tags(derived.selectedSpells)}</div>
    </div>

    <div class="sheet-block">
      <h4>Selected Items</h4>
      <div class="sheet-tags">${tags(derived.selectedItems)}</div>
    </div>

    <div class="sheet-block">
      <h4>Unlocked Class Features</h4>
      ${listLines(featureLines, "No unlocked class features yet.")}
    </div>

    <div class="sheet-block">
      <h4>Validation Summary</h4>
      <p>Blocking issues: <strong>${blockingIssues}</strong> | Warnings: <strong>${warningIssues}</strong></p>
      <p>${blockingIssues === 0 ? "Build is ready for completion and printing." : "Resolve blocking issues in the Review step."}</p>
    </div>
  `;
}
