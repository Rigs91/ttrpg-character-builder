import websocket from "@fastify/websocket";
import type { FastifyInstance } from "fastify";

import type { ForgeRepository } from "../repositories/types.js";
import { SessionHub } from "./sessionHub.js";

function sendEvent(socket: { send: (payload: string) => void }, payload: unknown): void {
  socket.send(JSON.stringify(payload));
}

export async function registerRealtimeRoutes(
  app: FastifyInstance,
  repository: ForgeRepository,
  sessionHub: SessionHub
): Promise<void> {
  await app.register(websocket);

  app.get("/ws/events", { websocket: true }, (socket) => {
    const unsubscribe = sessionHub.subscribeGlobal((event) => {
      sendEvent(socket, event);
    });

    socket.on("close", unsubscribe);
  });

  app.get<{ Params: { sessionId: string } }>("/ws/sessions/:sessionId", { websocket: true }, async (socket, request) => {
    const session = await repository.getSession(request.params.sessionId);
    if (!session) {
      sendEvent(socket, {
        type: "session.error",
        occurredAt: new Date().toISOString(),
        payload: {
          message: `Session ${request.params.sessionId} was not found.`
        }
      });
      socket.close();
      return;
    }

    const unsubscribe = sessionHub.subscribeSession(session.id, (event) => {
      sendEvent(socket, event);
    });

    socket.on("close", unsubscribe);
    sessionHub.emitSessionJoined(session);
  });
}
