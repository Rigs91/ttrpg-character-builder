import { randomUUID } from "node:crypto";

import type {
  CharacterImportedEvent,
  CharacterPublishedEvent,
  CharacterRecord,
  ForgeRealtimeEvent,
  SessionImportRecord,
  SessionJoinedEvent,
  SessionRecord,
  SessionRosterUpdatedEvent
} from "../contracts.js";

type EventSubscriber = (event: ForgeRealtimeEvent) => void | Promise<void>;

function nowIso(): string {
  return new Date().toISOString();
}

export class SessionHub {
  private globalSubscribers = new Map<string, EventSubscriber>();
  private sessionSubscribers = new Map<string, Map<string, EventSubscriber>>();
  private history: ForgeRealtimeEvent[] = [];

  subscribeGlobal(subscriber: EventSubscriber): () => void {
    const token = randomUUID();
    this.globalSubscribers.set(token, subscriber);
    return () => {
      this.globalSubscribers.delete(token);
    };
  }

  subscribeSession(sessionId: string, subscriber: EventSubscriber): () => void {
    const token = randomUUID();
    const subscribers = this.sessionSubscribers.get(sessionId) ?? new Map<string, EventSubscriber>();
    subscribers.set(token, subscriber);
    this.sessionSubscribers.set(sessionId, subscribers);

    return () => {
      const activeSubscribers = this.sessionSubscribers.get(sessionId);
      if (!activeSubscribers) {
        return;
      }
      activeSubscribers.delete(token);
      if (activeSubscribers.size === 0) {
        this.sessionSubscribers.delete(sessionId);
      }
    };
  }

  emitSessionJoined(session: SessionRecord): SessionJoinedEvent {
    const event: SessionJoinedEvent = {
      type: "session.joined",
      occurredAt: nowIso(),
      payload: {
        sessionId: session.id,
        joinCode: session.joinCode,
        title: session.title,
        seatCount: session.seats.length,
        importCount: session.imports.length
      }
    };

    this.record(event);
    this.broadcastGlobal(event);
    this.broadcastSession(session.id, event);
    return event;
  }

  emitCharacterPublished(character: CharacterRecord): CharacterPublishedEvent {
    const event: CharacterPublishedEvent = {
      type: "character.published",
      occurredAt: nowIso(),
      payload: {
        characterId: character.id,
        revisionNumber: character.latestRevision.revisionNumber,
        rulesetId: character.rulesetId,
        characterName: character.name,
        issueSummary: character.issueSummary
      }
    };

    this.record(event);
    this.broadcastGlobal(event);
    return event;
  }

  emitCharacterImported(session: SessionRecord, sessionImport: SessionImportRecord): CharacterImportedEvent {
    const event: CharacterImportedEvent = {
      type: "character.imported",
      occurredAt: nowIso(),
      payload: {
        sessionId: session.id,
        sessionImportId: sessionImport.id,
        characterId: sessionImport.characterId,
        characterName: sessionImport.character.name,
        submittedByName: sessionImport.submittedByName,
        status: sessionImport.status
      }
    };

    this.record(event);
    this.broadcastGlobal(event);
    this.broadcastSession(session.id, event);
    return event;
  }

  emitSessionRosterUpdated(session: SessionRecord): SessionRosterUpdatedEvent {
    const pendingImports = session.imports.filter((entry) => entry.status === "PENDING").length;
    const event: SessionRosterUpdatedEvent = {
      type: "session.roster.updated",
      occurredAt: nowIso(),
      payload: {
        sessionId: session.id,
        seatCount: session.seats.length,
        importCount: session.imports.length,
        pendingImports
      }
    };

    this.record(event);
    this.broadcastGlobal(event);
    this.broadcastSession(session.id, event);
    return event;
  }

  getHistory(): readonly ForgeRealtimeEvent[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }

  private record(event: ForgeRealtimeEvent): void {
    this.history.push(event);
  }

  private broadcastGlobal(event: ForgeRealtimeEvent): void {
    this.globalSubscribers.forEach((subscriber) => {
      void subscriber(event);
    });
  }

  private broadcastSession(sessionId: string, event: ForgeRealtimeEvent): void {
    this.sessionSubscribers.get(sessionId)?.forEach((subscriber) => {
      void subscriber(event);
    });
  }
}
