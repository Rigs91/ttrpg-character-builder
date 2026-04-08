import type {
  AiModelCatalogResponse,
  CharacterAssistRequest,
  CharacterAssistResponse,
  CharacterDraft,
  CharacterIssue,
  DerivedCharacter
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

interface SnapshotPayload {
  state: CharacterDraft;
  derived: DerivedCharacter | null;
  issues: CharacterIssue[];
}

async function fetchJson<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
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

export function buildSessionSocketUrl(sessionId: string) {
  const url = new URL(`/ws/sessions/${sessionId}`, API_BASE_URL);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}

export function getAiModels() {
  return fetchJson<AiModelCatalogResponse>("/api/ai/models");
}

export function requestCharacterAssist(payload: CharacterAssistRequest) {
  return fetchJson<CharacterAssistResponse>("/api/ai/character-assist", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
