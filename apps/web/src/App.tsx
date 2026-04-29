import { startTransition, useDeferredValue, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import {
  type BuilderStepId,
  buildParsableCharacterLines,
  buildSimplePdf,
  buildRulesPreview,
  createDefaultDraft,
  findById,
  findClassById,
  getCoverageReport,
  parseCharacterDraftJson,
  RULESETS,
  serializeCharacterDraft,
  type CharacterDraft,
  type CharacterIssue
} from "@forge/rules-core";
import { Badge, Button, Card, Chip, ForgeTheme, Panel, SectionHeading, StatusStrip, StepRail, WorkspaceShell, type StepRailStep } from "@forge/ui";

import { AiAssistantPanel } from "./components/AiAssistantPanel";
import { IssueList } from "./components/IssueList";
import { StickySummary } from "./components/StickySummary";
import {
  API_BASE_URL,
  addSessionSeat,
  buildSessionSocketUrl,
  createCharacter,
  createCharacterRevision,
  createSession,
  getSession,
  getSessionByJoinCode,
  listCharacters,
  publishCharacterToSession,
  restoreCharacterRevision,
  reviewSessionImport,
  type ApiCharacter,
  type ApiSession
} from "./lib/api";
import "./App.css";

const LOCAL_DRAFT_KEY = "forge-character-mvp-draft-v2";

const builderSteps = [
  { id: "ruleset", label: "Ruleset", description: "Lock edition scope, guidance mode, and pack coverage." },
  { id: "identity", label: "Identity", description: "Set character identity, level, class, background, and subclass." },
  { id: "abilities", label: "Abilities", description: "Allocate scores and watch derived stat changes live." },
  { id: "proficiencies", label: "Proficiencies", description: "Choose skills, feats, and 3.5 rank allocations." },
  { id: "gear", label: "Gear & Spells", description: "Pick equipment, attacks, and legal spell loadouts." },
  { id: "review", label: "Review & Share", description: "Validate, autosave, export, version, and publish." }
] as const satisfies ReadonlyArray<{ id: BuilderStepId; label: string; description: string }>;

function downloadFile(filename: string, type: string, payload: string | Uint8Array) {
  const blobPart: BlobPart = typeof payload === "string" ? payload : (payload as unknown as BlobPart);
  const blob = new Blob([blobPart], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function issueTone(issues: CharacterIssue[]) {
  if (issues.some((issue) => issue.severity === "error")) {
    return "danger" as const;
  }
  if (issues.some((issue) => issue.severity === "warning")) {
    return "warning" as const;
  }
  return "ready" as const;
}

function fieldMatchesStep(stepId: BuilderStepId, field: string) {
  const fieldMap: Record<string, string[]> = {
    ruleset: ["rulesetId", "experienceMode"],
    identity: ["name", "playerName", "level", "alignment", "backgroundId", "speciesId", "classId", "subclassId", "notes"],
    abilities: ["assignedScores", "abilityMethodId"],
    proficiencies: ["selectedSkillIds", "skillRanks", "selectedFeatIds"],
    gear: ["selectedItemIds", "selectedSpellIds"],
    review: [""]
  };
  return fieldMap[stepId].some((prefix) => !prefix || field.startsWith(prefix));
}

export default function App() {
  const [workspace, setWorkspace] = useState<"builder" | "dm">("builder");
  const [draft, setDraft] = useState<CharacterDraft>(() => {
    const raw = globalThis.localStorage?.getItem(LOCAL_DRAFT_KEY);
    if (!raw) {
      return createDefaultDraft("5e-2024");
    }
    try {
      return parseCharacterDraftJson(raw);
    } catch {
      return createDefaultDraft("5e-2024");
    }
  });
  const draftRef = useRef(draft);
  const [undoDraft, setUndoDraft] = useState<{ draft: CharacterDraft; label: string } | null>(null);
  const [activeStep, setActiveStep] = useState<BuilderStepId>("ruleset");
  const [ownerName, setOwnerName] = useState("Table Owner");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [sessionTitle, setSessionTitle] = useState("Friday Night Session");
  const [sessionJoinCode, setSessionJoinCode] = useState("");
  const [newSeatName, setNewSeatName] = useState("");
  const [publishNote, setPublishNote] = useState("");
  const [featQuery, setFeatQuery] = useState("");
  const [spellQuery, setSpellQuery] = useState("");
  const [itemQuery, setItemQuery] = useState("");
  const [spellLevelFilter, setSpellLevelFilter] = useState("all");
  const [spellLegalOnly, setSpellLegalOnly] = useState(true);
  const [itemCategoryFilter, setItemCategoryFilter] = useState("all");
  const [itemSelectedOnly, setItemSelectedOnly] = useState(false);
  const [featLegalOnly, setFeatLegalOnly] = useState(false);
  const [saveMessage, setSaveMessage] = useState("Local autosave armed");
  const [apiMessage, setApiMessage] = useState("");
  const [apiBusy, setApiBusy] = useState(false);
  const [cloudCharacter, setCloudCharacter] = useState<ApiCharacter | null>(null);
  const [savedBuilds, setSavedBuilds] = useState<ApiCharacter[]>([]);
  const [session, setSession] = useState<ApiSession | null>(null);
  const [dmLog, setDmLog] = useState<string[]>([]);

  const ruleset = useMemo(() => RULESETS.find((entry) => entry.id === draft.rulesetId) || RULESETS[0], [draft.rulesetId]);
  const characterClass = useMemo(() => findClassById(ruleset, draft.classId), [ruleset, draft.classId]);
  const background = useMemo(() => findById(ruleset.backgrounds, draft.backgroundId), [ruleset, draft.backgroundId]);
  const rulesPreview = useMemo(() => buildRulesPreview(draft), [draft]);
  const derived = rulesPreview.derived;
  const validation = { issues: rulesPreview.issues, summary: rulesPreview.summary };
  const stepIssues = useMemo(() => validation.issues.filter((issue) => fieldMatchesStep(activeStep, issue.field)), [activeStep, validation.issues]);
  const deferredFeatQuery = useDeferredValue(featQuery);
  const deferredSpellQuery = useDeferredValue(spellQuery);
  const deferredItemQuery = useDeferredValue(itemQuery);

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  const persistDraft = useEffectEvent((nextDraft: CharacterDraft) => {
    localStorage.setItem(LOCAL_DRAFT_KEY, serializeCharacterDraft(nextDraft));
    setSaveMessage(`Local autosave updated ${new Date().toLocaleTimeString()}`);
  });

  useEffect(() => {
    const timer = window.setTimeout(() => persistDraft(draft), 250);
    return () => window.clearTimeout(timer);
  }, [draft, persistDraft]);

  useEffect(() => {
    listCharacters({ limit: 8 })
      .then((response) => setSavedBuilds(response.characters))
      .catch(() => null);
  }, [cloudCharacter?.id, cloudCharacter?.updatedAt]);

  useEffect(() => {
    if (!session?.id) {
      return;
    }
    const socket = new WebSocket(buildSessionSocketUrl(session.id));
    socket.addEventListener("message", (event) => {
      const payload = JSON.parse(String(event.data));
      setDmLog((current) => [`${payload.type} / ${new Date(payload.occurredAt).toLocaleTimeString()}`, ...current].slice(0, 10));
      void getSession(session.id).then((response) => setSession(response.session)).catch(() => null);
    });
    return () => socket.close();
  }, [session?.id]);

  function updateDraft(recipe: (current: CharacterDraft) => CharacterDraft, undoLabel = "Manual edit") {
    setUndoDraft({
      draft: draftRef.current,
      label: undoLabel
    });
    startTransition(() => {
      setDraft((current) => recipe({ ...current, updatedAt: new Date().toISOString() }));
    });
  }

  function setDraftField<K extends keyof CharacterDraft>(key: K, value: CharacterDraft[K]) {
    updateDraft((current) => ({ ...current, [key]: value }));
  }

  function handleApplyAiPreview(previewDraft: CharacterDraft) {
    updateDraft(() => previewDraft, "Applied AI draft preview");
    setSaveMessage(`AI preview applied ${new Date().toLocaleTimeString()}`);
  }

  function handleUndoDraft() {
    if (!undoDraft) {
      return;
    }
    setDraft(undoDraft.draft);
    setSaveMessage(`Restored ${undoDraft.label.toLowerCase()} ${new Date().toLocaleTimeString()}`);
    setUndoDraft(null);
  }

  function changeRuleset(rulesetId: string) {
    updateDraft(() => createDefaultDraft(rulesetId), "Changed ruleset");
    setActiveStep("identity");
  }

  function toggleArraySelection(key: "selectedSkillIds" | "selectedFeatIds" | "selectedSpellIds" | "selectedItemIds", id: string) {
    updateDraft((current) => {
      const set = new Set(current[key]);
      if (set.has(id)) {
        set.delete(id);
      } else {
        set.add(id);
      }
      return { ...current, [key]: Array.from(set) };
    });
  }

  function handleIssueSelect(issue: CharacterIssue) {
    const target = rulesPreview.issues.find((entry) => entry.code === issue.code && entry.field === issue.field);
    setActiveStep(target?.stepId ?? "review");
  }

  async function handleCloudSave() {
    if (!draft.name.trim()) {
      setActiveStep("review");
      setApiMessage("Add a character name before saving a cloud revision.");
      return;
    }
    setApiBusy(true);
    setApiMessage("");
    try {
      const payload = { ownerName, ownerEmail, contentPackVersion: `${ruleset.shortName}-preview`, state: draft, derived, issues: validation.issues };
      const response = cloudCharacter
        ? await createCharacterRevision(cloudCharacter.id, { reason: "Builder save", state: draft, derived, issues: validation.issues })
        : await createCharacter(payload);
      setCloudCharacter(response.character);
      setSaveMessage(`Cloud revision saved at ${new Date().toLocaleTimeString()}`);
      setApiMessage(`Saved ${response.character.name} as revision #${response.character.latestRevision.revisionNumber}.`);
    } catch (error) {
      setApiMessage(error instanceof Error ? error.message : "Cloud save failed.");
    } finally {
      setApiBusy(false);
    }
  }

  async function handleCreateSession() {
    setApiBusy(true);
    setApiMessage("");
    try {
      const response = await createSession({ ownerName, ownerEmail, title: sessionTitle, rulesetId: draft.rulesetId });
      setSession(response.session);
      setSessionJoinCode(response.session.joinCode);
      setWorkspace("dm");
      setApiMessage(`Created session ${response.session.title} with join code ${response.session.joinCode}.`);
    } catch (error) {
      setApiMessage(error instanceof Error ? error.message : "Session creation failed.");
    } finally {
      setApiBusy(false);
    }
  }

  async function handleRefreshSession() {
    if (!session?.id) {
      return;
    }
    try {
      const response = await getSession(session.id);
      setSession(response.session);
      setApiMessage(`Refreshed session ${response.session.title}.`);
    } catch (error) {
      setApiMessage(error instanceof Error ? error.message : "Session refresh failed.");
    }
  }

  async function handleJoinSession() {
    const code = sessionJoinCode.trim();
    if (!code) {
      setApiMessage("Enter a session join code first.");
      return;
    }
    setApiBusy(true);
    setApiMessage("");
    try {
      const response = await getSessionByJoinCode(code);
      setSession(response.session);
      setWorkspace("dm");
      setApiMessage(`Opened session ${response.session.title}.`);
    } catch (error) {
      setApiMessage(error instanceof Error ? error.message : "Session lookup failed.");
    } finally {
      setApiBusy(false);
    }
  }

  async function handlePublishToSession() {
    if (!session?.id || !cloudCharacter) {
      setApiMessage("Save a cloud revision and create or join a session before publishing.");
      return;
    }
    setApiBusy(true);
    setApiMessage("");
    try {
      const response = await publishCharacterToSession(session.id, { characterId: cloudCharacter.id, submittedByName: ownerName, submittedByEmail: ownerEmail, note: publishNote });
      setSession(response.session);
      setPublishNote("");
      setWorkspace("dm");
      setApiMessage(`Submitted ${cloudCharacter.name} to ${response.session.title}.`);
    } catch (error) {
      setApiMessage(error instanceof Error ? error.message : "Session publish failed.");
    } finally {
      setApiBusy(false);
    }
  }

  async function handleReviewImport(importId: string, status: "ACCEPTED" | "REJECTED") {
    if (!session?.id) {
      return;
    }
    setApiBusy(true);
    setApiMessage("");
    try {
      const response = await reviewSessionImport(session.id, importId, status);
      setSession(response.session);
      setApiMessage(status === "ACCEPTED" ? "Accepted character into the session queue." : "Rejected character from the session queue.");
    } catch (error) {
      setApiMessage(error instanceof Error ? error.message : "Import review failed.");
    } finally {
      setApiBusy(false);
    }
  }

  async function handleAddSeat() {
    if (!session?.id || !newSeatName.trim()) {
      setApiMessage("Create or join a session and enter a seat name first.");
      return;
    }
    setApiBusy(true);
    setApiMessage("");
    try {
      const response = await addSessionSeat(session.id, { displayName: newSeatName.trim(), role: "PLAYER" });
      setSession(response.session);
      setNewSeatName("");
      setApiMessage("Added a player seat to the session roster.");
    } catch (error) {
      setApiMessage(error instanceof Error ? error.message : "Seat creation failed.");
    } finally {
      setApiBusy(false);
    }
  }

  async function handleRestoreRevision(revisionId: string) {
    if (!cloudCharacter?.id) {
      return;
    }
    setApiBusy(true);
    setApiMessage("");
    try {
      const response = await restoreCharacterRevision(cloudCharacter.id, revisionId);
      setCloudCharacter(response.character);
      const restoredState = response.character.latestRevision as unknown as { state?: CharacterDraft };
      if (restoredState.state) {
        updateDraft(() => restoredState.state!, "Restored cloud revision");
      }
      setApiMessage(`Restored revision #${response.character.latestRevision.revisionNumber}.`);
    } catch (error) {
      setApiMessage(error instanceof Error ? error.message : "Revision restore failed.");
    } finally {
      setApiBusy(false);
    }
  }

  function handleExportJson() {
    downloadFile(`${draft.name || "forge-character"}.json`, "application/json", serializeCharacterDraft(draft));
  }

  function handleExportPdf() {
    const lines = buildParsableCharacterLines(draft, derived, validation.issues);
    const bytes = buildSimplePdf(lines, { title: `Forge Character - ${draft.name || "Unnamed"}` });
    downloadFile(`${draft.name || "forge-character"}-${draft.rulesetId}.pdf`, "application/pdf", bytes);
  }

  function handleImportJson(file: File) {
    file.text().then((text) => {
      updateDraft(() => parseCharacterDraftJson(text));
      setActiveStep("identity");
    }).catch(() => setSaveMessage("Import failed: invalid draft JSON."));
  }

  const selectedFeatSet = new Set(draft.selectedFeatIds);
  const selectedSpellSet = new Set(draft.selectedSpellIds);
  const selectedItemSet = new Set(draft.selectedItemIds);
  const legalSpellIds = new Set(
    ruleset.spells
      .filter((spell) => {
        const classSlug = characterClass?.slug || "";
        return !classSlug || spell.classes.includes(classSlug);
      })
      .filter((spell) => !derived?.spellcasting || spell.level <= derived.spellcasting.maxSpellLevel)
      .map((spell) => spell.id)
  );
  const itemCategories = Array.from(new Set(ruleset.items.map((item) => item.category))).sort();
  const spellLevels = Array.from(new Set(ruleset.spells.map((spell) => spell.level))).sort((left, right) => left - right);

  const filteredFeats = ruleset.feats.filter((feat) => {
    const query = deferredFeatQuery.trim().toLowerCase();
    if (query && !`${feat.name} ${feat.description}`.toLowerCase().includes(query)) {
      return false;
    }
    if (featLegalOnly && validation.issues.some((issue) => issue.field === "selectedFeatIds" && issue.message.includes(feat.name))) {
      return false;
    }
    return true;
  });

  const filteredSpells = ruleset.spells.filter((spell) => {
    if (spellLegalOnly && !legalSpellIds.has(spell.id)) {
      return false;
    }
    if (spellLevelFilter !== "all" && String(spell.level) !== spellLevelFilter) {
      return false;
    }
    if (!deferredSpellQuery.trim()) {
      return true;
    }
    const haystack = `${spell.name} ${spell.school} ${spell.classes.join(" ")}`.toLowerCase();
    return haystack.includes(deferredSpellQuery.toLowerCase());
  });

  const filteredItems = ruleset.items.filter((item) => {
    if (itemSelectedOnly && !selectedItemSet.has(item.id)) {
      return false;
    }
    if (itemCategoryFilter !== "all" && item.category !== itemCategoryFilter) {
      return false;
    }
    if (!deferredItemQuery.trim()) {
      return true;
    }
    const haystack = `${item.name} ${item.category} ${item.properties}`.toLowerCase();
    return haystack.includes(deferredItemQuery.toLowerCase());
  });

  const railSteps: StepRailStep[] = builderSteps.map((step, index) => {
    const status: StepRailStep["status"] =
      activeStep === step.id
        ? "current"
        : builderSteps
              .slice(0, index)
              .every((previous) => validation.issues.every((issue) => !fieldMatchesStep(previous.id, issue.field) || issue.severity !== "error"))
          ? "complete"
          : validation.issues.some((issue) => fieldMatchesStep(step.id, issue.field) && issue.severity === "error")
            ? "blocked"
            : "upcoming";
    return {
      ...step,
      status
    };
  });

  const sheetSidebar = <StickySummary derived={derived} issues={validation.issues} savedLabel={cloudCharacter ? `Cloud revision #${cloudCharacter.latestRevision.revisionNumber}` : saveMessage} />;

  return (
    <ForgeTheme className="app-root">
      <WorkspaceShell
        eyebrow="Guided TTRPG Character Builder"
        title="Forge Character Workspace"
        subtitle={`Rules-aware character creation, saved revisions, session handoff, and optional local Ollama assist wired to ${API_BASE_URL}.`}
        headerActions={
          <>
            <Badge tone={rulesPreview.playability === "ready" ? "success" : rulesPreview.playability === "blocked" ? "danger" : "warning"}>{rulesPreview.playability === "ready" ? "Ready for table" : rulesPreview.playability === "blocked" ? "Blocked" : "Needs review"}</Badge>
            <Chip active={workspace === "builder"} onClick={() => setWorkspace("builder")}>Player Builder</Chip>
            <Chip active={workspace === "dm"} onClick={() => setWorkspace("dm")}>DM Sessions</Chip>
            <Button disabled={!undoDraft} onClick={handleUndoDraft}>{undoDraft ? `Undo ${undoDraft.label}` : "Undo"}</Button>
            <Button tone="primary" disabled={apiBusy} onClick={handleCloudSave}>{apiBusy ? "Working..." : "Save Revision"}</Button>
          </>
        }
        status={
          <StatusStrip
            items={[
              { id: "next", label: "Next Action", state: rulesPreview.playability === "blocked" ? "danger" : rulesPreview.playability === "needs-review" ? "warning" : "ready", value: rulesPreview.nextAction.label, description: rulesPreview.nextAction.detail },
              { id: "validation", label: "Validation", state: issueTone(validation.issues), value: `${validation.summary.errors} / ${validation.summary.warnings}`, description: "errors / warnings" },
              { id: "autosave", label: "Autosave", state: "ready", value: saveMessage },
              { id: "cloud", label: "Saved Build", state: cloudCharacter ? "ready" : "warning", value: cloudCharacter ? `Rev #${cloudCharacter.latestRevision.revisionNumber}` : "Local only", description: cloudCharacter ? "Latest persisted character" : "Save to create revision history" },
              { id: "session", label: "Session", state: session ? "ready" : "idle", value: session?.joinCode || "No room", description: session ? session.title : "Create or join a session room" }
            ]}
          />
        }
        rail={workspace === "builder" ? <StepRail steps={railSteps} activeStepId={activeStep} onStepSelect={(stepId) => setActiveStep(stepId as BuilderStepId)} onContinue={() => setActiveStep(builderSteps[Math.min(builderSteps.findIndex((step) => step.id === activeStep) + 1, builderSteps.length - 1)].id)} helperText="Follow the rail, resolve the next action, and keep every saved revision rules-checked." /> : undefined}
        sidebar={workspace === "builder" ? sheetSidebar : undefined}
      >
        {workspace === "builder" ? (
          <div className="app-stack">
            <Card
              tone={rulesPreview.playability === "ready" ? "highlight" : "subtle"}
              title="Build readiness"
              detail={rulesPreview.nextAction.detail}
            >
              <div className="app-readiness">
                <div>
                  <span className="app-muted">Next best action</span>
                  <strong>{rulesPreview.nextAction.label}</strong>
                </div>
                <div className="app-checklist" aria-label="Build completion checklist">
                  {rulesPreview.completion.map((step) => (
                    <button
                      key={step.stepId}
                      type="button"
                      className={`app-checklist__item app-checklist__item--${step.status}`}
                      onClick={() => setActiveStep(step.stepId)}
                    >
                      <span>{step.label}</span>
                      <small>{step.issueCount ? `${step.issueCount} issue${step.issueCount === 1 ? "" : "s"}` : step.actionLabel}</small>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
            {apiMessage ? <p className="app-api-message" role="status">{apiMessage}</p> : null}
            <AiAssistantPanel draft={draft} activeStep={activeStep} onApplyPreview={handleApplyAiPreview} />
            <Panel
              tone="elevated"
              padding="lg"
              header={<SectionHeading eyebrow={`Step ${builderSteps.findIndex((step) => step.id === activeStep) + 1}`} title={builderSteps.find((step) => step.id === activeStep)?.label || "Builder"} description={builderSteps.find((step) => step.id === activeStep)?.description} />}
            >
              {activeStep === "ruleset" ? (
                <div className="app-stack">
                  <div className="app-card-grid">
                    {RULESETS.map((entry) => {
                      const coverage = getCoverageReport(entry.id);
                      return (
                        <Card key={entry.id} tone={draft.rulesetId === entry.id ? "highlight" : "default"} title={entry.shortName} detail={`${coverage.percentages.spells}% spell depth / ${coverage.percentages.items}% gear depth`}>
                          <p className="app-muted">{entry.name}</p>
                          <div className="app-chip-grid">
                            <Badge tone="accent">{`${entry.classes.length} classes`}</Badge>
                            <Badge>{`${entry.spells.length} spells`}</Badge>
                            <Badge>{`${entry.items.length} items`}</Badge>
                          </div>
                          <div className="app-card-actions">
                            <Button tone={draft.rulesetId === entry.id ? "primary" : "secondary"} onClick={() => changeRuleset(entry.id)}>{draft.rulesetId === entry.id ? "Current ruleset" : "Use ruleset"}</Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                  <div className="app-inline-fields">
                    <label className="app-field">
                      <span>Experience mode</span>
                      <select value={draft.experienceMode} onChange={(event) => setDraftField("experienceMode", event.target.value as CharacterDraft["experienceMode"])}>
                        <option value="new">Guided player</option>
                        <option value="experienced">Experienced builder</option>
                      </select>
                    </label>
                    <label className="app-field">
                      <span>Owner display name</span>
                      <input value={ownerName} onChange={(event) => setOwnerName(event.target.value)} placeholder="Table owner" />
                    </label>
                    <label className="app-field">
                      <span>Owner email</span>
                      <input value={ownerEmail} onChange={(event) => setOwnerEmail(event.target.value)} placeholder="owner@example.com" />
                    </label>
                  </div>
                </div>
              ) : null}
              {activeStep === "identity" ? (
                <div className="app-stack">
                  <div className="app-inline-fields">
                    <label className="app-field">
                      <span>Character name</span>
                      <input value={draft.name} onChange={(event) => setDraftField("name", event.target.value)} placeholder="Nyx of the Ashen Gate" />
                    </label>
                    <label className="app-field">
                      <span>Player name</span>
                      <input value={draft.playerName} onChange={(event) => setDraftField("playerName", event.target.value)} placeholder="Player name" />
                    </label>
                    <label className="app-field">
                      <span>Level</span>
                      <input type="number" min={ruleset.levelBounds.min} max={ruleset.levelBounds.max} value={draft.level} onChange={(event) => setDraftField("level", Number(event.target.value || 1))} />
                    </label>
                  </div>
                  <div className="app-inline-fields">
                    <label className="app-field">
                      <span>Alignment</span>
                      <select value={draft.alignment} onChange={(event) => setDraftField("alignment", event.target.value)}>
                        {ruleset.alignments.map((alignment) => <option key={alignment} value={alignment}>{alignment}</option>)}
                      </select>
                    </label>
                    <label className="app-field">
                      <span>Background</span>
                      <select value={draft.backgroundId} onChange={(event) => setDraftField("backgroundId", event.target.value)}>
                        {ruleset.backgrounds.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
                      </select>
                    </label>
                    <label className="app-field">
                      <span>Species / race</span>
                      <select value={draft.speciesId} onChange={(event) => setDraftField("speciesId", event.target.value)}>
                        {ruleset.species.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
                      </select>
                    </label>
                  </div>
                  <div className="app-inline-fields">
                    <label className="app-field">
                      <span>Class</span>
                      <select
                        value={draft.classId}
                        onChange={(event) => {
                          const nextClass = findClassById(ruleset, event.target.value);
                          updateDraft((current) => ({ ...current, classId: event.target.value, subclassId: nextClass?.subclasses?.[0]?.id || "", selectedSkillIds: [], selectedSpellIds: [] }));
                        }}
                      >
                        {ruleset.classes.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
                      </select>
                    </label>
                    <label className="app-field">
                      <span>Subclass</span>
                      <select value={draft.subclassId} onChange={(event) => setDraftField("subclassId", event.target.value)}>
                        <option value="">No subclass yet</option>
                        {(characterClass?.subclasses || []).map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
                      </select>
                    </label>
                  </div>
                  <label className="app-field">
                    <span>Campaign notes</span>
                    <textarea rows={4} value={draft.notes} onChange={(event) => setDraftField("notes", event.target.value)} placeholder="Party role, backstory hook, table notes, or tone reminders." />
                  </label>
                  <Card tone="subtle" title="Background-driven automation" detail="These grants now flow through the shared rules core instead of being passive flavor text.">
                    <div className="app-chip-grid">
                      {(background?.skillProficiencies || []).map((skill) => <Badge key={skill} tone="accent">{skill}</Badge>)}
                      {(background?.toolProficiencies || []).map((tool) => <Badge key={tool}>{tool}</Badge>)}
                      {background?.originFeat ? <Badge tone="success">{`Origin feat: ${background.originFeat}`}</Badge> : null}
                    </div>
                  </Card>
                </div>
              ) : null}
              {activeStep === "abilities" ? (
                <div className="app-stack">
                  <div className="app-inline-fields">
                    <label className="app-field">
                      <span>Allocation method</span>
                      <select value={draft.abilityMethodId} onChange={(event) => setDraftField("abilityMethodId", event.target.value)}>
                        {ruleset.abilityMethods.map((method) => <option key={method.id} value={method.id}>{method.name}</option>)}
                      </select>
                    </label>
                    <Card tone="subtle" title="Builder guidance" detail={ruleset.beginnerTips[1] || "Allocate toward your primary abilities first."}>
                      <p className="app-muted">Point-buy stays live, background bonuses are applied automatically, and every change re-derives the summary panel immediately.</p>
                    </Card>
                  </div>
                  <div className="app-ability-grid">
                    {Object.entries(draft.assignedScores).map(([key, value]) => (
                      <label key={key} className="app-stat-card">
                        <span>{key.toUpperCase()}</span>
                        <input type="number" min={1} max={20} value={value} onChange={(event) => updateDraft((current) => ({ ...current, assignedScores: { ...current.assignedScores, [key]: Number(event.target.value || 0) } }))} />
                        <strong>{derived ? `${derived.abilityScores[key as keyof typeof derived.abilityScores]} / ${derived.abilityModifiers[key as keyof typeof derived.abilityModifiers] >= 0 ? "+" : ""}${derived.abilityModifiers[key as keyof typeof derived.abilityModifiers]}` : "-"}</strong>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}
              {activeStep === "proficiencies" ? (
                <div className="app-stack">
                  {ruleset.family === "5e" ? (
                    <Card title="Class skills" detail={`${characterClass?.name || "Class"} can choose ${characterClass?.skillChoices || 0} skills.`}>
                      <div className="app-chip-grid">
                        {(characterClass?.skillOptions || []).map((name) => {
                          const skill = ruleset.skills.find((entry) => entry.name === name);
                          if (!skill) {
                            return null;
                          }
                          return <Chip key={skill.id} active={draft.selectedSkillIds.includes(skill.id)} onClick={() => toggleArraySelection("selectedSkillIds", skill.id)}>{`${skill.name} (${skill.ability.toUpperCase()})`}</Chip>;
                        })}
                      </div>
                    </Card>
                  ) : (
                    <Card title="3.5 skill ranks" detail="Allocate ranks directly and stay inside the skill-point budget enforced by the shared validator.">
                      <div className="app-rank-grid">
                        {ruleset.skills.map((skill) => (
                          <label key={skill.id} className="app-rank-row">
                            <span>{skill.name}</span>
                            <input type="number" min={0} max={draft.level + 3} value={draft.skillRanks[skill.id] || 0} onChange={(event) => updateDraft((current) => ({ ...current, skillRanks: { ...current.skillRanks, [skill.id]: Number(event.target.value || 0) } }))} />
                          </label>
                        ))}
                      </div>
                    </Card>
                  )}
                  <Card title="Feats" detail="Search by feat name or prerequisite impact. Unsupported prerequisites still surface as validation errors.">
                    <div className="app-filter-row">
                      <label className="app-field">
                        <span>Search feats</span>
                        <input value={featQuery} onChange={(event) => setFeatQuery(event.target.value)} placeholder="Search feat name or description..." />
                      </label>
                      <label className="app-toggle-row">
                        <input type="checkbox" checked={featLegalOnly} onChange={(event) => setFeatLegalOnly(event.target.checked)} />
                        <span>Hide currently invalid feats</span>
                      </label>
                    </div>
                    {draft.selectedFeatIds.length ? (
                      <div className="app-selected-tray">
                        <strong>Selected feats</strong>
                        <div className="app-chip-grid">
                          {draft.selectedFeatIds.map((featId) => {
                            const feat = findById(ruleset.feats, featId);
                            return feat ? <Chip key={feat.id} active onClick={() => toggleArraySelection("selectedFeatIds", feat.id)}>{feat.name}</Chip> : null;
                          })}
                        </div>
                      </div>
                    ) : null}
                    <div className="app-chip-grid">
                      {filteredFeats.slice(0, 36).map((feat) => <Chip key={feat.id} active={selectedFeatSet.has(feat.id)} title={feat.description} onClick={() => toggleArraySelection("selectedFeatIds", feat.id)}>{feat.name}</Chip>)}
                    </div>
                  </Card>
                </div>
              ) : null}
              {activeStep === "gear" ? (
                <div className="app-stack">
                  <div className="app-split-grid">
                    <Card title="Items and loadout" detail="Starter gear, attacks, and AC update live from this selection.">
                      <div className="app-filter-row">
                        <label className="app-field">
                          <span>Search items</span>
                          <input value={itemQuery} onChange={(event) => setItemQuery(event.target.value)} placeholder="Search weapon, armor, focus..." />
                        </label>
                        <label className="app-field">
                          <span>Category</span>
                          <select value={itemCategoryFilter} onChange={(event) => setItemCategoryFilter(event.target.value)}>
                            <option value="all">All categories</option>
                            {itemCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                          </select>
                        </label>
                        <label className="app-toggle-row">
                          <input type="checkbox" checked={itemSelectedOnly} onChange={(event) => setItemSelectedOnly(event.target.checked)} />
                          <span>Selected only</span>
                        </label>
                      </div>
                      {draft.selectedItemIds.length ? (
                        <div className="app-selected-tray">
                          <strong>Selected loadout</strong>
                          <div className="app-chip-grid">
                            {draft.selectedItemIds.map((itemId) => {
                              const item = findById(ruleset.items, itemId);
                              return item ? <Chip key={item.id} active onClick={() => toggleArraySelection("selectedItemIds", item.id)}>{item.name}</Chip> : null;
                            })}
                          </div>
                        </div>
                      ) : null}
                      <div className="app-scroll-list">
                        {filteredItems.slice(0, 60).map((item) => (
                          <label key={item.id} className="app-check-row">
                            <input type="checkbox" checked={selectedItemSet.has(item.id)} onChange={() => toggleArraySelection("selectedItemIds", item.id)} />
                            <span><strong>{item.name}</strong><small>{`${item.category} / ${item.cost}`}</small></span>
                          </label>
                        ))}
                      </div>
                    </Card>
                    <Card title="Spells and legal pickers" detail={derived?.spellcasting ? `Current max spell level ${derived.spellcasting.maxSpellLevel}` : "Current class has no spellcasting."}>
                      <div className="app-filter-row">
                        <label className="app-field">
                          <span>Search spells</span>
                          <input value={spellQuery} onChange={(event) => setSpellQuery(event.target.value)} placeholder="Search spell, school, class..." />
                        </label>
                        <label className="app-field">
                          <span>Level</span>
                          <select value={spellLevelFilter} onChange={(event) => setSpellLevelFilter(event.target.value)}>
                            <option value="all">All levels</option>
                            {spellLevels.map((level) => <option key={level} value={level}>{level === 0 ? "Cantrip" : `Level ${level}`}</option>)}
                          </select>
                        </label>
                        <label className="app-toggle-row">
                          <input type="checkbox" checked={spellLegalOnly} onChange={(event) => setSpellLegalOnly(event.target.checked)} />
                          <span>Legal picks only</span>
                        </label>
                      </div>
                      {draft.selectedSpellIds.length ? (
                        <div className="app-selected-tray">
                          <strong>Selected spells</strong>
                          <div className="app-chip-grid">
                            {draft.selectedSpellIds.map((spellId) => {
                              const spell = findById(ruleset.spells, spellId);
                              return spell ? <Chip key={spell.id} active onClick={() => toggleArraySelection("selectedSpellIds", spell.id)}>{spell.name}</Chip> : null;
                            })}
                          </div>
                        </div>
                      ) : null}
                      <div className="app-scroll-list">
                        {filteredSpells.slice(0, 60).map((spell) => (
                          <label key={spell.id} className="app-check-row">
                            <input type="checkbox" checked={selectedSpellSet.has(spell.id)} onChange={() => toggleArraySelection("selectedSpellIds", spell.id)} />
                            <span><strong>{spell.name}</strong><small>{`Level ${spell.level} / ${spell.school} / ${spell.classes.join(", ")}`}</small></span>
                          </label>
                        ))}
                      </div>
                    </Card>
                  </div>
                  <Card tone="subtle" title="Attack preview" detail="These lines are produced from the same derived output used for PDF export and DM import.">
                    <div className="app-mini-list">
                      {derived?.attacks.length ? derived.attacks.map((attack) => (
                        <div key={attack.name} className="app-mini-row">
                          <strong>{attack.name}</strong>
                          <span>{`${attack.attackBonus >= 0 ? "+" : ""}${attack.attackBonus} to hit / ${attack.damage}`}</span>
                        </div>
                      )) : <p className="app-muted">Choose weapons to generate attack lines.</p>}
                    </div>
                  </Card>
                </div>
              ) : null}
              {activeStep === "review" ? (
                <div className="app-stack">
                  <Card tone={rulesPreview.playability === "ready" ? "highlight" : "subtle"} title="Ready-for-table check" detail={rulesPreview.nextAction.detail}>
                    <div className="app-mini-list">
                      <div className="app-mini-row"><strong>Playability</strong><span>{rulesPreview.playability}</span></div>
                      <div className="app-mini-row"><strong>Errors</strong><span>{validation.summary.errors}</span></div>
                      <div className="app-mini-row"><strong>Warnings</strong><span>{validation.summary.warnings}</span></div>
                      <div className="app-mini-row"><strong>Content pack</strong><span>{rulesPreview.contentPack.label}</span></div>
                    </div>
                  </Card>
                  <div className="app-action-row">
                    <Button tone="primary" disabled={apiBusy} onClick={handleCloudSave}>Save cloud revision</Button>
                    <Button onClick={handleExportJson}>Export JSON</Button>
                    <Button onClick={handleExportPdf}>Export PDF</Button>
                    <label className="app-upload">
                      <span>Import JSON</span>
                      <input type="file" accept="application/json" onChange={(event) => { const file = event.target.files?.[0]; if (file) { handleImportJson(file); } event.currentTarget.value = ""; }} />
                    </label>
                  </div>
                  <label className="app-field">
                    <span>Publish note</span>
                    <textarea rows={3} value={publishNote} onChange={(event) => setPublishNote(event.target.value)} placeholder="DM-facing handoff note or character intent." />
                  </label>
                  <Card title="Session handoff payload" detail="This is what the DM hub receives when you publish the saved revision.">
                    <div className="app-mini-list">
                      <div className="app-mini-row"><strong>Character</strong><span>{draft.name || "Unnamed draft"}</span></div>
                      <div className="app-mini-row"><strong>Ruleset</strong><span>{ruleset.shortName}</span></div>
                      <div className="app-mini-row"><strong>Revision</strong><span>{cloudCharacter ? `#${cloudCharacter.latestRevision.revisionNumber}` : "Save first"}</span></div>
                      <div className="app-mini-row"><strong>Validation</strong><span>{`${validation.summary.errors} errors / ${validation.summary.warnings} warnings`}</span></div>
                    </div>
                  </Card>
                  <div className="app-action-row">
                    <Button tone="secondary" disabled={apiBusy} onClick={handleCreateSession}>Create session room</Button>
                    <Button tone="primary" disabled={!session || !cloudCharacter || apiBusy} onClick={handlePublishToSession}>Submit to session review</Button>
                    <Button onClick={() => setWorkspace("dm")} disabled={!session}>Open session hub</Button>
                  </div>
                  {cloudCharacter?.revisions?.length ? (
                    <Card title="Revision history" detail="Restore creates a new checked revision, preserving the original history.">
                      <div className="app-scroll-list">
                        {cloudCharacter.revisions.slice().reverse().map((revision) => (
                          <div key={revision.id} className="app-mini-row">
                            <strong>{`Revision #${revision.revisionNumber}`}</strong>
                            <span>{`${revision.issueSummary.errors} errors / ${revision.issueSummary.warnings} warnings`}</span>
                            <Button size="sm" disabled={apiBusy || revision.id === cloudCharacter.latestRevision.id} onClick={() => handleRestoreRevision(revision.id)}>Restore</Button>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ) : null}
                  {savedBuilds.length ? (
                    <Card title="Recent saved builds" detail="API-backed characters available in this local workspace.">
                      <div className="app-scroll-list">
                        {savedBuilds.map((entry) => (
                          <div key={entry.id} className="app-mini-row">
                            <strong>{entry.name}</strong>
                            <span>{`${entry.rulesetId} / rev #${entry.latestRevision.revisionNumber}`}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ) : null}
                  {apiMessage ? <p className="app-api-message" role="status">{apiMessage}</p> : null}
                  <IssueList issues={validation.issues} title="Release gating" emptyLabel="This draft is ready to publish and print." onIssueSelect={handleIssueSelect} />
                </div>
              ) : null}
            </Panel>
            <IssueList issues={stepIssues} title="Current step diagnostics" onIssueSelect={handleIssueSelect} />
          </div>
        ) : (
          <div className="app-stack">
            {apiMessage ? <p className="app-api-message" role="status">{apiMessage}</p> : null}
            <Panel tone="elevated" padding="lg" header={<SectionHeading eyebrow="Session Hub" title="Roster, review queue, and publish status" description="Create a room, share the join code, then accept or reject submitted character revisions before table play." />}>
              <div className="app-inline-fields">
                <label className="app-field">
                  <span>Session title</span>
                  <input value={sessionTitle} onChange={(event) => setSessionTitle(event.target.value)} placeholder="Friday Night Session" />
                </label>
                <label className="app-field">
                  <span>Join code</span>
                  <input value={sessionJoinCode} onChange={(event) => setSessionJoinCode(event.target.value.toUpperCase())} placeholder="ABC123" />
                </label>
                <label className="app-field">
                  <span>Ruleset</span>
                  <select value={draft.rulesetId} onChange={(event) => setDraftField("rulesetId", event.target.value)}>
                    {RULESETS.map((entry) => <option key={entry.id} value={entry.id}>{entry.shortName}</option>)}
                  </select>
                </label>
              </div>
              <div className="app-action-row">
                <Button tone="primary" disabled={apiBusy} onClick={handleCreateSession}>Create session</Button>
                <Button disabled={apiBusy || !sessionJoinCode.trim()} onClick={handleJoinSession}>Open by join code</Button>
                <Button onClick={handleRefreshSession} disabled={!session || apiBusy}>Refresh session</Button>
              </div>
              {session ? (
                <div className="app-split-grid">
                  <Card tone="highlight" title={session.title} detail={`Join code ${session.joinCode}`}>
                    <div className="app-mini-list">
                      <div className="app-mini-row"><strong>Status</strong><span>{session.status}</span></div>
                      <div className="app-mini-row"><strong>Seats</strong><span>{session.seats.length}</span></div>
                      <div className="app-mini-row"><strong>Imports</strong><span>{session.imports.length}</span></div>
                    </div>
                  </Card>
                  <Card title="Roster seats" detail="Use seats to plan player slots before accepting submitted characters.">
                    <div className="app-inline-fields">
                      <label className="app-field">
                        <span>New player seat</span>
                        <input value={newSeatName} onChange={(event) => setNewSeatName(event.target.value)} placeholder="Player name or open seat" />
                      </label>
                      <Button disabled={apiBusy || !newSeatName.trim()} onClick={handleAddSeat}>Add seat</Button>
                    </div>
                    <div className="app-scroll-list">
                      {session.seats.map((seat) => (
                        <div key={seat.id} className="app-mini-row">
                          <strong>{seat.displayName}</strong>
                          <Badge>{seat.role}</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card title="Character review queue" detail="Players publish saved revisions here; the DM marks each as accepted or rejected.">
                    <div className="app-scroll-list">
                      {session.imports.length ? session.imports.map((entry) => (
                        <div key={entry.id} className="app-mini-row">
                          <strong>{entry.character.name}</strong>
                          <Badge tone={entry.status === "PENDING" ? "warning" : entry.status === "ACCEPTED" ? "success" : "danger"}>{entry.status}</Badge>
                          {entry.status === "PENDING" ? (
                            <span className="app-row-actions">
                              <Button size="sm" disabled={apiBusy} onClick={() => handleReviewImport(entry.id, "ACCEPTED")}>Accept</Button>
                              <Button size="sm" tone="danger" disabled={apiBusy} onClick={() => handleReviewImport(entry.id, "REJECTED")}>Reject</Button>
                            </span>
                          ) : null}
                        </div>
                      )) : <p className="app-muted">No imports have landed yet.</p>}
                    </div>
                  </Card>
                </div>
              ) : (
                <p className="app-muted">No session yet. Create one to start the DM import workflow.</p>
              )}
            </Panel>
            <Panel padding="lg" header={<SectionHeading title="Realtime event log" description="Events stream from the Fastify websocket hub and refresh the roster automatically." />}>
              <div className="app-scroll-list">
                {dmLog.length ? dmLog.map((entry) => <div key={entry} className="app-log-row">{entry}</div>) : <p className="app-muted">Waiting for live session events.</p>}
              </div>
            </Panel>
          </div>
        )}
      </WorkspaceShell>
    </ForgeTheme>
  );
}
