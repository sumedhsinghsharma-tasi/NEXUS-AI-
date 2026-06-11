# NEXUS AI COMMUNITY HUB — PRD

## Original Problem Statement
An AI-driven community platform onboarding screen. It must have a text box where a
founder can type their name, skills, and what they want to learn, an active checkbox
for UAE data privacy consent, and a large button that says "Submit to AI Engine".

## User Choices
- Real AI integration: Claude Sonnet 4.5 (via Emergent LLM key)
- Persistence: MongoDB + a public Founders Index page
- Visual style: Minimal / clean (Swiss & High-Contrast archetype)
- Brand name: NEXUS AI COMMUNITY HUB

## Architecture
- Backend: FastAPI (`/app/backend/server.py`) with `/api/founders` POST/GET routes.
  AI generation via `emergentintegrations.LlmChat` (`anthropic`, `claude-sonnet-4-5-20250929`).
- Storage: MongoDB collection `founders`, `_id` excluded from responses, dates ISO-stored.
- Frontend: React (CRA + craco), `react-router-dom`, Tailwind + Shadcn UI primitives.
  Pages: `/` Onboarding, `/founders` Founders Index.

## Personas
- **Founder (UAE)** — submits profile, expects AI-personalized briefing.
- **Community curator** — browses founders index to spot matches.

## Core Requirements (static)
- Single-screen onboarding with Name / Skills / Learning Goals + UAE PDPL consent.
- Submit triggers Claude → returns markdown briefing, persisted in Mongo.
- Founders index lists all submissions with expandable AI briefing.

## What's Implemented (2026-02-11)
- Backend `/api/founders` POST (Claude integration, validation, consent enforcement) + GET.
- Frontend Onboarding page with editorial Swiss layout, sticky intro column,
  large prominent "Submit to AI Engine" CTA, in-page AI result card with markdown render.
- Frontend Founders Index with stats bar, accordion rows showing full briefing.
- Brand header + footer, custom markdown renderer, fonts (Outfit / IBM Plex / JetBrains Mono).
- Full data-testid coverage. Backend + Frontend E2E tested at 100%.

## Backlog
- **P1** Search / filter founders by skill tag.
- **P1** Edit / delete a founder profile (admin-side).
- **P2** Email confirmation to the founder with their briefing (Resend).
- **P2** Pagination for founders index when count > 50.
- **P2** Rate-limit POST /api/founders to prevent spam.
- **P2** Lifespan handler instead of deprecated `@app.on_event('shutdown')`.
- **P3** Founder avatar upload (object storage).
