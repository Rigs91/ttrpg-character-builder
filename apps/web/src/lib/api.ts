import type {
  AiModelCatalogResponse,
  CharacterAssistRequest,
  CharacterAssistResponse,
  CharacterDraft,
  CharacterIssue,
  DerivedCharacter,
  RulesPreviewResult
} from "@forge/rules-core";

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || "http://localhost:8787";

export interface IssueSummary {
  total: number;
  errors: number;
  warnings: number;
  info: number;
}

export interface ApiCharacter {
  id: string;
  name: string;
  rulesetId: string;
  experienceMode: "new" | "experienced";
  notes: string | null;
  issueSummary: IssueSummary;
  latestRevision: { id: string; revisionNumber: number; updatedAt: string };
  revisions?: Array<{ id: string; revisionNumber: number; reason: string | null; updatedAt: string; issueSummary: IssueSummary }>;
  updatedAt: string;
}

export interface ApiCharacterResponse {
  character: ApiCharacter;
}

export interface ApiSessionImport {
  id: string;
  characterId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  submittedByName: string | null;
  note: string | null;
  character: { id: string; name: string; rulesetId: string; updatedAt: string };
}

export interface ApiSessionSeat {
  id: string;
  displayName: string;
  role: "DM" | "PLAYER" | "OBSERVER";
}

export interface ApiSession {
  id: string;
  title: string;
  rulesetId: string;
  joinCode: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  seats: ApiSessionSeat[];
  imports: ApiSessionImport[];
  updatedAt: string;
}

export interface ApiSessionResponse {
  session: ApiSession;
  sessionImport?: ApiSessionImport;
}

export interface ApiCharacterListResponse {
  characters: ApiCharacter[];
}

export interface RulesPreviewResponse {
  preview: RulesPreviewResult;
}

interface SnapshotPayload {
  state: CharacterDraft;
  derived: DerivedCharacter | null;
  issues: CharacterIssue[];
}

function readApiError(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "error" in payload) {
    const error = (payload as { error?: { message?: unknown; code?: unknown } }).error;
    if (typeof error?.message === "string") {
      return typeof error.code === "string" ? `${error.message} (${error.code})` : error.message;
    }
  }
  if (payload && typeof payload === "object" && "message" in payload && typeof (payload as { message?: unknown }).message === "string") {
    return (payload as { message: string }).message;
  }
  return fallback;
}

async function fetchJson<T>(path: string, init?: RequestInit) {
  const headers: Record<string, string> = {
    ...((init?.headers as Record<string, string> | undefined) || {})
  };
  if (init?.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    const text = await response.text();
    let payload: unknown = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = null;
    }
    throw new Error(readApiError(payload, text || `Request failed: ${response.status}`));
  }

  return (await response.json()) as T;
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== "") {
      query.set(key, String(value));
    }
  }
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export function buildSnapshotPayload(state: CharacterDraft, derived: DerivedCharacter | null, issues: CharacterIssue[]): SnapshotPayload {
  return { state, derived, issues };
}

export function createCharacter(payload: {
  ownerName: string;
  ownerEmail?: string;
  contentPackVersion?: string;
  state: CharacterDraft;
  derived: DerivedCharacter | null;
  issues: CharacterIssue[];
}) {
  return fetchJson<ApiCharacterResponse>("/api/characters", {
    method: "POST",
    body: JSON.stringify({
      owner: payload.ownerName ? { name: payload.ownerName, email: payload.ownerEmail || undefined } : undefined,
      contentPack: payload.contentPackVersion
        ? { rulesetId: payload.state.rulesetId, version: payload.contentPackVersion, label: payload.contentPackVersion }
        : undefined,
      character: {
        name: payload.state.name,
        rulesetId: payload.state.rulesetId,
        experienceMode: payload.state.experienceMode,
        notes: payload.state.notes,
        snapshot: buildSnapshotPayload(payload.state, payload.derived, payload.issues)
      }
    })
  });
}

export function createCharacterRevision(characterId: string, payload: {
  reason?: string;
  state: CharacterDraft;
  derived: DerivedCharacter | null;
  issues: CharacterIssue[];
}) {
  return fetchJson<ApiCharacterResponse>(`/api/characters/${characterId}/revisions`, {
    method: "POST",
    body: JSON.stringify({
      reason: payload.reason,
      snapshot: buildSnapshotPayload(payload.state, payload.derived, payload.issues)
    })
  });
}

export function listCharacters(params: { search?: string; rulesetId?: string; limit?: number } = {}) {
  return fetchJson<ApiCharacterListResponse>(`/api/characters${buildQuery(params)}`);
}

export function restoreCharacterRevision(characterId: string, revisionId: string) {
  return fetchJson<ApiCharacterResponse>(`/api/characters/${characterId}/revisions/${revisionId}/restore`, {
    method: "POST"
  });
}

export function requestRulesPreview(draft: CharacterDraft) {
  return fetchJson<RulesPreviewResponse>("/api/rules/preview", {
    method: "POST",
    body: JSON.stringify({ draft })
  });
}

export function createSession(payload: {
  ownerName: string;
  ownerEmail?: string;
  title: string;
  rulesetId: string;
}) {
  return fetchJson<ApiSessionResponse>("/api/sessions", {
    method: "POST",
    body: JSON.stringify({
      owner: payload.ownerName ? { name: payload.ownerName, email: payload.ownerEmail || undefined } : undefined,
      title: payload.title,
      rulesetId: payload.rulesetId,
      seats: [{ displayName: payload.ownerName || "DM", role: "DM" }]
    })
  });
}

export function getSession(sessionId: string) {
  return fetchJson<ApiSessionResponse>(`/api/sessions/${sessionId}`);
}

export function getSessionByJoinCode(joinCode: string) {
  return fetchJson<ApiSessionResponse>(`/api/sessions/join/${encodeURIComponent(joinCode)}`);
}

export function publishCharacterToSession(sessionId: string, payload: { characterId: string; submittedByName: string; submittedByEmail?: string; note?: string }) {
  return fetchJson<ApiSessionResponse>(`/api/sessions/${sessionId}/imports`, {
    method: "POST",
    body: JSON.stringify({
      characterId: payload.characterId,
      submittedBy: payload.submittedByName ? { name: payload.submittedByName, email: payload.submittedByEmail || undefined } : undefined,
      note: payload.note
    })
  });
}

export function reviewSessionImport(sessionId: string, importId: string, status: "ACCEPTED" | "REJECTED") {
  return fetchJson<ApiSessionResponse>(`/api/sessions/${sessionId}/imports/${importId}`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}

export function addSessionSeat(sessionId: string, payload: { displayName: string; role: "DM" | "PLAYER" | "OBSERVER"; ownerName?: string; ownerEmail?: string }) {
  return fetchJson<ApiSessionResponse>(`/api/sessions/${sessionId}/seats`, {
    method: "POST",
    body: JSON.stringify({
      displayName: payload.displayName,
      role: payload.role,
      user: payload.ownerName ? { name: payload.ownerName, email: payload.ownerEmail || undefined } : undefined
    })
  });
}

export function buildSessionSocketUrl(sessionId: string) {
  const url = new URL(`/ws/sessions/${sessionId}`, API_BASE_URL);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}

export function getAiModels(refresh = false) {
  return fetchJson<AiModelCatalogResponse>(`/api/ai/models${refresh ? "?refresh=true" : ""}`);
}

export function requestCharacterAssist(payload: CharacterAssistRequest) {
  return fetchJson<CharacterAssistResponse>("/api/ai/character-assist", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
