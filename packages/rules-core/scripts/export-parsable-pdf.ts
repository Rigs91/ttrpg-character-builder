import fs from "node:fs";
import path from "node:path";
import { buildParsableCharacterLines, buildSimplePdf, deriveCharacter, parseCharacterDraftJson, validateCharacter } from "../src/index.js";

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.log("Usage: npm run pdf:export --workspace @forge/rules-core -- <input-json> <output-pdf>");
  process.exit(1);
}

const inputAbsolute = path.resolve(process.cwd(), inputPath);
const outputAbsolute = path.resolve(process.cwd(), outputPath);
const draft = parseCharacterDraftJson(fs.readFileSync(inputAbsolute, "utf8"));
const validation = validateCharacter(draft);
const derived = deriveCharacter(draft);
const lines = buildParsableCharacterLines(draft, derived, validation.issues);
const pdfBytes = buildSimplePdf(lines, { title: `Forge Character - ${draft.name || "Unnamed"}` });

fs.writeFileSync(outputAbsolute, pdfBytes);
console.log(`Parsable PDF written: ${outputAbsolute}`);
console.log(`Validation issues: ${validation.summary.total}`);
