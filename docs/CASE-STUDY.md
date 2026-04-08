# Forge Character Case Study

## Problem

Fantasy character creation often asks players to understand rules, progression, and tradeoffs before they have a usable character. That makes the experience intimidating for new players and tedious for experienced ones.

## User

The primary user is a player who wants to create a legal, understandable character without bouncing between rulebooks, notes, and scattered calculators. A secondary user is the game master who wants fast, reviewable party builds.

## Solution

Forge Character packages character creation as a guided workflow. The root builder breaks the process into setup, abilities, build choices, and review, then keeps a live character sheet and validation feedback visible throughout the flow.

## Product Strategy

The product aims to reduce friction in a complicated rules-based task without flattening the interesting decisions. It prioritizes:

- clear progression through the build
- visible cause-and-effect as choices update the sheet
- guardrails that help without fully automating the process
- fast local startup and direct-file demoability

## UX Decisions

- Use a bounded stepper instead of a single large form
- Keep explanatory helper copy for new players, but allow experienced users to move quickly
- Show the character sheet alongside the builder so choices feel concrete
- Keep the AI assist optional and review-oriented rather than turning the whole product into a chatbot

## Technical Decisions

- Preserve the fast root builder as the primary demo surface
- Add a typed React/API monorepo to show a more scalable architecture direction
- Use shared rules contracts for validation, export, and AI-assist payloads in the newer stack
- Keep `file://` support through a checked-in static bundle for low-friction local demos

## Tradeoffs

- The repo currently shows two architectural layers: a direct-file builder and a newer modular stack. That is honest and useful for interviews, but it requires clear documentation so the primary demo path is obvious.
- AI assist improves speed, but it is deliberately secondary to the guided workflow because the core product value is clarity, not novelty.
- The project stays SRD-oriented, which keeps the repo public-safe but limits content breadth compared with a full commercial builder.

## Why This Project Works In Interviews

This repo gives truthful material for product, UX, and engineering conversations:

- workflow design for a rules-heavy problem
- state and validation management across a multi-step build
- practical tradeoffs between fast demos and scalable architecture
- thoughtful handling of optional AI instead of forcing it into the product story
