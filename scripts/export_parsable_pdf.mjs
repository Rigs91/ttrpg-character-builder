import fs from "node:fs";
import path from "node:path";
import { RULESETS, getRulesetById, DEFAULT_ABILITY_SCORES } from "../src/data/rulesets.js";
import { deriveCharacterSheet } from "../src/engine/rulesEngine.js";
import { validateCharacter } from "../src/engine/validators.js";
import { buildParsableCharacterLines } from "../src/utils/characterExport.js";
import { buildSimplePdf } from "../src/utils/pdfBuilder.js";

function usage() {
  console.log("Usage: node scripts/export_parsable_pdf.mjs <input-json> <output-pdf>");
}

function normalizeState(raw) {
  const ruleset = getRulesetById(raw?.rulesetId || RULESETS[0].id);
  const firstClass = ruleset.classes[0];
  const firstSubclass = firstClass?.subclasses?.[0]?.id || "";

  return {
    rulesetId: ruleset.id,
    experienceMode: raw?.experienceMode || "new",
    name: raw?.name || "",
    playerName: raw?.playerName || "",
    level: Number(raw?.level || 1),
    alignment: raw?.alignment || ruleset.alignments[0] || "",
    backgroundId: raw?.backgroundId || ruleset.backgrounds[0]?.id || "",
    speciesId: raw?.speciesId || ruleset.species[0]?.id || "",
    classId: raw?.classId || firstClass?.id || "",
    subclassId: raw?.subclassId || firstSubclass,
    notes: raw?.notes || "",
    abilityMethodId: raw?.abilityMethodId || ruleset.abilityMethods[0]?.id || "point-buy",
    assignedScores: { ...DEFAULT_ABILITY_SCORES, ...(raw?.assignedScores || {}) },
    selectedSkillIds: Array.isArray(raw?.selectedSkillIds) ? raw.selectedSkillIds : [],
    selectedFeatIds: Array.isArray(raw?.selectedFeatIds) ? raw.selectedFeatIds : [],
    selectedSpellIds: Array.isArray(raw?.selectedSpellIds) ? raw.selectedSpellIds : [],
    selectedItemIds: Array.isArray(raw?.selectedItemIds) ? raw.selectedItemIds : []
  };
}

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  usage();
  process.exit(1);
}

const inputAbsolute = path.resolve(process.cwd(), inputPath);
const outputAbsolute = path.resolve(process.cwd(), outputPath);

const raw = JSON.parse(fs.readFileSync(inputAbsolute, "utf8"));
const state = normalizeState(raw);
const derived = deriveCharacterSheet(state, RULESETS);
const issues = validateCharacter(state, RULESETS);
const lines = buildParsableCharacterLines(state, derived, issues);
const pdfBytes = buildSimplePdf(lines, {
  title: `Forge Character - ${state.name || "Unnamed"}`
});

fs.writeFileSync(outputAbsolute, pdfBytes);
console.log(`Parsable PDF written: ${outputAbsolute}`);
console.log(`Validation issues: ${issues.length}`);
