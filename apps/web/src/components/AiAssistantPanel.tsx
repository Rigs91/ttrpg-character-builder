import { useEffect, useMemo, useState } from "react";
import type {
  AiChatMessage,
  AiModelCatalogResponse,
  BuilderStepId,
  CharacterAssistResponse,
  CharacterDraft
} from "@forge/rules-core";
import { Badge, Button, Card, Chip } from "@forge/ui";

import { getAiModels, requestCharacterAssist } from "../lib/api";
import { IssueList } from "./IssueList";

const STEP_LABELS: Record<BuilderStepId, string> = {
  ruleset: "Ruleset",
  identity: "Identity",
  abilities: "Abilities",
  proficiencies: "Proficiencies",
  gear: "Gear & Spells",
  review: "Review"
};

type AiAssistantPanelProps = {
  draft: CharacterDraft;
  activeStep: BuilderStepId;
  onApplyPreview: (previewDraft: CharacterDraft) => void;
};

export function AiAssistantPanel({ draft, activeStep, onApplyPreview }: AiAssistantPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: "assistant",
      content: "Describe the character you want and I will prepare a reviewable draft update."
    }
  ]);
  const [catalog, setCatalog] = useState<AiModelCatalogResponse | null>(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [sending, setSending] = useState(false);
  const [draftPrompt, setDraftPrompt] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingResponse, setPendingResponse] = useState<CharacterAssistResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingCatalog(true);
    getAiModels()
      .then((response) => {
        if (cancelled) {
          return;
        }
        setCatalog(response);
        setSelectedModel(response.defaultModel || response.models[0]?.name || "");
        setErrorMessage("");
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }
        setCatalog(null);
        setSelectedModel("");
        setErrorMessage(error instanceof Error ? error.message : "Failed to load AI models.");
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingCatalog(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const groupedAppliedFields = useMemo(() => {
    if (!pendingResponse) {
      return [];
    }
    return (Object.keys(STEP_LABELS) as BuilderStepId[])
      .map((stepId) => ({
        stepId,
        label: STEP_LABELS[stepId],
        fields: pendingResponse.appliedFields.filter((field) => field.stepId === stepId)
      }))
      .filter((group) => group.fields.length > 0);
  }, [pendingResponse]);

  async function handleSendPrompt() {
    const nextPrompt = draftPrompt.trim();
    if (!nextPrompt || sending) {
      return;
    }

    const userMessage: AiChatMessage = {
      role: "user",
      content: nextPrompt
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraftPrompt("");
    setSending(true);
    setErrorMessage("");

    try {
      const response = await requestCharacterAssist({
        messages: nextMessages.slice(-8),
        currentDraft: pendingResponse?.previewDraft ?? draft,
        activeStep,
        model: selectedModel || undefined
      });
      setMessages((current) => [...current, { role: "assistant", content: response.assistantMessage }]);
      setPendingResponse(response);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Character assist failed.");
    } finally {
      setSending(false);
    }
  }

  function handleApplyPreview() {
    if (!pendingResponse) {
      return;
    }
    onApplyPreview(pendingResponse.previewDraft);
    setPendingResponse(null);
  }

  function handleDiscardPreview() {
    setPendingResponse(null);
  }

  const aiStatusTone = catalog?.available ? "success" : loadingCatalog ? "accent" : "warning";
  const aiStatusLabel = loadingCatalog ? "Loading models" : catalog?.available ? "AI ready" : "AI unavailable";

  return (
    <Card
      tone="subtle"
      title="AI Draft Agent"
      detail={catalog?.available ? `Current focus: ${STEP_LABELS[activeStep]}` : catalog?.reason || "Load a local Ollama model to enable free-text draft assist."}
      footer={
        pendingResponse ? (
          <div className="app-action-row">
            <Button tone="primary" onClick={handleApplyPreview}>Apply preview</Button>
            <Button onClick={handleDiscardPreview}>Discard preview</Button>
          </div>
        ) : undefined
      }
    >
      <div className="app-stack">
        <div className="app-ai-toolbar">
          <div className="app-chip-grid">
            <Badge tone={aiStatusTone}>{aiStatusLabel}</Badge>
            <Badge>{`${STEP_LABELS[activeStep]} step`}</Badge>
            {catalog?.defaultModel ? <Badge tone="accent">{`Default ${catalog.defaultModel}`}</Badge> : null}
          </div>
          <Button size="sm" onClick={() => setCollapsed((current) => !current)}>
            {collapsed ? "Expand agent" : "Collapse agent"}
          </Button>
        </div>

        {!collapsed ? (
          <>
            <div className="app-ai-thread">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`app-ai-message app-ai-message--${message.role}`}>
                  <strong>{message.role === "assistant" ? "Agent" : message.role === "system" ? "System" : "You"}</strong>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>

            <div className="app-inline-fields">
              <label className="app-field">
                <span>Model</span>
                <select
                  value={selectedModel}
                  onChange={(event) => setSelectedModel(event.target.value)}
                  disabled={!catalog?.models.length}
                >
                  {catalog?.models.length ? (
                    catalog.models.map((model) => (
                      <option key={model.name} value={model.name}>
                        {model.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No model available</option>
                  )}
                </select>
              </label>
            </div>

            <label className="app-field">
              <span>Describe the character or the next change you want</span>
              <textarea
                rows={4}
                value={draftPrompt}
                onChange={(event) => setDraftPrompt(event.target.value)}
                placeholder="Example: make me a level 3 dwarven cleric focused on defense and healing."
              />
            </label>

            <div className="app-action-row">
              <Button tone="primary" disabled={sending || !draftPrompt.trim() || !catalog?.available} onClick={handleSendPrompt}>
                {sending ? "Generating preview..." : "Generate reviewable draft"}
              </Button>
              <Button onClick={() => setMessages((current) => current.slice(0, 1))}>Reset conversation</Button>
            </div>

            {errorMessage ? <p className="app-error-text">{errorMessage}</p> : null}

            {pendingResponse ? (
              <div className="app-stack">
                <Card
                  tone="highlight"
                  title="Review proposal"
                  detail={`${pendingResponse.appliedFields.length} field update${pendingResponse.appliedFields.length === 1 ? "" : "s"} proposed via ${pendingResponse.modelUsed}.`}
                >
                  <div className="app-stack">
                    {groupedAppliedFields.length ? groupedAppliedFields.map((group) => (
                      <div key={group.stepId} className="app-review-group">
                        <strong>{group.label}</strong>
                        <div className="app-chip-grid">
                          {group.fields.map((field) => (
                            <Chip key={`${group.stepId}-${field.field}`} active>{field.summary}</Chip>
                          ))}
                        </div>
                      </div>
                    )) : <p className="app-muted">No concrete draft changes were proposed.</p>}

                    <div className="app-review-group">
                      <strong>Follow-up questions</strong>
                      {pendingResponse.unresolvedQuestions.length ? (
                        <div className="app-question-list">
                          {pendingResponse.unresolvedQuestions.map((question) => (
                            <div key={question.id} className="app-question-card">
                              <p>{question.prompt}</p>
                              {question.options?.length ? (
                                <div className="app-chip-grid">
                                  {question.options.map((option) => <Chip key={`${question.id}-${option}`}>{option}</Chip>)}
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="app-muted">No unresolved follow-ups from the current assist pass.</p>
                      )}
                    </div>
                  </div>
                </Card>

                <IssueList
                  issues={pendingResponse.issues}
                  title="AI preview diagnostics"
                  emptyLabel="No validation issues in the AI preview."
                />
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </Card>
  );
}
