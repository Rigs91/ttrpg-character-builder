import {
  RULESETS,
  characterIntentSchema,
  deriveCharacter,
  findById,
  findClassById,
  normalizeLookupValue,
  synthesizeCharacterAssist,
  type AiModelCatalogResponse,
  type CharacterAssistRequest,
  type CharacterAssistResponse,
  type CharacterIntent,
  type CharacterDraft
} from "@forge/rules-core";

import { AiServiceError } from "./errors.js";
import { OllamaClient, type OllamaModelTag } from "./ollamaClient.js";

const PREFERRED_MODEL = "qwen2.5:7b-instruct";

export interface CharacterAiService {
  getModelCatalog(): Promise<AiModelCatalogResponse>;
  assist(request: CharacterAssistRequest): Promise<CharacterAssistResponse>;
}

function buildDraftSummary(draft: CharacterDraft) {
  const ruleset = RULESETS.find((entry) => entry.id === draft.rulesetId) ?? RULESETS[0];
  const characterClass = findClassById(ruleset, draft.classId);
  const subclass = findById(characterClass?.subclasses, draft.subclassId);
  const derived = deriveCharacter(draft);

  return JSON.stringify(
    {
      ruleset: ruleset.shortName,
      experienceMode: draft.experienceMode,
      name: draft.name,
      playerName: draft.playerName,
      level: draft.level,
      alignment: draft.alignment,
      background: findById(ruleset.backgrounds, draft.backgroundId)?.name ?? null,
      species: findById(ruleset.species, draft.speciesId)?.name ?? null,
      class: characterClass?.name ?? null,
      subclass: subclass?.name ?? null,
      abilityMethod: ruleset.abilityMethods.find((entry) => entry.id === draft.abilityMethodId)?.name ?? draft.abilityMethodId,
      assignedScores: draft.assignedScores,
      selectedSkills: draft.selectedSkillIds.map((skillId) => findById(ruleset.skills, skillId)?.name ?? skillId),
      skillRanks: Object.fromEntries(
        Object.entries(draft.skillRanks).map(([skillId, rank]) => [findById(ruleset.skills, skillId)?.name ?? skillId, rank])
      ),
      selectedFeats: draft.selectedFeatIds.map((featId) => findById(ruleset.feats, featId)?.name ?? featId),
      selectedSpells: draft.selectedSpellIds.map((spellId) => findById(ruleset.spells, spellId)?.name ?? spellId),
      selectedItems: draft.selectedItemIds.map((itemId) => findById(ruleset.items, itemId)?.name ?? itemId),
      notes: draft.notes,
      validationHints: derived?.validationHints ?? []
    },
    null,
    2
  );
}

function normalizeAbilityAliases(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  const aliases: Record<string, string> = {
    strength: "str",
    dexterity: "dex",
    constitution: "con",
    intelligence: "int",
    wisdom: "wis",
    charisma: "cha"
  };
  const normalized: Record<string, unknown> = {};
  for (const [key, entryValue] of Object.entries(value as Record<string, unknown>)) {
    const nextKey = aliases[key] ?? key;
    normalized[nextKey] = entryValue;
  }
  return normalized;
}

function normalizeIntentPayload(value: unknown): unknown {
  if (value == null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value
      .map((entry) => normalizeIntentPayload(entry))
      .filter((entry) => entry != null && entry !== "");
  }
  if (typeof value !== "object") {
    return value;
  }

  const aliases: Record<string, string> = {
    class: "characterClass",
    race: "species",
    speciesOrRace: "species",
    character_name: "name",
    player_name: "playerName",
    backgroundId: "background",
    speciesId: "species",
    classId: "characterClass",
    subclassId: "subclass",
    abilityScores: "abilities",
    selectedSkillIds: "skills",
    selectedFeatIds: "feats",
    selectedSpellIds: "spells",
    selectedItemIds: "items"
  };

  const normalized: Record<string, unknown> = {};
  for (const [key, entryValue] of Object.entries(value as Record<string, unknown>)) {
    const nextValue = normalizeIntentPayload(entryValue);
    if (nextValue == null || nextValue === "") {
      continue;
    }
    const nextKey = aliases[key] ?? key;
    normalized[nextKey] = nextKey === "abilities" ? normalizeAbilityAliases(nextValue) : nextValue;
  }

  return normalized;
}

function buildUserTranscript(messages: CharacterAssistRequest["messages"]) {
  return messages
    .filter((message) => message.role === "user")
    .map((message) => message.content.trim())
    .filter(Boolean)
    .join("\n");
}

function transcriptIncludesCatalogValue(transcript: string, values: string[]) {
  const normalizedTranscript = normalizeLookupValue(transcript);
  return values.some((value) => {
    const normalizedValue = normalizeLookupValue(value);
    return normalizedValue.length >= 3 && normalizedTranscript.includes(normalizedValue);
  });
}

function stripUngroundedIntentFields(intent: CharacterIntent, request: CharacterAssistRequest) {
  const transcript = buildUserTranscript(request.messages);
  if (!transcript) {
    return intent;
  }

  const rawTranscript = transcript.toLowerCase();
  const currentRuleset = RULESETS.find((entry) => entry.id === request.currentDraft.rulesetId) ?? RULESETS[0];
  const subclassNames = currentRuleset.classes.flatMap((entry) => entry.subclasses.map((subclass) => subclass.name));

  const rulesetExplicit = /\b(edition|ruleset|5e|2024|2014|3\.5|3\.5e|fifth edition|third edition)\b/i.test(rawTranscript)
    || transcriptIncludesCatalogValue(transcript, RULESETS.flatMap((entry) => [entry.id, entry.name, entry.shortName]));
  const experienceExplicit = /\b(beginner|new player|newbie|experienced|veteran|expert|guided)\b/i.test(rawTranscript);
  const alignmentExplicit = /\b(lawful|chaotic|neutral|good|evil)\b/i.test(rawTranscript);
  const backgroundExplicit = /\bbackground\b/i.test(rawTranscript)
    || transcriptIncludesCatalogValue(transcript, currentRuleset.backgrounds.map((entry) => entry.name));
  const subclassExplicit = /\b(subclass|domain|oath|college|circle|patron|bloodline|school|archetype|path|tradition|origin)\b/i.test(rawTranscript)
    || transcriptIncludesCatalogValue(transcript, subclassNames);
  const abilityMethodExplicit = /\b(point buy|standard array|rolled|roll(ed)?|manual)\b/i.test(rawTranscript);
  const abilitiesExplicit = /(?:\bstr(?:ength)?\b|\bdex(?:terity)?\b|\bcon(?:stitution)?\b|\bint(?:elligence)?\b|\bwis(?:dom)?\b|\bcha(?:risma)?\b)[^.\n\r]{0,12}\b\d{1,2}\b/i.test(rawTranscript)
    || /\b\d{1,2}\b[^.\n\r]{0,12}(?:\bstr(?:ength)?\b|\bdex(?:terity)?\b|\bcon(?:stitution)?\b|\bint(?:elligence)?\b|\bwis(?:dom)?\b|\bcha(?:risma)?\b)/i.test(rawTranscript);
  const skillsExplicit = /\b(skill|skills|proficiency|proficiencies)\b/i.test(rawTranscript)
    || transcriptIncludesCatalogValue(transcript, currentRuleset.skills.map((entry) => entry.name));
  const featsExplicit = /\b(feat|feats)\b/i.test(rawTranscript)
    || transcriptIncludesCatalogValue(transcript, currentRuleset.feats.map((entry) => entry.name));
  const spellsExplicit = /\b(spell|spells|cantrip|cantrips)\b/i.test(rawTranscript)
    || transcriptIncludesCatalogValue(transcript, currentRuleset.spells.map((entry) => entry.name));
  const itemsExplicit = /\b(item|items|gear|equipment|loadout|weapon|armor|shield)\b/i.test(rawTranscript)
    || transcriptIncludesCatalogValue(transcript, currentRuleset.items.map((entry) => entry.name));

  const groundedIntent = { ...intent };
  if (!rulesetExplicit) {
    delete groundedIntent.ruleset;
    delete groundedIntent.edition;
  }
  if (!experienceExplicit) {
    delete groundedIntent.experienceMode;
  }
  if (!alignmentExplicit) {
    delete groundedIntent.alignment;
  }
  if (!backgroundExplicit) {
    delete groundedIntent.background;
  }
  if (!subclassExplicit) {
    delete groundedIntent.subclass;
  }
  if (!abilityMethodExplicit) {
    delete groundedIntent.abilityMethod;
  }
  if (!abilitiesExplicit) {
    delete groundedIntent.abilities;
  }
  if (!skillsExplicit) {
    delete groundedIntent.skills;
    delete groundedIntent.skillRanks;
  }
  if (!featsExplicit) {
    delete groundedIntent.feats;
  }
  if (!spellsExplicit) {
    delete groundedIntent.spells;
  }
  if (!itemsExplicit) {
    delete groundedIntent.items;
  }

  return groundedIntent;
}

function buildRulesCatalogSummary(currentRulesetId: string) {
  const currentRuleset = RULESETS.find((entry) => entry.id === currentRulesetId) ?? RULESETS[0];
  const alternateRulesets = RULESETS
    .filter((entry) => entry.id !== currentRuleset.id)
    .map((entry) => `${entry.shortName} [${entry.id}]`)
    .join(", ");

  return [
    `Current ruleset: ${currentRuleset.shortName} [${currentRuleset.id}]`,
    `Classes: ${currentRuleset.classes.map((entry) => entry.name).join(", ")}`,
    `Species: ${currentRuleset.species.map((entry) => entry.name).join(", ")}`,
    `Backgrounds: ${currentRuleset.backgrounds.map((entry) => entry.name).join(", ")}`,
    `Alignments: ${currentRuleset.alignments.join(", ")}`,
    `Ability methods: ${currentRuleset.abilityMethods.map((entry) => entry.name).join(", ")}`,
    `Skills: ${currentRuleset.skills.map((entry) => entry.name).join(", ")}`,
    `Feats: ${currentRuleset.feats.map((entry) => entry.name).join(", ")}`,
    `Items: ${currentRuleset.items.map((entry) => entry.name).join(", ")}`,
    `Spells: ${currentRuleset.spells.map((entry) => entry.name).join(", ")}`,
    `Other rulesets available only if the user explicitly asks to switch editions: ${alternateRulesets}`
  ].join("\n");
}

function buildConversationPrompt(request: CharacterAssistRequest) {
  const transcript = request.messages.slice(-8).map((message) => `${message.role.toUpperCase()}: ${message.content}`).join("\n");
  const activeStep = request.activeStep ?? "review";

  return [
    "You convert D&D character-builder chat into structured JSON.",
    "Return JSON only with this exact shape and no markdown:",
    "{",
    '  "edition"?: string,',
    '  "ruleset"?: string,',
    '  "experienceMode"?: string,',
    '  "name"?: string,',
    '  "playerName"?: string,',
    '  "level"?: number,',
    '  "alignment"?: string,',
    '  "background"?: string,',
    '  "species"?: string,',
    '  "characterClass"?: string,',
    '  "subclass"?: string,',
    '  "notes"?: string,',
    '  "abilityMethod"?: string,',
    '  "abilities"?: { "str"?: number, "dex"?: number, "con"?: number, "int"?: number, "wis"?: number, "cha"?: number },',
    '  "skills"?: string[],',
    '  "skillRanks"?: { "<skill name>": number },',
    '  "feats"?: string[],',
    '  "spells"?: string[],',
    '  "items"?: string[],',
    '  "questions"?: string[],',
    '  "rationale"?: string',
    "}",
    "Rules:",
    "- Stay on the current ruleset unless the user explicitly asks to switch editions.",
    "- Use display names from the rules catalogs, never ids.",
    "- Omit any field you cannot infer reliably.",
    "- Do not invent backgrounds, subclasses, feats, spells, items, or exact ability scores unless the user clearly asks for them or the prior conversation already established them.",
    "- Only include spells, items, feats, or skills arrays when the user clearly wants to set or replace those lists.",
    "- Use skillRanks only for 3.5e-style rank allocations.",
    "- If the user says a name explicitly, copy that name into the name field exactly.",
    "- Keep rationale short and factual.",
    `Focus on the current active step: ${activeStep}.`,
    "Current draft:",
    buildDraftSummary(request.currentDraft),
    "Rules catalogs:",
    buildRulesCatalogSummary(request.currentDraft.rulesetId),
    "Conversation:",
    transcript
  ].join("\n");
}

function mapModelTag(tag: OllamaModelTag) {
  return {
    name: tag.name,
    sizeBytes: tag.size,
    family: tag.details?.family,
    modifiedAt: tag.modified_at
  };
}

function isCompatibleModel(tag: OllamaModelTag) {
  const normalized = tag.name.toLowerCase();
  return !normalized.includes("vision") && !normalized.includes("-vl") && !normalized.includes("embed");
}

export function pickDefaultModel(tags: OllamaModelTag[]) {
  if (tags.some((tag) => tag.name === PREFERRED_MODEL)) {
    return PREFERRED_MODEL;
  }

  const compatible = tags.filter(isCompatibleModel);
  const instruct = compatible.find((tag) => tag.name.toLowerCase().includes("instruct") && !tag.name.toLowerCase().startsWith("qwen3:"));
  if (instruct) {
    return instruct.name;
  }

  const nonQwenThree = compatible.find((tag) => !tag.name.toLowerCase().startsWith("qwen3:"));
  return nonQwenThree?.name ?? compatible[0]?.name ?? null;
}

export class OllamaCharacterAiService implements CharacterAiService {
  constructor(private readonly client: OllamaClient) {}

  async getModelCatalog(): Promise<AiModelCatalogResponse> {
    try {
      const tags = await this.client.listModels();
      if (tags.length === 0) {
        return {
          available: false,
          defaultModel: null,
          models: [],
          reason: "Ollama responded, but no models are installed."
        };
      }

      return {
        available: true,
        defaultModel: pickDefaultModel(tags),
        models: tags.filter(isCompatibleModel).map(mapModelTag)
      };
    } catch (error) {
      return {
        available: false,
        defaultModel: null,
        models: [],
        reason: error instanceof Error ? error.message : "Ollama is unavailable."
      };
    }
  }

  async assist(request: CharacterAssistRequest): Promise<CharacterAssistResponse> {
    const catalog = await this.getModelCatalog();
    if (!catalog.available) {
      throw new AiServiceError("ai.unavailable", catalog.reason || "Ollama is unavailable.", 503);
    }

    const modelUsed = request.model ?? catalog.defaultModel;
    if (!modelUsed) {
      throw new AiServiceError("ai.no_model_available", "No compatible Ollama model is available.", 503);
    }
    if (request.model && !catalog.models.some((model) => model.name === request.model)) {
      throw new AiServiceError("ai.unsupported_model", `Model "${request.model}" is not available for character assist.`, 400);
    }

    const prompt = buildConversationPrompt(request);
    const generated = await this.client.generateJson(modelUsed, prompt);
    const responseText = generated.response?.trim();

    if (!responseText) {
      throw new AiServiceError(
        "ai.empty_response",
        generated.thinking?.trim()
          ? "The selected model returned a thinking trace without a final JSON response."
          : "The selected model returned an empty response.",
        502
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      throw new AiServiceError("ai.invalid_json", "The selected model did not return valid JSON.", 502);
    }

    const intentResult = characterIntentSchema.safeParse(normalizeIntentPayload(parsed));
    if (!intentResult.success) {
      throw new AiServiceError("ai.invalid_intent_shape", "The selected model returned JSON that does not match the intent schema.", 502);
    }

    const groundedIntent = stripUngroundedIntentFields(intentResult.data, request);
    const synthesis = synthesizeCharacterAssist({
      currentDraft: request.currentDraft,
      intent: groundedIntent,
      activeStep: request.activeStep
    });

    return {
      ...synthesis,
      modelUsed
    };
  }
}

export function createCharacterAiService(baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434") {
  return new OllamaCharacterAiService(new OllamaClient(baseUrl));
}
