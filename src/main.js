import {
  ABILITY_NAMES,
  DEFAULT_ABILITY_SCORES,
  RULESETS,
  getRulesetById,
  getCoverageReport,
  findById,
  findClassById
} from "./data/rulesets.js";
import { deriveCharacterSheet, calculatePointBuyTotal } from "./engine/rulesEngine.js";
import { validateCharacter } from "./engine/validators.js";
import { renderSheet } from "./ui/sheet.js";
import {
  getSavedDrafts,
  saveDraft,
  deleteDraftById,
  exportDraftToFile,
  importDraftFromFile
} from "./utils/storage.js";
import { buildSimplePdf } from "./utils/pdfBuilder.js";
import { buildParsableCharacterLines, buildParsableCharacterPayload } from "./utils/characterExport.js";
import { buildChatReply } from "./chat/assistant.js";
import {
  applyAssistPreviewToState,
  buildAssistReplyEnvelope,
  createAssistDraft,
  fetchAiModelCatalog,
  mapLegacyStepToAiStep,
  normalizeChatHistory,
  requestCharacterAssist
} from "./chat/aiAssistant.js";

const dom = {
  rulesetSelect: document.querySelector("#rulesetSelect"),
  experienceMode: document.querySelector("#experienceMode"),
  characterName: document.querySelector("#characterName"),
  playerName: document.querySelector("#playerName"),
  characterLevel: document.querySelector("#characterLevel"),
  alignmentSelect: document.querySelector("#alignmentSelect"),
  backgroundSelect: document.querySelector("#backgroundSelect"),
  speciesSelect: document.querySelector("#speciesSelect"),
  classSelect: document.querySelector("#classSelect"),
  subclassSelect: document.querySelector("#subclassSelect"),
  characterNotes: document.querySelector("#characterNotes"),
  abilityMethodSelect: document.querySelector("#abilityMethodSelect"),
  abilityMethodSummary: document.querySelector("#abilityMethodSummary"),
  abilityTable: document.querySelector("#abilityTable"),
  pointBuyPill: document.querySelector("#pointBuyPill"),
  validationPill: document.querySelector("#validationPill"),
  applyStandardArrayBtn: document.querySelector("#applyStandardArrayBtn"),
  resetAbilitiesBtn: document.querySelector("#resetAbilitiesBtn"),
  skillsList: document.querySelector("#skillsList"),
  featsList: document.querySelector("#featsList"),
  spellsList: document.querySelector("#spellsList"),
  itemsList: document.querySelector("#itemsList"),
  skillsLimitLabel: document.querySelector("#skillsLimitLabel"),
  spellSearch: document.querySelector("#spellSearch"),
  itemSearch: document.querySelector("#itemSearch"),
  validateBtn: document.querySelector("#validateBtn"),
  saveDraftBtn: document.querySelector("#saveDraftBtn"),
  newCharacterBtn: document.querySelector("#newCharacterBtn"),
  exportJsonBtn: document.querySelector("#exportJsonBtn"),
  exportPdfBtn: document.querySelector("#exportPdfBtn"),
  importJsonInput: document.querySelector("#importJsonInput"),
  savedDraftsSelect: document.querySelector("#savedDraftsSelect"),
  loadDraftBtn: document.querySelector("#loadDraftBtn"),
  deleteDraftBtn: document.querySelector("#deleteDraftBtn"),
  useInGameBtn: document.querySelector("#useInGameBtn"),
  randomizeCharacterBtn: document.querySelector("#randomizeCharacterBtn"),
  completeBuildBtn: document.querySelector("#completeBuildBtn"),
  printSheetBtn: document.querySelector("#printSheetBtn"),
  statusMessage: document.querySelector("#statusMessage"),
  validationList: document.querySelector("#validationList"),
  coveragePanel: document.querySelector("#coveragePanel"),
  sheetContainer: document.querySelector("#sheetContainer"),
  stepButtons: Array.from(document.querySelectorAll(".step")),
  stepPanels: Array.from(document.querySelectorAll("[data-step-panel]")),
  rulesetTip: document.querySelector("#rulesetTip"),
  abilityTip: document.querySelector("#abilityTip"),
  setupExplainers: document.querySelector("#setupExplainers"),
  buildExplainers: document.querySelector("#buildExplainers"),
  licenseNotice: document.querySelector("#licenseNotice"),
  chatModePill: document.querySelector("#chatModePill"),
  chatModelSelect: document.querySelector("#chatModelSelect"),
  chatStatusNote: document.querySelector("#chatStatusNote"),
  chatLog: document.querySelector("#chatLog"),
  chatInput: document.querySelector("#chatInput"),
  chatSendBtn: document.querySelector("#chatSendBtn")
};

const ABILITY_KEYS = ABILITY_NAMES.map((ability) => ability.key);

let state = createInitialState(RULESETS[0]);
let derived = null;
let issues = [];
let activeStep = "setup";
let chatMessages = [
  {
    role: "assistant",
    text: "Describe the character you want in plain English and I will fill the builder for you. If Ollama is offline, this panel falls back to guide answers."
  }
];
let aiState = {
  initialized: false,
  loading: false,
  available: false,
  selectedModel: "",
  models: [],
  reason: "Checking local AI availability...",
  busy: false
};

const ALIGNMENT_GUIDE = {
  "Lawful Good": {
    meaning: "Honorable hero who follows codes and protects others.",
    impact: "Mostly roleplay tone; some tables and spells interact with moral alignment."
  },
  "Neutral Good": {
    meaning: "Kind and practical, helping people without strict ideology.",
    impact: "Great flexible roleplay baseline for cooperative parties."
  },
  "Chaotic Good": {
    meaning: "Compassionate rebel who distrusts rigid systems.",
    impact: "Roleplay freedom; can clash with highly lawful party members."
  },
  "Lawful Neutral": {
    meaning: "Values order, duty, and structure over personal feelings.",
    impact: "Strong for disciplined archetypes like judges, soldiers, and monks."
  },
  "True Neutral": {
    meaning: "Balanced worldview focused on pragmatism and survival.",
    impact: "Easiest alignment to roleplay in mixed-morality groups."
  },
  "Chaotic Neutral": {
    meaning: "Highly independent and anti-authority personality.",
    impact: "Can be fun, but needs party-aware roleplay to avoid disruption."
  },
  "Lawful Evil": {
    meaning: "Ambitious and ruthless within strict personal rules.",
    impact: "Works only if your table supports morally dark characters."
  },
  "Neutral Evil": {
    meaning: "Self-serving and opportunistic without loyalty to causes.",
    impact: "High conflict potential; coordinate with your DM and party."
  },
  "Chaotic Evil": {
    meaning: "Destructive, impulsive, and violently selfish.",
    impact: "Rarely party-friendly; often unsuitable for standard campaigns."
  }
};

const SKILL_GUIDE = {
  acrobatics: "Balance, tumbling, and escaping grapples.",
  "animal-handling": "Calm animals, mount control, and handling beasts.",
  arcana: "Magic knowledge, spell theory, and planar lore.",
  athletics: "Climb, swim, shove, and grapple strength tests.",
  deception: "Bluff, lies, and misleading others.",
  history: "Recall empires, wars, lineages, and events.",
  insight: "Read motives, emotions, and social tells.",
  intimidation: "Force outcomes through threat or presence.",
  investigation: "Deduce clues and inspect evidence.",
  medicine: "Stabilize allies and diagnose conditions.",
  nature: "Understand wilderness, creatures, and terrain.",
  perception: "Spot hidden threats and hear subtle clues.",
  performance: "Music, acting, speech, and stage presence.",
  persuasion: "Negotiate, influence, and build trust.",
  religion: "Know deities, rites, and divine traditions.",
  "sleight-of-hand": "Pickpocketing and precise hand tricks.",
  stealth: "Move quietly and stay unseen.",
  survival: "Track creatures and navigate wild areas.",
  appraise: "Estimate item value and authenticity.",
  bluff: "Convince with misinformation.",
  concentration: "Maintain focus while under pressure.",
  "disable-device": "Disarm traps and disable mechanisms.",
  "gather-information": "Collect rumors and local intel.",
  hide: "Remain unseen in cover and shadow.",
  "knowledge-arcana": "Arcane systems and magical creatures.",
  "knowledge-history": "Historical events and old conflicts.",
  "move-silently": "Avoid making noise while moving.",
  "open-lock": "Bypass locks and secured entries.",
  "sense-motive": "Detect lies and bad intent.",
  spellcraft: "Identify active spells and magical effects.",
  spot: "Visual awareness and threat detection.",
  tumble: "Move through danger without provoking attacks.",
  "use-magic-device": "Activate magic items outside your class."
};

const RANDOM_NAME_PREFIXES = ["Ael", "Bryn", "Cor", "Dra", "Eri", "Fen", "Garr", "Ily", "Kael", "Lys", "Mira", "Nyx", "Orin", "Pere", "Quin", "Ryn", "Syl", "Ther", "Vael", "Zor"];
const RANDOM_NAME_SUFFIXES = ["ador", "bryn", "cinder", "dell", "en", "fira", "gorn", "hollow", "ian", "jara", "kas", "lor", "myr", "neth", "or", "pris", "quil", "rion", "sorin", "thas"];
const RANDOM_PLAYER_NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Riley", "Cameron", "Avery", "Logan", "Casey", "Rowan"];
const RANDOM_NOTES_OPENERS = [
  "Hunts rumors of an ancient relic.",
  "Seeks redemption for a failed oath.",
  "Protects a secret tied to their bloodline.",
  "Owes a dangerous favor to a hidden patron.",
  "Believes fate marked them for this quest."
];
const RANDOM_NOTES_TWISTS = [
  "Distrusts nobility but respects honest soldiers.",
  "Never refuses a fair duel.",
  "Collects strange maps and coded journals.",
  "Will always aid children and common folk first.",
  "Keeps a coded letter they refuse to burn."
];

function createInitialState(ruleset) {
  return {
    draftId: "",
    rulesetId: ruleset.id,
    experienceMode: "new",
    name: "",
    playerName: "",
    level: 1,
    alignment: ruleset.alignments[0] || "",
    backgroundId: ruleset.backgrounds[0]?.id || "",
    speciesId: ruleset.species[0]?.id || "",
    classId: ruleset.classes[0]?.id || "",
    subclassId: ruleset.classes[0]?.subclasses?.[0]?.id || "",
    notes: "",
    abilityMethodId: ruleset.abilityMethods[0]?.id || "point-buy",
    assignedScores: { ...DEFAULT_ABILITY_SCORES },
    selectedSkillIds: [],
    skillRanks: {},
    selectedFeatIds: [],
    selectedSpellIds: [],
    selectedItemIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function status(message) {
  dom.statusMessage.textContent = message;
}

function currentRuleset() {
  return getRulesetById(state.rulesetId);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function trimChatMessages() {
  if (chatMessages.length > 50) {
    chatMessages = chatMessages.slice(chatMessages.length - 50);
  }
}

function updateChatModePill(tone, text) {
  dom.chatModePill.className = `chat-status-pill chat-status-pill--${tone}`;
  dom.chatModePill.textContent = text;
}

function renderChatStatus() {
  if (aiState.loading) {
    updateChatModePill("checking", "Checking AI...");
    dom.chatStatusNote.textContent = "Probing the local API and Ollama model catalog.";
    dom.chatModelSelect.innerHTML = "<option value=''>Checking Ollama...</option>";
    dom.chatModelSelect.disabled = true;
    return;
  }

  if (aiState.available) {
    const modelOptions = aiState.models
      .map((model) => {
        const selected = model.name === aiState.selectedModel ? "selected" : "";
        return `<option value="${escapeHtml(model.name)}" ${selected}>${escapeHtml(model.name)}</option>`;
      })
      .join("");
    dom.chatModelSelect.innerHTML = modelOptions || "<option value=''>Default model</option>";
    dom.chatModelSelect.disabled = aiState.busy || aiState.models.length <= 1;
    updateChatModePill("ready", `AI Ready${aiState.selectedModel ? `: ${aiState.selectedModel}` : ""}`);
    dom.chatStatusNote.textContent = "Free text now auto-fills the builder through Ollama. Send a follow-up message any time to refine the current draft.";
    return;
  }

  dom.chatModelSelect.innerHTML = "<option value=''>Guide mode</option>";
  dom.chatModelSelect.disabled = true;
  updateChatModePill("offline", "Guide Mode");
  dom.chatStatusNote.textContent = aiState.reason
    ? `AI autofill is offline: ${aiState.reason}`
    : "AI autofill is offline. This panel still answers with deterministic guide help.";
}

function setChatBusy(isBusy) {
  aiState.busy = isBusy;
  dom.chatSendBtn.disabled = isBusy;
  dom.chatInput.disabled = isBusy;
  renderChatStatus();
}

async function ensureAiCatalog(force = false) {
  if (aiState.loading) {
    return;
  }
  if (aiState.initialized && !force) {
    return;
  }

  aiState.loading = true;
  renderChatStatus();
  const catalog = await fetchAiModelCatalog();
  aiState.loading = false;
  aiState.initialized = true;
  aiState.available = Boolean(catalog.available && catalog.models?.length);
  aiState.models = catalog.models || [];
  aiState.reason = catalog.reason || (aiState.available ? "" : "The local API or Ollama is unavailable.");
  if (!aiState.models.some((entry) => entry.name === aiState.selectedModel)) {
    aiState.selectedModel = catalog.defaultModel || aiState.models[0]?.name || "";
  }
  renderChatStatus();
}

function optionHtml(items, selectedId, includeEmpty = false, emptyLabel = "Select...") {
  const options = [];
  if (includeEmpty) {
    options.push(`<option value=\"\">${emptyLabel}</option>`);
  }

  for (const item of items || []) {
    const selected = item.id === selectedId ? "selected" : "";
    options.push(`<option value=\"${item.id}\" ${selected}>${item.name}</option>`);
  }

  return options.join("");
}

function textOptionHtml(items, selectedValue) {
  return (items || [])
    .map((entry) => {
      const selected = entry === selectedValue ? "selected" : "";
      return `<option value=\"${entry}\" ${selected}>${entry}</option>`;
    })
    .join("");
}

function toSentence(value, fallback = "Not specified") {
  const text = String(value || "").trim();
  return text ? text : fallback;
}

function listToText(values, fallback = "None") {
  if (!values || !values.length) {
    return fallback;
  }
  return values.join(", ");
}

function slugify(value) {
  return String(value || "character")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "character";
}

function randomInt(min, max) {
  const start = Math.ceil(Math.min(min, max));
  const end = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

function pickRandom(collection) {
  if (!collection?.length) {
    return null;
  }
  return collection[randomInt(0, collection.length - 1)];
}

function shuffleCopy(collection) {
  const copy = [...(collection || [])];
  for (let idx = copy.length - 1; idx > 0; idx -= 1) {
    const swapIdx = randomInt(0, idx);
    [copy[idx], copy[swapIdx]] = [copy[swapIdx], copy[idx]];
  }
  return copy;
}

function randomSubsetIds(collection, count) {
  if (!collection?.length || count <= 0) {
    return [];
  }
  return shuffleCopy(collection)
    .slice(0, Math.min(count, collection.length))
    .map((entry) => entry.id);
}

function randomCharacterName() {
  const first = pickRandom(RANDOM_NAME_PREFIXES) || "Nyx";
  const second = pickRandom(RANDOM_NAME_SUFFIXES) || "en";
  return `${first}${second}`;
}

function randomPlayerName() {
  return pickRandom(RANDOM_PLAYER_NAMES) || "Player";
}

function randomCharacterNotes() {
  const opener = pickRandom(RANDOM_NOTES_OPENERS) || "";
  const twist = pickRandom(RANDOM_NOTES_TWISTS) || "";
  return `${opener} ${twist}`.trim();
}

function randomizeAbilityScores(method) {
  const safeMin = Number.isFinite(method?.min) ? Number(method.min) : 8;
  const safeMax = Number.isFinite(method?.max) ? Number(method.max) : 15;

  if (method?.id === "standard-array" && Array.isArray(method.array) && method.array.length >= ABILITY_KEYS.length) {
    const randomArray = shuffleCopy(method.array).slice(0, ABILITY_KEYS.length);
    return Object.fromEntries(ABILITY_KEYS.map((key, idx) => [key, Number(randomArray[idx])]));
  }

  if (method?.id === "point-buy" && method?.costTable && Number.isFinite(method?.budget)) {
    const scores = Object.fromEntries(ABILITY_KEYS.map((key) => [key, safeMin]));
    const costFor = (score) => Number(method.costTable?.[score]);

    let currentTotal = ABILITY_KEYS.reduce((sum, key) => sum + costFor(scores[key]), 0);
    if (!Number.isFinite(currentTotal)) {
      return { ...DEFAULT_ABILITY_SCORES };
    }

    let remaining = Number(method.budget) - currentTotal;
    let guard = 0;
    while (remaining > 0 && guard < 256) {
      guard += 1;
      const candidates = ABILITY_KEYS.filter((key) => {
        const current = scores[key];
        const next = current + 1;
        if (next > safeMax) {
          return false;
        }
        const delta = costFor(next) - costFor(current);
        return Number.isFinite(delta) && delta > 0 && delta <= remaining;
      });
      if (!candidates.length) {
        break;
      }
      const abilityKey = pickRandom(candidates);
      const current = scores[abilityKey];
      const next = current + 1;
      const delta = costFor(next) - costFor(current);
      scores[abilityKey] = next;
      remaining -= delta;
    }
    return scores;
  }

  return Object.fromEntries(
    ABILITY_KEYS.map((key) => [key, randomInt(safeMin, safeMax)])
  );
}

function randomizeCharacter() {
  const ruleset = currentRuleset();
  const levelMin = ruleset?.levelBounds?.min ?? 1;
  const levelMax = ruleset?.levelBounds?.max ?? 20;
  const randomClass = pickRandom(ruleset.classes) || ruleset.classes[0];
  const randomMethod = pickRandom(ruleset.abilityMethods) || ruleset.abilityMethods[0];

  state.name = randomCharacterName();
  state.playerName = randomPlayerName();
  state.level = randomInt(levelMin, levelMax);
  state.alignment = pickRandom(ruleset.alignments) || state.alignment;
  state.backgroundId = pickRandom(ruleset.backgrounds)?.id || "";
  state.speciesId = pickRandom(ruleset.species)?.id || "";
  state.classId = randomClass?.id || "";
  state.subclassId = pickRandom(randomClass?.subclasses || [])?.id || "";
  state.notes = randomCharacterNotes();
  state.abilityMethodId = randomMethod?.id || state.abilityMethodId;
  state.assignedScores = randomizeAbilityScores(randomMethod);

  const classSkillLimit = Math.max(0, Number(randomClass?.skillChoices || 0));
  state.selectedSkillIds = randomSubsetIds(ruleset.skills, classSkillLimit);
  state.skillRanks = {};

  const featMax = Math.min(3, ruleset.feats.length);
  const featCount = featMax > 0 ? randomInt(1, featMax) : 0;
  state.selectedFeatIds = randomSubsetIds(ruleset.feats, featCount);

  const itemMax = Math.min(6, ruleset.items.length);
  const itemMin = Math.min(2, itemMax);
  const itemCount = itemMax > 0 ? randomInt(itemMin, itemMax) : 0;
  state.selectedItemIds = randomSubsetIds(ruleset.items, itemCount);

  state.selectedSpellIds = [];
  const derivedCandidate = deriveCharacterSheet(state, RULESETS);
  if (derivedCandidate?.spellcasting?.spellPickLimit) {
    const spellLimit = Math.min(Number(derivedCandidate.spellcasting.spellPickLimit), ruleset.spells.length);
    const cappedMax = Math.min(12, spellLimit);
    const spellMin = Math.min(2, cappedMax);
    const spellCount = cappedMax > 0 ? randomInt(spellMin, cappedMax) : 0;
    state.selectedSpellIds = randomSubsetIds(ruleset.spells, spellCount);
  }

  syncFormToState();
  recompute();
  changeStep("setup");
  status("Randomized a full character build. Press Randomize Character again to reroll.");
}

function getSkillDescription(skill) {
  if (!skill) {
    return "Skill details unavailable.";
  }
  return SKILL_GUIDE[skill.slug] || `${skill.name} tests your ${String(skill.ability || "").toUpperCase()} ability in play.`;
}

function classImpactText(characterClass, ruleset) {
  if (!characterClass) {
    return "Choose a class to see your core gameplay loop.";
  }
  const primary = (characterClass.primaryAbilities || []).map((value) => value.toUpperCase()).join(", ");
  const hitDie = characterClass.hitDie ? `d${characterClass.hitDie}` : "variable";
  const spellFlag = characterClass.spellcasting ? "Includes spellcasting progression." : "Primarily non-spellcasting.";
  if (ruleset.family === "3.5e") {
    const bab = characterClass.baseAttackProgression || "mixed";
    return `Primary abilities: ${primary}. Hit Die: ${hitDie}. BAB progression: ${bab}. ${spellFlag}`;
  }
  return `Primary abilities: ${primary}. Hit Die: ${hitDie}. ${spellFlag}`;
}

function renderExplainerCards(container, cards) {
  if (!container) {
    return;
  }
  if (!cards.length) {
    container.innerHTML = "<p class='helper'>No explainer content available yet.</p>";
    return;
  }
  container.innerHTML = cards
    .map((card) => {
      return `
        <article class="explainer-card">
          <h4>${card.title}</h4>
          <p>${card.body}</p>
          <p class="impact"><strong>Impact:</strong> ${card.impact}</p>
        </article>
      `;
    })
    .join("");
}

function renderSetupExplainers() {
  const ruleset = currentRuleset();
  const alignment = state.alignment;
  const alignmentGuide = ALIGNMENT_GUIDE[alignment] || {
    meaning: "Represents your character's moral and ethical tendencies.",
    impact: "Usually roleplay-facing, with occasional mechanical hooks."
  };
  const background = findById(ruleset.backgrounds, state.backgroundId);
  const species = findById(ruleset.species, state.speciesId);
  const characterClass = findClassById(ruleset, state.classId);
  const subclass = findById(characterClass?.subclasses, state.subclassId);

  const backgroundBody = background
    ? `${background.name} describes where your character came from. It grants skills/tools/languages and thematic story hooks.`
    : "Background describes your prior life before adventuring.";
  const backgroundImpact = background
    ? `Skills: ${listToText(background.skillProficiencies)}. Tools: ${listToText(background.toolProficiencies)}.`
    : "Background selection shapes starting proficiencies.";

  const speciesBody = species
    ? `${species.name} defines innate traits like speed, senses, and ancestry features.`
    : "Species/race defines innate traits and movement profile.";
  const speciesImpact = species
    ? `Speed ${species.speed} ft. Traits: ${listToText(species.traits)}.`
    : "Species choice affects traits and stat tendencies.";

  const classBody = characterClass
    ? `${characterClass.name} is your core adventuring role and determines your level progression.`
    : "Class defines combat role, hit points, proficiencies, and core abilities.";
  const subclassBody = subclass
    ? `${subclass.name} is your specialization path inside ${characterClass?.name || "your class"}.`
    : "Subclass is a specialization chosen after early class levels.";
  const subclassImpact = subclass
    ? "Specialization changes features, tactics, and often spell or combat style."
    : "Subclass unlock level depends on class and ruleset.";

  renderExplainerCards(dom.setupExplainers, [
    {
      title: "Alignment",
      body: toSentence(alignmentGuide.meaning),
      impact: toSentence(alignmentGuide.impact)
    },
    {
      title: "Background",
      body: backgroundBody,
      impact: backgroundImpact
    },
    {
      title: "Species / Race",
      body: speciesBody,
      impact: speciesImpact
    },
    {
      title: "Class",
      body: classBody,
      impact: classImpactText(characterClass, ruleset)
    },
    {
      title: "Subclass",
      body: subclassBody,
      impact: subclassImpact
    }
  ]);
}

function renderBuildExplainers() {
  const ruleset = currentRuleset();
  const selectedSkills = (ruleset.skills || []).filter((skill) => (state.selectedSkillIds || []).includes(skill.id));
  const selectedSpells = (ruleset.spells || []).filter((spell) => (state.selectedSpellIds || []).includes(spell.id));
  const spellcasting = derived?.spellcasting;

  const cards = [
    {
      title: "What Skills Are",
      body: "Skills are non-combat capability checks: exploration, social play, and problem solving.",
      impact:
        ruleset.family === "5e"
          ? "Proficient skills add your proficiency bonus to the linked ability modifier."
          : "Marked skills represent trained focus areas and improve your reliability in those checks."
    },
    {
      title: "What Spells Are",
      body: "Spells are magical actions tied to class lists, spell level, and casting resources.",
      impact: spellcasting
        ? `Your current casting setup: ${spellcasting.castingAbility.toUpperCase()} casting, DC ${spellcasting.saveDC}, estimated picks ${spellcasting.spellPickLimit}.`
        : "If your class has no spellcasting, spells are optional flavor references and not core mechanics."
    }
  ];

  for (const skill of selectedSkills.slice(0, 3)) {
    cards.push({
      title: `Skill: ${skill.name}`,
      body: getSkillDescription(skill),
      impact: `Uses ${String(skill.ability || "").toUpperCase()} modifier when rolled.`
    });
  }

  for (const spell of selectedSpells.slice(0, 3)) {
    cards.push({
      title: `Spell: ${spell.name}`,
      body: `${spell.description} (${spell.school}, level ${spell.level})`,
      impact: `Casting time: ${spell.castingTime}. Range: ${spell.range}. Duration: ${spell.duration}.`
    });
  }

  renderExplainerCards(dom.buildExplainers, cards);
}

function renderRulesetSelect() {
  dom.rulesetSelect.innerHTML = RULESETS.map((ruleset) => {
    const selected = ruleset.id === state.rulesetId ? "selected" : "";
    return `<option value=\"${ruleset.id}\" ${selected}>${ruleset.name}</option>`;
  }).join("");
}

function applyRulesetDefaults(ruleset) {
  state.rulesetId = ruleset.id;
  state.level = 1;
  state.alignment = ruleset.alignments[0] || "";
  state.backgroundId = ruleset.backgrounds[0]?.id || "";
  state.speciesId = ruleset.species[0]?.id || "";
  state.classId = ruleset.classes[0]?.id || "";
  state.subclassId = ruleset.classes[0]?.subclasses?.[0]?.id || "";
  state.abilityMethodId = ruleset.abilityMethods[0]?.id || "point-buy";
  state.assignedScores = { ...DEFAULT_ABILITY_SCORES };
  state.selectedSkillIds = [];
  state.skillRanks = {};
  state.selectedFeatIds = [];
  state.selectedSpellIds = [];
  state.selectedItemIds = [];
}

function syncFormToState() {
  const ruleset = currentRuleset();
  dom.experienceMode.value = state.experienceMode;
  dom.characterName.value = state.name;
  dom.playerName.value = state.playerName;
  dom.characterLevel.value = String(state.level);
  dom.alignmentSelect.innerHTML = textOptionHtml(ruleset.alignments, state.alignment);
  dom.backgroundSelect.innerHTML = optionHtml(ruleset.backgrounds, state.backgroundId);
  dom.speciesSelect.innerHTML = optionHtml(ruleset.species, state.speciesId);
  dom.classSelect.innerHTML = optionHtml(ruleset.classes, state.classId);

  const selectedClass = findClassById(ruleset, state.classId);
  const subclasses = selectedClass?.subclasses || [];
  if (!subclasses.some((entry) => entry.id === state.subclassId)) {
    state.subclassId = subclasses[0]?.id || "";
  }
  dom.subclassSelect.innerHTML = optionHtml(subclasses, state.subclassId, true, "None");

  dom.characterNotes.value = state.notes;

  dom.abilityMethodSelect.innerHTML = optionHtml(
    ruleset.abilityMethods.map((method) => ({ id: method.id, name: method.name })),
    state.abilityMethodId
  );

  renderAbilityTable();
  renderChoiceLists();
  renderRulesetHints();
  renderSetupExplainers();
  renderBuildExplainers();
  refreshSavedDraftOptions();
}

function renderRulesetHints() {
  const ruleset = currentRuleset();
  dom.rulesetTip.textContent = ruleset.beginnerTips[0] || "";
  dom.abilityTip.textContent =
    state.experienceMode === "new"
      ? ruleset.beginnerTips[1] || "Use the recommended method and class priorities."
      : "Expert mode enabled: condensed helpers and direct editing.";
  dom.licenseNotice.textContent = ruleset.licenseNotice;

  if (state.experienceMode === "experienced") {
    document.body.classList.add("experienced-mode");
  } else {
    document.body.classList.remove("experienced-mode");
  }
}

function renderAbilityTable() {
  const ruleset = currentRuleset();
  const method = findById(ruleset.abilityMethods, state.abilityMethodId) || ruleset.abilityMethods[0];

  dom.abilityTable.innerHTML = ABILITY_NAMES.map((ability) => {
    const value = Number(state.assignedScores[ability.key] ?? DEFAULT_ABILITY_SCORES[ability.key]);
    const min = method?.min ?? 1;
    const max = method?.max ?? 20;
    return `
      <div class="ability-row">
        <div>
          <strong>${ability.short}</strong>
          <div class="ability-meta">${ability.label}</div>
        </div>
        <input type="number" min="${min}" max="${max}" value="${value}" data-ability-key="${ability.key}" />
        <div>${value >= 10 ? "+" : ""}${Math.floor((value - 10) / 2)}</div>
        <div class="ability-meta">${ability.description}</div>
      </div>
    `;
  }).join("");

  if (method?.id === "point-buy") {
    dom.abilityMethodSummary.textContent = `${method.description} Budget: ${method.budget}, range ${method.min}-${method.max}.`;
  } else if (method?.id === "standard-array") {
    dom.abilityMethodSummary.textContent = `${method.description}`;
  } else {
    dom.abilityMethodSummary.textContent = method?.description || "";
  }

  const pointBuyTotal = calculatePointBuyTotal(state.assignedScores, method);
  if (method?.id === "point-buy") {
    const remaining = method.budget - pointBuyTotal;
    dom.pointBuyPill.textContent = `Point-buy: ${pointBuyTotal}/${method.budget} (${remaining} remaining)`;
  } else {
    dom.pointBuyPill.textContent = `Method: ${method?.name || "Manual"}`;
  }
}

function buildListMarkup(items, selectedIds, buildMeta) {
  const selected = new Set(selectedIds || []);
  if (!items.length) {
    return "<p class='helper'>No options available for this ruleset.</p>";
  }

  return items
    .map((item) => {
      const checked = selected.has(item.id) ? "checked" : "";
      const meta = buildMeta(item);
      return `
        <label class="list-item">
          <input type="checkbox" data-item-id="${item.id}" ${checked} />
          <span class="list-item-content">
            <span class="list-item-title">${item.name}</span>
            <span class="list-item-meta">${meta}</span>
          </span>
        </label>
      `;
    })
    .join("");
}

function renderChoiceLists() {
  const ruleset = currentRuleset();
  const characterClass = findClassById(ruleset, state.classId);
  const skillChoices = Number(characterClass?.skillChoices || 0);
  dom.skillsLimitLabel.textContent = String(skillChoices);

  dom.skillsList.innerHTML = buildListMarkup(ruleset.skills, state.selectedSkillIds, (skill) => {
    const ability = skill.ability ? skill.ability.toUpperCase() : "";
    return `${ability} skill | ${getSkillDescription(skill)}`;
  });

  dom.featsList.innerHTML = buildListMarkup(ruleset.feats, state.selectedFeatIds, (feat) => feat.description || "Feat");

  const spellQuery = dom.spellSearch.value.trim().toLowerCase();
  const filteredSpells = ruleset.spells.filter((spell) => {
    if (!spellQuery) {
      return true;
    }
    const haystack = `${spell.name} ${spell.school} ${spell.classes.join(" ")}`.toLowerCase();
    return haystack.includes(spellQuery);
  });

  dom.spellsList.innerHTML = buildListMarkup(filteredSpells, state.selectedSpellIds, (spell) => {
    return `Lvl ${spell.level} ${spell.school} | ${spell.castingTime} | ${spell.classes.join(", ")}`;
  });

  const itemQuery = dom.itemSearch.value.trim().toLowerCase();
  const filteredItems = ruleset.items.filter((item) => {
    if (!itemQuery) {
      return true;
    }
    const haystack = `${item.name} ${item.category} ${item.properties}`.toLowerCase();
    return haystack.includes(itemQuery);
  });

  dom.itemsList.innerHTML = buildListMarkup(filteredItems, state.selectedItemIds, (item) => {
    return `${item.category} | ${item.cost}`;
  });
}

function renderValidationList() {
  if (!issues.length) {
    dom.validationList.innerHTML = "<p class='helper'>No issues. Build is valid.</p>";
    return;
  }

  dom.validationList.innerHTML = issues
    .map((item) => {
      return `
        <div class="issue ${item.severity}">
          <div class="issue-title">${item.code}</div>
          <div class="issue-message">${item.message}</div>
        </div>
      `;
    })
    .join("");
}

function renderCoveragePanel() {
  if (!dom.coveragePanel) {
    return;
  }

  const report = getCoverageReport(state.rulesetId);
  const card = (label, count, target, pct) => `
    <div class="coverage-card">
      <strong>${label}</strong>
      <span>${count}${target ? ` / ${target}` : ""} (${pct}%)</span>
    </div>
  `;

  dom.coveragePanel.innerHTML = `
    <h4>Content Coverage Snapshot</h4>
    <p class="helper">Pass-2 parity tracking compares current pack size against configured SRD-oriented targets.</p>
    <div class="coverage-grid">
      ${card("Spells", report.counts.spells, report.targets.spells, report.percentages.spells)}
      ${card("Items", report.counts.items, report.targets.items, report.percentages.items)}
      ${card("Feats", report.counts.feats, report.targets.feats, report.percentages.feats)}
      ${card("Classes", report.counts.classes, report.targets.classes, report.percentages.classes)}
      ${card("Species", report.counts.species, report.targets.species, report.percentages.species)}
      ${card("Backgrounds", report.counts.backgrounds, report.targets.backgrounds, report.percentages.backgrounds)}
    </div>
    <p class="helper">Class feature progression coverage: ${report.percentages.classFeatureProgression}% (based on max feature levels currently represented).</p>
  `;
}

function recompute() {
  state.updatedAt = new Date().toISOString();
  derived = deriveCharacterSheet(state, RULESETS);
  issues = validateCharacter(state, RULESETS);

  const blocking = issues.filter((item) => item.severity === "error").length;
  const warnings = issues.filter((item) => item.severity === "warning").length;
  dom.validationPill.textContent = `Validation: ${blocking} errors, ${warnings} warnings`;

  renderSheet(dom.sheetContainer, state, derived, issues);
  renderValidationList();
  renderCoveragePanel();
  renderRulesetHints();
  renderSetupExplainers();
  renderBuildExplainers();
}

function changeStep(step) {
  activeStep = step;
  for (const button of dom.stepButtons) {
    button.classList.toggle("is-active", button.dataset.step === step);
  }
  for (const panel of dom.stepPanels) {
    panel.classList.toggle("hidden", panel.dataset.stepPanel !== step);
  }
}

function updateSelectionList(key, id, checked, limit = null) {
  const next = new Set(state[key] || []);
  if (checked) {
    if (limit != null && next.size >= limit) {
      status(`Selection limit reached (${limit}).`);
      return false;
    }
    next.add(id);
  } else {
    next.delete(id);
  }
  state[key] = Array.from(next);
  return true;
}

function handleCompleteBuild() {
  recompute();
  const blocking = issues.filter((item) => item.severity === "error").length;
  if (blocking > 0) {
    changeStep("review");
    status(`Cannot complete yet. Resolve ${blocking} blocking issue(s).`);
    return;
  }

  status(`Character completed at ${new Date().toLocaleString()}. Print or export from Review.`);
  changeStep("review");
}

function sendCharacterToGameSession() {
  recompute();
  const blocking = issues.filter((item) => item.severity === "error").length;
  if (blocking > 0) {
    changeStep("review");
    status(`Resolve ${blocking} blocking issue(s) before using this character in-game.`);
    return;
  }
  if (!derived) {
    status("No derived character sheet is available yet.");
    return;
  }

  const payload = buildParsableCharacterPayload(state, derived, issues);
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(
      {
        type: "forge-character:use-in-dm",
        payload
      },
      "*"
    );
    status("Sent character to DM app. It will be imported into the game session automatically.");
    return;
  }

  status("Use In Game Session works when this creator is embedded in the DM desktop app.");
}

function registerGameSessionBridge() {
  window.addEventListener("message", (event) => {
    const data = event?.data;
    if (!data || typeof data !== "object") {
      return;
    }
    if (data.type !== "forge-character:use-result") {
      return;
    }
    const message = String(data.message || "DM app responded.");
    status(message);
  });
}

function snapshotDraft() {
  return {
    ...state,
    draftId: state.draftId || (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`),
    savedAt: new Date().toISOString()
  };
}

function refreshSavedDraftOptions() {
  const drafts = getSavedDrafts();
  if (!drafts.length) {
    dom.savedDraftsSelect.innerHTML = "<option value=''>No saved drafts</option>";
    return;
  }

  dom.savedDraftsSelect.innerHTML = drafts
    .map((draft) => {
      const name = draft.name || "Unnamed Character";
      const selected = draft.draftId === state.draftId ? "selected" : "";
      return `<option value=\"${draft.draftId}\" ${selected}>${name} (${draft.rulesetId})</option>`;
    })
    .join("");
}

function loadStateFromDraft(draft) {
  const ruleset = getRulesetById(draft.rulesetId) || RULESETS[0];
  state = {
    ...createInitialState(ruleset),
    ...draft,
    assignedScores: { ...DEFAULT_ABILITY_SCORES, ...(draft.assignedScores || {}) },
    selectedSkillIds: [...(draft.selectedSkillIds || [])],
    skillRanks: { ...(draft.skillRanks || {}) },
    selectedFeatIds: [...(draft.selectedFeatIds || [])],
    selectedSpellIds: [...(draft.selectedSpellIds || [])],
    selectedItemIds: [...(draft.selectedItemIds || [])]
  };
  syncFormToState();
  recompute();
}

function renderChat() {
  dom.chatLog.innerHTML = chatMessages
    .map((entry) => {
      const roleClass = entry.role === "assistant" ? "bot" : entry.role === "system" ? "system" : "user";
      return `<div class="chat-bubble ${roleClass}">${escapeHtml(entry.text)}</div>`;
    })
    .join("");
  dom.chatLog.scrollTop = dom.chatLog.scrollHeight;
}

function appendGuideFallbackReply(message, prefix = "") {
  const ruleset = currentRuleset();
  const reply = buildChatReply(message, { state, ruleset, derived, issues });
  chatMessages.push({
    role: "assistant",
    text: prefix ? `${prefix}\n\n${reply}` : reply
  });
  trimChatMessages();
  renderChat();
}

async function sendChatMessage() {
  const message = dom.chatInput.value.trim();
  if (!message) {
    return;
  }

  chatMessages.push({ role: "user", text: message });
  trimChatMessages();
  dom.chatInput.value = "";
  renderChat();

  setChatBusy(true);
  try {
    await ensureAiCatalog(!aiState.available);

    if (!aiState.available || !aiState.selectedModel) {
      appendGuideFallbackReply(
        message,
        aiState.reason
          ? `AI autofill is offline right now (${aiState.reason}). This turn used guide mode instead.`
          : "AI autofill is offline right now, so this turn used guide mode instead."
      );
      status("AI autofill is unavailable. Guide mode answered instead.");
      return;
    }

    const assistResponse = await requestCharacterAssist({
      messages: normalizeChatHistory(chatMessages),
      currentDraft: createAssistDraft(state, DEFAULT_ABILITY_SCORES),
      activeStep: mapLegacyStepToAiStep(activeStep),
      model: aiState.selectedModel
    });

    state = applyAssistPreviewToState(state, assistResponse.previewDraft, DEFAULT_ABILITY_SCORES);
    syncFormToState();
    recompute();

    chatMessages.push({
      role: "assistant",
      text: buildAssistReplyEnvelope(assistResponse)
    });
    trimChatMessages();
    renderChat();

    if (assistResponse.appliedFields?.length) {
      status(`AI updated ${assistResponse.appliedFields.length} field(s) using ${assistResponse.modelUsed}.`);
    } else {
      status(`AI reviewed the draft with ${assistResponse.modelUsed} and did not change any builder fields.`);
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unexpected AI error.";
    aiState.available = false;
    aiState.reason = reason;
    renderChatStatus();
    appendGuideFallbackReply(message, `AI autofill failed for this turn (${reason}). Guide mode reply:`);
    status("AI autofill failed. Guide mode answered instead.");
  } finally {
    setChatBusy(false);
  }
}

function bindEvents() {
  dom.stepButtons.forEach((button) => {
    button.addEventListener("click", () => changeStep(button.dataset.step));
  });

  dom.rulesetSelect.addEventListener("change", () => {
    const selected = getRulesetById(dom.rulesetSelect.value);
    applyRulesetDefaults(selected);
    syncFormToState();
    recompute();
    status(`Switched to ${selected.shortName}.`);
  });

  dom.experienceMode.addEventListener("change", () => {
    state.experienceMode = dom.experienceMode.value;
    recompute();
    status(`Mode set to ${state.experienceMode}.`);
  });

  dom.characterName.addEventListener("input", () => {
    state.name = dom.characterName.value;
    recompute();
  });
  dom.playerName.addEventListener("input", () => {
    state.playerName = dom.playerName.value;
  });
  dom.characterLevel.addEventListener("input", () => {
    state.level = Number(dom.characterLevel.value || 1);
    recompute();
  });

  dom.alignmentSelect.addEventListener("change", () => {
    state.alignment = dom.alignmentSelect.value;
    recompute();
  });

  dom.backgroundSelect.addEventListener("change", () => {
    state.backgroundId = dom.backgroundSelect.value;
    recompute();
  });

  dom.speciesSelect.addEventListener("change", () => {
    state.speciesId = dom.speciesSelect.value;
    recompute();
  });

  dom.classSelect.addEventListener("change", () => {
    state.classId = dom.classSelect.value;
    const cls = findClassById(currentRuleset(), state.classId);
    state.subclassId = cls?.subclasses?.[0]?.id || "";
    syncFormToState();
    recompute();
  });

  dom.subclassSelect.addEventListener("change", () => {
    state.subclassId = dom.subclassSelect.value;
    recompute();
  });

  dom.characterNotes.addEventListener("input", () => {
    state.notes = dom.characterNotes.value;
  });

  dom.abilityMethodSelect.addEventListener("change", () => {
    state.abilityMethodId = dom.abilityMethodSelect.value;
    renderAbilityTable();
    recompute();
  });

  dom.abilityTable.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const key = target.dataset.abilityKey;
    if (!key) {
      return;
    }
    state.assignedScores[key] = Number(target.value || 0);
    renderAbilityTable();
    recompute();
  });

  dom.applyStandardArrayBtn.addEventListener("click", () => {
    const method = findById(currentRuleset().abilityMethods, "standard-array");
    if (!method?.array) {
      return;
    }
    ABILITY_KEYS.forEach((key, index) => {
      state.assignedScores[key] = method.array[index] ?? DEFAULT_ABILITY_SCORES[key];
    });
    renderAbilityTable();
    recompute();
    status("Applied standard array in STR, DEX, CON, INT, WIS, CHA order.");
  });

  dom.resetAbilitiesBtn.addEventListener("click", () => {
    state.assignedScores = { ...DEFAULT_ABILITY_SCORES };
    renderAbilityTable();
    recompute();
    status("Ability scores reset.");
  });

  dom.skillsList.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const id = target.dataset.itemId;
    if (!id) {
      return;
    }
    const cls = findClassById(currentRuleset(), state.classId);
    const limit = Number(cls?.skillChoices || 0);
    const changed = updateSelectionList("selectedSkillIds", id, target.checked, limit || 0);
    if (!changed) {
      target.checked = false;
    }
    recompute();
  });

  dom.featsList.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const id = target.dataset.itemId;
    if (!id) {
      return;
    }
    updateSelectionList("selectedFeatIds", id, target.checked);
    recompute();
  });

  dom.spellsList.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const id = target.dataset.itemId;
    if (!id) {
      return;
    }
    updateSelectionList("selectedSpellIds", id, target.checked);
    recompute();
  });

  dom.itemsList.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const id = target.dataset.itemId;
    if (!id) {
      return;
    }
    updateSelectionList("selectedItemIds", id, target.checked);
    recompute();
  });

  dom.spellSearch.addEventListener("input", () => {
    renderChoiceLists();
  });
  dom.itemSearch.addEventListener("input", () => {
    renderChoiceLists();
  });

  dom.validateBtn.addEventListener("click", () => {
    recompute();
    status("Validation complete.");
  });

  dom.saveDraftBtn.addEventListener("click", () => {
    const draft = snapshotDraft();
    state.draftId = draft.draftId;
    saveDraft(draft);
    refreshSavedDraftOptions();
    status("Draft saved locally.");
  });

  dom.loadDraftBtn.addEventListener("click", () => {
    const id = dom.savedDraftsSelect.value;
    if (!id) {
      status("Select a saved draft first.");
      return;
    }
    const draft = getSavedDrafts().find((entry) => entry.draftId === id);
    if (!draft) {
      status("Draft not found.");
      return;
    }
    loadStateFromDraft(draft);
    status("Draft loaded.");
  });

  dom.deleteDraftBtn.addEventListener("click", () => {
    const id = dom.savedDraftsSelect.value;
    if (!id) {
      status("Select a saved draft first.");
      return;
    }
    deleteDraftById(id);
    if (state.draftId === id) {
      state.draftId = "";
    }
    refreshSavedDraftOptions();
    status("Draft deleted.");
  });

  dom.newCharacterBtn.addEventListener("click", () => {
    const ruleset = currentRuleset();
    const mode = state.experienceMode;
    state = createInitialState(ruleset);
    state.experienceMode = mode;
    syncFormToState();
    recompute();
    status("Started a new character in current ruleset.");
  });

  dom.exportJsonBtn.addEventListener("click", () => {
    const draft = snapshotDraft();
    exportDraftToFile(draft);
    status("Draft exported to JSON.");
  });

  dom.exportPdfBtn.addEventListener("click", () => {
    recompute();
    if (!derived) {
      status("No character data available for PDF export.");
      return;
    }

    const lines = buildParsableCharacterLines(state, derived, issues);
    const pdfBytes = buildSimplePdf(lines, {
      title: `Forge Character - ${state.name || "Unnamed"}`
    });
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${slugify(state.name)}-${state.rulesetId}-parsable.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
    status("Parsable PDF exported with machine-readable markers and embedded JSON section.");
  });

  dom.importJsonInput.addEventListener("change", async () => {
    const file = dom.importJsonInput.files?.[0];
    if (!file) {
      return;
    }
    try {
      const imported = await importDraftFromFile(file);
      loadStateFromDraft(imported);
      status("Imported draft from JSON.");
    } catch {
      status("Import failed: invalid JSON format.");
    } finally {
      dom.importJsonInput.value = "";
    }
  });

  dom.completeBuildBtn.addEventListener("click", handleCompleteBuild);
  dom.useInGameBtn.addEventListener("click", sendCharacterToGameSession);
  dom.randomizeCharacterBtn.addEventListener("click", randomizeCharacter);
  dom.printSheetBtn.addEventListener("click", () => {
    window.print();
  });

  dom.chatModelSelect.addEventListener("change", () => {
    aiState.selectedModel = dom.chatModelSelect.value;
    renderChatStatus();
  });

  dom.chatSendBtn.addEventListener("click", () => {
    void sendChatMessage();
  });
  dom.chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void sendChatMessage();
    }
  });
}

function init() {
  renderRulesetSelect();
  syncFormToState();
  registerGameSessionBridge();
  bindEvents();
  recompute();
  renderChat();
  renderChatStatus();
  changeStep(activeStep);
  status("Ready. Configure your ruleset and start building.");
  void ensureAiCatalog();
}

init();
