import { startTransition, useDeferredValue, useEffect, useEffectEvent, useMemo, useState } from "react";
import {
  type BuilderStepId,
  buildParsableCharacterLines,
  buildSimplePdf,
  createDefaultDraft,
  deriveCharacter,
  findById,
  findClassById,
  getCoverageReport,
  parseCharacterDraftJson,
  RULESETS,
  serializeCharacterDraft,
  validateCharacter,
  type CharacterDraft,
  type CharacterIssue
} from "@forge/rules-core";
import { Badge, Button, Card, Chip, ForgeTheme, Panel, SectionHeading, StatusStrip, StepRail, WorkspaceShell, type StepRailStep } from "@forge/ui";

import { AiAssistantPanel } from "./components/AiAssistantPanel";
import { IssueList } from "./components/IssueList";
import { StickySummary } from "./components/StickySummary";
import { API_BASE_URL, buildSessionSocketUrl, createCharacter, createCharacterRevision, createSession, getSession, publishCharacterToSession, type ApiCharacter, type ApiSession } from "./lib/api";
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
  const [activeStep, setActiveStep] = useState<BuilderStepId>("ruleset");
  const [ownerName, setOwnerName] = useState("Table Owner");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [sessionTitle, setSessionTitle] = useState("Friday Night Session");
  const [publishNote, setPublishNote] = useState("");
  const [spellQuery, setSpellQuery] = useState("");
  const [itemQuery, setItemQuery] = useState("");
  const [saveMessage, setSaveMessage] = useState("Local autosave armed");
  const [cloudCharacter, setCloudCharacter] = useState<ApiCharacter | null>(null);
  const [session, setSession] = useState<ApiSession | null>(null);
  const [dmLog, setDmLog] = useState<string[]>([]);

  const ruleset = useMemo(() => RULESETS.find((entry) => entry.id === draft.rulesetId) || RULESETS[0], [draft.rulesetId]);
  const characterClass = useMemo(() => findClassById(ruleset, draft.classId), [ruleset, draft.classId]);
  const background = useMemo(() => findById(ruleset.backgrounds, draft.backgroundId), [ruleset, draft.backgroundId]);
  const derived = useMemo(() => deriveCharacter(draft), [draft]);
  const validation = useMemo(() => validateCharacter(draft), [draft]);
  const stepIssues = useMemo(() => validation.issues.filter((issue) => fieldMatchesStep(activeStep, issue.field)), [activeStep, validation.issues]);
  const deferredSpellQuery = useDeferredValue(spellQuery);
  const deferredItemQuery = useDeferredValue(itemQuery);

  const persistDraft = useEffectEvent((nextDraft: CharacterDraft) => {
    localStorage.setItem(LOCAL_DRAFT_KEY, serializeCharacterDraft(nextDraft));
    setSaveMessage(`Local autosave updated ${new Date().toLocaleTimeString()}`);
  });

  useEffect(() => {
    const timer = window.setTimeout(() => persistDraft(draft), 250);
    return () => window.clearTimeout(timer);
  }, [draft, persistDraft]);

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

  function updateDraft(recipe: (current: CharacterDraft) => CharacterDraft) {
    startTransition(() => {
      setDraft((current) => recipe({ ...current, updatedAt: new Date().toISOString() }));
    });
  }

  function setDraftField<K extends keyof CharacterDraft>(key: K, value: CharacterDraft[K]) {
    updateDraft((current) => ({ ...current, [key]: value }));
  }

  function handleApplyAiPreview(previewDraft: CharacterDraft) {
    updateDraft(() => previewDraft);
    setSaveMessage(`AI preview applied ${new Date().toLocaleTimeString()}`);
  }

  function changeRuleset(rulesetId: string) {
    updateDraft(() => createDefaultDraft(rulesetId));
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

  async function handleCloudSave() {
    if (!draft.name.trim()) {
      setActiveStep("review");
      return;
    }
    const payload = { ownerName, ownerEmail, contentPackVersion: `${ruleset.shortName}-mvp`, state: draft, derived, issues: validation.issues };
    const response = cloudCharacter
      ? await createCharacterRevision(cloudCharacter.id, { reason: "Builder save", state: draft, derived, issues: validation.issues })
      : await createCharacter(payload);
    setCloudCharacter(response.character);
    setSaveMessage(`Cloud revision saved at ${new Date().toLocaleTimeString()}`);
  }

  async function handleCreateSession() {
    const response = await createSession({ ownerName, ownerEmail, title: sessionTitle, rulesetId: draft.rulesetId });
    setSession(response.session);
    setWorkspace("dm");
  }

  async function handleRefreshSession() {
    if (!session?.id) {
      return;
    }
    const response = await getSession(session.id);
    setSession(response.session);
  }

  async function handlePublishToSession() {
    if (!session?.id || !cloudCharacter) {
      return;
    }
    const response = await publishCharacterToSession(session.id, { characterId: cloudCharacter.id, submittedByName: ownerName, submittedByEmail: ownerEmail, note: publishNote });
    setSession(response.session);
    setPublishNote("");
    setWorkspace("dm");
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

  const filteredSpells = ruleset.spells.filter((spell) => {
    if (!deferredSpellQuery.trim()) {
      return true;
    }
    const haystack = `${spell.name} ${spell.school} ${spell.classes.join(" ")}`.toLowerCase();
    return haystack.includes(deferredSpellQuery.toLowerCase());
  });

  const filteredItems = ruleset.items.filter((item) => {
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
        eyebrow="Forge Character AI"
        title="AI-Assisted Player Builder and DM Session Hub"
        subtitle={`Optional Ollama draft assist, shared rules validation, and DM session tooling wired to ${API_BASE_URL}.`}
        headerActions={
          <>
            <Badge tone="accent">Optional Ollama Draft Agent</Badge>
            <Chip active={workspace === "builder"} onClick={() => setWorkspace("builder")}>Player Builder</Chip>
            <Chip active={workspace === "dm"} onClick={() => setWorkspace("dm")}>DM Sessions</Chip>
            <Button tone="primary" onClick={handleCloudSave}>Save Cloud Revision</Button>
          </>
        }
        status={
          <StatusStrip
            items={[
              { id: "validation", label: "Validation", state: issueTone(validation.issues), value: `${validation.summary.errors} / ${validation.summary.warnings}`, description: "errors / warnings" },
              { id: "autosave", label: "Autosave", state: "ready", value: saveMessage },
              { id: "cloud", label: "Cloud", state: cloudCharacter ? "ready" : "warning", value: cloudCharacter ? cloudCharacter.id.slice(0, 8) : "Not published", description: cloudCharacter ? "Latest persisted character" : "Create a character record" },
              { id: "session", label: "Session", state: session ? "ready" : "idle", value: session?.joinCode || "No room", description: session ? session.title : "Create a DM room to publish into" }
            ]}
          />
        }
        rail={workspace === "builder" ? <StepRail steps={railSteps} activeStepId={activeStep} onStepSelect={(stepId) => setActiveStep(stepId as BuilderStepId)} onContinue={() => setActiveStep(builderSteps[Math.min(builderSteps.findIndex((step) => step.id === activeStep) + 1, builderSteps.length - 1)].id)} helperText="The rail mirrors production MVP flow: select only legal options, keep the summary live, and make share state obvious." /> : undefined}
        sidebar={workspace === "builder" ? sheetSidebar : undefined}
      >
        {workspace === "builder" ? (
          <div className="app-stack">
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
                  <Card title="Feats" detail="Unsupported prerequisites surface as validation errors instead of silently slipping through.">
                    <div className="app-chip-grid">
                      {ruleset.feats.slice(0, 24).map((feat) => <Chip key={feat.id} active={draft.selectedFeatIds.includes(feat.id)} onClick={() => toggleArraySelection("selectedFeatIds", feat.id)}>{feat.name}</Chip>)}
                    </div>
                  </Card>
                </div>
              ) : null}
              {activeStep === "gear" ? (
                <div className="app-stack">
                  <div className="app-split-grid">
                    <Card title="Items and loadout" detail="Starter gear, attacks, and AC update live from this selection.">
                      <label className="app-field">
                        <span>Search items</span>
                        <input value={itemQuery} onChange={(event) => setItemQuery(event.target.value)} placeholder="Search weapon, armor, focus..." />
                      </label>
                      <div className="app-scroll-list">
                        {filteredItems.slice(0, 60).map((item) => (
                          <label key={item.id} className="app-check-row">
                            <input type="checkbox" checked={draft.selectedItemIds.includes(item.id)} onChange={() => toggleArraySelection("selectedItemIds", item.id)} />
                            <span><strong>{item.name}</strong><small>{`${item.category} / ${item.cost}`}</small></span>
                          </label>
                        ))}
                      </div>
                    </Card>
                    <Card title="Spells and legal pickers" detail={derived?.spellcasting ? `Current max spell level ${derived.spellcasting.maxSpellLevel}` : "Current class has no spellcasting."}>
                      <label className="app-field">
                        <span>Search spells</span>
                        <input value={spellQuery} onChange={(event) => setSpellQuery(event.target.value)} placeholder="Search spell, school, class..." />
                      </label>
                      <div className="app-scroll-list">
                        {filteredSpells.slice(0, 60).map((spell) => (
                          <label key={spell.id} className="app-check-row">
                            <input type="checkbox" checked={draft.selectedSpellIds.includes(spell.id)} onChange={() => toggleArraySelection("selectedSpellIds", spell.id)} />
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
                  <div className="app-action-row">
                    <Button tone="primary" onClick={handleCloudSave}>Save cloud revision</Button>
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
                  <div className="app-action-row">
                    <Button tone="secondary" onClick={handleCreateSession}>Create DM session</Button>
                    <Button tone="primary" disabled={!session || !cloudCharacter} onClick={handlePublishToSession}>Publish to current session</Button>
                    <Button onClick={() => setWorkspace("dm")} disabled={!session}>Open DM hub</Button>
                  </div>
                  <IssueList issues={validation.issues} title="Release gating" emptyLabel="This draft is ready to publish and print." />
                </div>
              ) : null}
            </Panel>
            <IssueList issues={stepIssues} title="Current step diagnostics" />
          </div>
        ) : (
          <div className="app-stack">
            <Panel tone="elevated" padding="lg" header={<SectionHeading eyebrow="DM Session Hub" title="Roster, imports, and live publish status" description="This is the MVP replacement for the old postMessage-only CTA. It is now a real workflow surface with API-backed state." />}>
              <div className="app-inline-fields">
                <label className="app-field">
                  <span>Session title</span>
                  <input value={sessionTitle} onChange={(event) => setSessionTitle(event.target.value)} placeholder="Friday Night Session" />
                </label>
                <label className="app-field">
                  <span>Ruleset</span>
                  <select value={draft.rulesetId} onChange={(event) => setDraftField("rulesetId", event.target.value)}>
                    {RULESETS.map((entry) => <option key={entry.id} value={entry.id}>{entry.shortName}</option>)}
                  </select>
                </label>
              </div>
              <div className="app-action-row">
                <Button tone="primary" onClick={handleCreateSession}>Create session</Button>
                <Button onClick={handleRefreshSession} disabled={!session}>Refresh session</Button>
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
                  <Card title="Pending imports" detail="Players publish cloud revisions into this queue.">
                    <div className="app-scroll-list">
                      {session.imports.length ? session.imports.map((entry) => (
                        <div key={entry.id} className="app-mini-row">
                          <strong>{entry.character.name}</strong>
                          <Badge tone={entry.status === "PENDING" ? "warning" : entry.status === "ACCEPTED" ? "success" : "danger"}>{entry.status}</Badge>
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
