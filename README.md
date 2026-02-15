# Forge Character

Multi-edition D&D character creator (SRD-oriented) for:

- D&D 5e 2024 (SRD 5.2.1)
- D&D 5e 2014 (SRD 5.1)
- D&D 3.5e SRD

## Features

- Guided and experienced creation modes
- Ruleset switcher with edition-specific data packs
- Multi-pass expanded content packs with parity tracking
- Deterministic validation and stat derivation
- Ability allocation methods: point-buy, standard array, manual
- Class/species/background selection with subclass support
- Skills, feats, spells, and item selection
- Live character sheet output
- Local draft save/load/delete (localStorage)
- JSON export/import
- Print-to-PDF character sheet flow (`window.print()`)
- Parsable PDF export with machine markers and embedded JSON payload
- Optional deterministic chat helper

## Pass-4 Coverage Snapshot

- 5e 2024: `149` spells, `104` items, `52` feats
- 5e 2014: `149` spells, `104` items, `52` feats
- 3.5e: `117` spells, `100` items, `49` feats

Class feature progression depth is now represented through level 20 for all classes in all supported rulesets.
The Review step includes a coverage panel comparing current pack counts and feature-depth against configured targets.

## Run

```bash
npm.cmd run dev
```

Then open:

- `http://localhost:3000`

## Parsable PDF (UI)

Use `Export Parsable PDF` in the Review step. The generated PDF includes:

- deterministic machine markers such as `@@FIELD@@`, `@@LIST@@`, `@@SECTION@@`
- an embedded JSON block between `@@JSON_START@@` and `@@JSON_END@@`

## Parsable PDF (CLI)

```bash
npm.cmd run pdf:export -- <input-draft.json> <output.pdf>
```

Example:

```bash
npm.cmd run pdf:export -- tmp_draft.json tmp_draft.pdf
```

## Project Layout

- `index.html`: app shell
- `styles.css`: visual system + responsive + print styles
- `src/data/expansions.js`: pass-based content expansion packs
- `src/data/rulesets.js`: multi-edition content packs and metadata
- `src/engine/rulesEngine.js`: deterministic derivation engine
- `src/engine/validators.js`: structured validation rules
- `src/ui/sheet.js`: character sheet renderer
- `src/chat/assistant.js`: deterministic helper chat responses
- `src/utils/characterExport.js`: parsable export payload and line generation
- `src/utils/pdfBuilder.js`: dependency-free PDF byte builder
- `src/utils/storage.js`: local persistence + JSON import/export
- `src/main.js`: UI wiring and orchestration
- `scripts/server.mjs`: dependency-free static server
- `scripts/export_parsable_pdf.mjs`: CLI PDF export from draft JSON

## Notes

- Content is SRD-oriented and license notices are shown in-app.
- Deterministic engine is source of truth for legality and calculations.
- Chat helper is advisory only.
