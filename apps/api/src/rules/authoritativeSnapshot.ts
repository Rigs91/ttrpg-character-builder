import {
  buildRulesPreview,
  normalizeDraft,
  type CharacterDraft,
  type CharacterIssue,
  type DerivedCharacter
} from "@forge/rules-core";

import type { CharacterCreateInput, CharacterRevisionCreateInput, CharacterSnapshotInput } from "../contracts.js";

type SnapshotDefaults = {
  name?: string;
  rulesetId?: string;
  experienceMode?: CharacterDraft["experienceMode"];
  notes?: string | null;
};

export interface AuthoritativeSnapshot {
  state: CharacterDraft;
  derived: DerivedCharacter | null;
  issues: CharacterIssue[];
}

function rawState(snapshot: CharacterSnapshotInput): Partial<CharacterDraft> {
  if (snapshot.state && typeof snapshot.state === "object" && !Array.isArray(snapshot.state)) {
    return snapshot.state as Partial<CharacterDraft>;
  }
  return {};
}

export function buildAuthoritativeSnapshot(
  snapshot: CharacterSnapshotInput,
  defaults: SnapshotDefaults = {}
): AuthoritativeSnapshot {
  const state = rawState(snapshot);
  const draft = normalizeDraft({
    ...state,
    rulesetId: state.rulesetId ?? defaults.rulesetId,
    experienceMode: state.experienceMode ?? defaults.experienceMode ?? "new",
    name: state.name ?? defaults.name ?? "",
    notes: state.notes ?? defaults.notes ?? ""
  });
  const preview = buildRulesPreview(draft);
  return {
    state: preview.draft,
    derived: preview.derived,
    issues: preview.issues.map(({ stepId: _stepId, blocking: _blocking, actionLabel: _actionLabel, ...issue }) => issue)
  };
}

export function withAuthoritativeCreateSnapshot(character: CharacterCreateInput["character"]): CharacterCreateInput["character"] {
  const snapshot = buildAuthoritativeSnapshot(character.snapshot, {
    name: character.name,
    rulesetId: character.rulesetId,
    experienceMode: character.experienceMode,
    notes: character.notes
  });

  return {
    ...character,
    name: snapshot.state.name || character.name,
    rulesetId: snapshot.state.rulesetId,
    experienceMode: snapshot.state.experienceMode,
    notes: snapshot.state.notes || character.notes,
    snapshot
  };
}

export function withAuthoritativeRevisionSnapshot(
  input: CharacterRevisionCreateInput,
  current?: Partial<CharacterDraft> | null
): CharacterRevisionCreateInput {
  const snapshot = buildAuthoritativeSnapshot(
    {
      ...input.snapshot,
      state: {
        ...(current ?? {}),
        ...rawState(input.snapshot)
      }
    },
    current ?? {}
  );
  return {
    ...input,
    snapshot
  };
}
