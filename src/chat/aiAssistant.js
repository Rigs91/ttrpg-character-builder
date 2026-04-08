const DEFAULT_API_BASE_URL = "http://localhost:8787";
const MAX_HISTORY_MESSAGES = 10;

function toArray(value) {
  return Array.isArray(value) ? [...value] : [];
}

function toRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return { ...value };
}

function normalizeLevel(value) {
  const level = Number(value);
  if (!Number.isFinite(level)) {
    return 1;
  }
  return Math.min(20, Math.max(1, Math.round(level)));
}

function countIssues(issues, severity) {
  return (issues || []).filter((issue) => issue.severity === severity).length;
}

async function parseJsonResponse(response) {
  const rawText = await response.text();
  if (!rawText) {
    return null;
  }
  try {
    return JSON.parse(rawText);
  } catch {
    throw new Error(`Expected JSON response from ${response.url || "AI endpoint"}.`);
  }
}

export function createAssistDraft(state, abilityDefaults) {
  const timestamp = new Date().toISOString();
  return {
    draftId: state.draftId || undefined,
    rulesetId: String(state.rulesetId || ""),
    experienceMode: state.experienceMode === "experienced" ? "experienced" : "new",
    name: String(state.name || ""),
    playerName: String(state.playerName || ""),
    level: normalizeLevel(state.level),
    alignment: String(state.alignment || ""),
    backgroundId: String(state.backgroundId || ""),
    speciesId: String(state.speciesId || ""),
    classId: String(state.classId || ""),
    subclassId: String(state.subclassId || ""),
    notes: String(state.notes || ""),
    abilityMethodId: String(state.abilityMethodId || "point-buy"),
    assignedScores: {
      ...abilityDefaults,
      ...toRecord(state.assignedScores)
    },
    selectedSkillIds: toArray(state.selectedSkillIds),
    skillRanks: toRecord(state.skillRanks),
    selectedFeatIds: toArray(state.selectedFeatIds),
    selectedSpellIds: toArray(state.selectedSpellIds),
    selectedItemIds: toArray(state.selectedItemIds),
    createdAt: state.createdAt || timestamp,
    updatedAt: state.updatedAt || timestamp,
    savedAt: state.savedAt || undefined
  };
}

export function applyAssistPreviewToState(currentState, previewDraft, abilityDefaults) {
  return {
    ...currentState,
    ...previewDraft,
    experienceMode: previewDraft?.experienceMode === "experienced" ? "experienced" : "new",
    level: normalizeLevel(previewDraft?.level ?? currentState.level),
    assignedScores: {
      ...abilityDefaults,
      ...toRecord(previewDraft?.assignedScores ?? currentState.assignedScores)
    },
    selectedSkillIds: toArray(previewDraft?.selectedSkillIds ?? currentState.selectedSkillIds),
    skillRanks: toRecord(previewDraft?.skillRanks ?? currentState.skillRanks),
    selectedFeatIds: toArray(previewDraft?.selectedFeatIds ?? currentState.selectedFeatIds),
    selectedSpellIds: toArray(previewDraft?.selectedSpellIds ?? currentState.selectedSpellIds),
    selectedItemIds: toArray(previewDraft?.selectedItemIds ?? currentState.selectedItemIds)
  };
}

export function normalizeChatHistory(chatMessages) {
  return (chatMessages || [])
    .filter((entry) => entry && (entry.role === "user" || entry.role === "assistant") && String(entry.text || "").trim())
    .slice(-MAX_HISTORY_MESSAGES)
    .map((entry) => ({
      role: entry.role === "assistant" ? "assistant" : "user",
      content: String(entry.text).trim()
    }));
}

export function mapLegacyStepToAiStep(activeStep) {
  if (activeStep === "abilities") {
    return "abilities";
  }
  if (activeStep === "review") {
    return "review";
  }
  return undefined;
}

export function buildAssistReplyEnvelope(response) {
  const appliedSummaries = (response?.appliedFields || []).map((field) => field.summary).filter(Boolean);
  const unresolvedPrompts = (response?.unresolvedQuestions || []).map((entry) => entry.prompt).filter(Boolean);
  const errors = countIssues(response?.issues, "error");
  const warnings = countIssues(response?.issues, "warning");

  const sections = [];
  if (response?.assistantMessage) {
    sections.push(String(response.assistantMessage).trim());
  }
  if (appliedSummaries.length) {
    sections.push(`Applied: ${appliedSummaries.join("; ")}.`);
  } else {
    sections.push("Applied: no builder fields changed on this turn.");
  }
  if (unresolvedPrompts.length) {
    sections.push(`Still needed: ${unresolvedPrompts.join(" ")}`);
  }
  sections.push(`Validation now shows ${errors} error(s) and ${warnings} warning(s).`);

  return sections.join("\n\n");
}

export async function fetchAiModelCatalog(apiBaseUrl = DEFAULT_API_BASE_URL) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/ai/models`, {
      headers: {
        Accept: "application/json"
      },
      cache: "no-store"
    });
    const payload = await parseJsonResponse(response);
    if (!response.ok) {
      throw new Error(payload?.message || `Model catalog request failed with ${response.status}.`);
    }
    return {
      available: Boolean(payload?.available),
      defaultModel: payload?.defaultModel || null,
      models: Array.isArray(payload?.models) ? payload.models : [],
      reason: payload?.reason || ""
    };
  } catch (error) {
    return {
      available: false,
      defaultModel: null,
      models: [],
      reason: error instanceof Error ? error.message : "Unable to reach the AI model catalog."
    };
  }
}

export async function requestCharacterAssist({
  apiBaseUrl = DEFAULT_API_BASE_URL,
  messages,
  currentDraft,
  activeStep,
  model
}) {
  const response = await fetch(`${apiBaseUrl}/api/ai/character-assist`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    cache: "no-store",
    body: JSON.stringify({
      messages,
      currentDraft,
      ...(activeStep ? { activeStep } : {}),
      ...(model ? { model } : {})
    })
  });

  const payload = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(payload?.message || `Character assist request failed with ${response.status}.`);
  }
  return payload;
}
