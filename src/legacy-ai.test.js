import test from "node:test";
import assert from "node:assert/strict";

import {
  applyAssistPreviewToState,
  buildAssistReplyEnvelope,
  createAssistDraft,
  mapLegacyStepToAiStep,
  normalizeChatHistory
} from "./chat/aiAssistant.js";

const abilityDefaults = {
  str: 8,
  dex: 8,
  con: 8,
  int: 8,
  wis: 8,
  cha: 8
};

test("createAssistDraft includes legacy arrays, defaults, and skill ranks", () => {
  const draft = createAssistDraft(
    {
      rulesetId: "5e-2024",
      experienceMode: "new",
      name: "Aria",
      level: "3",
      assignedScores: { wis: 15, cha: 12 },
      selectedSkillIds: ["insight"],
      skillRanks: { insight: 2 },
      selectedItemIds: ["shield"]
    },
    abilityDefaults
  );

  assert.equal(draft.level, 3);
  assert.equal(draft.assignedScores.str, 8);
  assert.equal(draft.assignedScores.wis, 15);
  assert.deepEqual(draft.selectedSkillIds, ["insight"]);
  assert.deepEqual(draft.skillRanks, { insight: 2 });
  assert.deepEqual(draft.selectedItemIds, ["shield"]);
});

test("applyAssistPreviewToState normalizes preview arrays and ability defaults", () => {
  const nextState = applyAssistPreviewToState(
    {
      rulesetId: "5e-2024",
      level: 1,
      selectedSpellIds: ["bless"],
      assignedScores: { ...abilityDefaults, str: 10 },
      skillRanks: {}
    },
    {
      rulesetId: "5e-2024",
      level: 4,
      assignedScores: { dex: 14, wis: 16 },
      selectedSpellIds: ["guiding-bolt", "healing-word"],
      skillRanks: { perception: 1 }
    },
    abilityDefaults
  );

  assert.equal(nextState.level, 4);
  assert.equal(nextState.assignedScores.str, 8);
  assert.equal(nextState.assignedScores.dex, 14);
  assert.deepEqual(nextState.selectedSpellIds, ["guiding-bolt", "healing-word"]);
  assert.deepEqual(nextState.skillRanks, { perception: 1 });
});

test("normalizeChatHistory keeps only user and assistant turns", () => {
  const history = normalizeChatHistory([
    { role: "assistant", text: "Describe your character." },
    { role: "user", text: "A level 3 dwarf cleric." },
    { role: "system", text: "ignore me" },
    { role: "assistant", text: "Applied cleric and dwarf." }
  ]);

  assert.deepEqual(history, [
    { role: "assistant", content: "Describe your character." },
    { role: "user", content: "A level 3 dwarf cleric." },
    { role: "assistant", content: "Applied cleric and dwarf." }
  ]);
});

test("buildAssistReplyEnvelope summarizes changes and open questions", () => {
  const summary = buildAssistReplyEnvelope({
    assistantMessage: "Filled the core identity fields.",
    appliedFields: [
      { summary: "Name set to Aria" },
      { summary: "Class set to Cleric" }
    ],
    unresolvedQuestions: [{ prompt: "Which background do you want?" }],
    issues: [{ severity: "warning" }]
  });

  assert.match(summary, /Filled the core identity fields\./);
  assert.match(summary, /Applied: Name set to Aria; Class set to Cleric\./);
  assert.match(summary, /Still needed: Which background do you want\?/);
  assert.match(summary, /Validation now shows 0 error\(s\) and 1 warning\(s\)\./);
});

test("mapLegacyStepToAiStep only forwards unambiguous steps", () => {
  assert.equal(mapLegacyStepToAiStep("setup"), undefined);
  assert.equal(mapLegacyStepToAiStep("build"), undefined);
  assert.equal(mapLegacyStepToAiStep("abilities"), "abilities");
  assert.equal(mapLegacyStepToAiStep("review"), "review");
});
