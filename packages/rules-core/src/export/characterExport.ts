import type { CharacterDraft, CharacterIssue, DerivedCharacter, IssueSummary } from "../contracts.js";

function chunkString(value: string, chunkSize: number) {
  const chunks: string[] = [];
  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize));
  }
  return chunks;
}

export function summarizeIssues(issues: CharacterIssue[]): IssueSummary {
  return {
    total: issues.length,
    errors: issues.filter((item) => item.severity === "error").length,
    warnings: issues.filter((item) => item.severity === "warning").length,
    info: issues.filter((item) => item.severity === "info").length
  };
}

export function buildParsableCharacterPayload(draft: CharacterDraft, derived: DerivedCharacter | null, issues: CharacterIssue[]) {
  return {
    exportVersion: "forge-character-v2",
    exportedAt: new Date().toISOString(),
    draft,
    derived,
    issueSummary: summarizeIssues(issues),
    issues
  };
}

export function buildParsableCharacterLines(draft: CharacterDraft, derived: DerivedCharacter | null, issues: CharacterIssue[]) {
  const payload = buildParsableCharacterPayload(draft, derived, issues);
  const lines = [
    "@@FORGE_CHARACTER_EXPORT@@ version=2",
    `@@FIELD@@ exported_at=${payload.exportedAt}`,
    "@@SECTION@@ identity",
    `@@FIELD@@ ruleset_id=${draft.rulesetId}`,
    `@@FIELD@@ character_name=${draft.name}`,
    `@@FIELD@@ player_name=${draft.playerName}`,
    `@@FIELD@@ level=${derived?.level ?? draft.level}`,
    `@@FIELD@@ class=${derived?.className || ""}`,
    `@@FIELD@@ subclass=${derived?.subclassName || ""}`,
    `@@FIELD@@ species=${derived?.speciesName || ""}`,
    `@@FIELD@@ background=${derived?.backgroundName || ""}`,
    `@@FIELD@@ alignment=${draft.alignment}`,
    "@@SECTION@@ combat",
    `@@FIELD@@ hit_points=${derived?.hitPoints ?? ""}`,
    `@@FIELD@@ armor_class=${derived?.armorClass ?? ""}`,
    `@@FIELD@@ initiative=${derived?.initiative ?? ""}`,
    `@@FIELD@@ passive_perception=${derived?.passivePerception ?? ""}`,
    `@@FIELD@@ proficiency_bonus=${derived?.proficiencyBonus ?? ""}`,
    `@@FIELD@@ base_attack_bonus=${derived?.baseAttackBonus ?? ""}`,
    "@@SECTION@@ selections",
    `@@LIST@@ skills=${(derived?.selectedSkills || []).map((item) => item.name).join("|")}`,
    `@@LIST@@ feats=${(derived?.selectedFeats || []).map((item) => item.name).join("|")}`,
    `@@LIST@@ spells=${(derived?.selectedSpells || []).map((item) => item.name).join("|")}`,
    `@@LIST@@ items=${(derived?.selectedItems || []).map((item) => item.name).join("|")}`,
    "@@SECTION@@ attacks",
    ...((derived?.attacks || []).map((attack, index) => `@@FIELD@@ attack_${index + 1}=${attack.name}|${attack.attackBonus}|${attack.damage}|${attack.notes}`)),
    "@@SECTION@@ validation",
    `@@FIELD@@ validation_total=${payload.issueSummary.total}`,
    `@@FIELD@@ validation_errors=${payload.issueSummary.errors}`,
    `@@FIELD@@ validation_warnings=${payload.issueSummary.warnings}`,
    `@@FIELD@@ validation_info=${payload.issueSummary.info}`,
    "@@JSON_START@@"
  ];

  const jsonText = JSON.stringify(payload);
  for (const chunk of chunkString(jsonText, 96)) {
    lines.push(`@@JSON@@ ${chunk}`);
  }
  lines.push("@@JSON_END@@");
  return lines;
}
