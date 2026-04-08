# Publish Steps

## Recommended Repo Name

`ttrpg-character-builder`

## GitHub About Text

`Guided fantasy character builder with rules-aware validation, exports, and optional local AI assist.`

## Suggested Homepage Text

`Workflow-first tabletop RPG character builder focused on clear, rules-aware character creation.`

## GitHub Topics

- `ttrpg`
- `character-builder`
- `rpg`
- `fantasy`
- `game-tools`
- `workflow-design`
- `rules-engine`
- `typescript`
- `react`
- `ollama`

## Publish Flow

If you want to publish from this checkout with GitHub CLI:

```bash
git add .
git commit -m "Prepare portfolio release for Forge Character"
gh repo create ttrpg-character-builder --public --source . --remote origin --push --description "Guided fantasy character builder with rules-aware validation, exports, and optional local AI assist."
gh repo edit --description "Guided fantasy character builder with rules-aware validation, exports, and optional local AI assist."
gh repo edit --add-topic ttrpg --add-topic character-builder --add-topic rpg --add-topic fantasy --add-topic game-tools --add-topic workflow-design --add-topic rules-engine --add-topic typescript --add-topic react --add-topic ollama
```

## Final Pre-Publish Checks

- Confirm screenshots render correctly in `README.md`
- Confirm `npm.cmd run typecheck`, `npm.cmd run test`, `npm.cmd run build`, and `npm.cmd run bundle:static` all pass
- Confirm the root builder launches cleanly through `START_FORGE_CHARACTER_AI.cmd`
- Confirm no runtime data, local databases, or private environment files are staged
