# MCC Event Hub — Concrete Next Steps

## Snapshot of Current State
- Backend FastAPI with `lifespan` creating tables; CORS set for localhost + `mcc-web.vercel.app` (update later).
- Models: `Event`, `Profile` (no `Agenda` yet). Schemas include agenda/admin stubs; routers wired for `/events` CRUD and `/api/agenda` that calls OpenAI.
- Services: `optimize_agenda` uses `OPENAI_API_KEY` directly; no error handling beyond a string message.
- Frontend: Home/agenda/admin pages use hardcoded data and direct `fetch("http://localhost:8000/api/agenda")`; no integration with backend events/auth yet.
- Repo hygiene: `.gitignore` added; envs tracked locally; compose file exists for backend+postgres.

## Backend (FastAPI) — Do Next
- Wiring & imports: ensure `asynccontextmanager` is imported in `backend/app/main.py`; remove unused `startup_event` if still present.
- DB models:
  - Add `Agenda` table (event_id FK, topic, duration_minutes, order_index, timestamps) in `backend/app/database/models.py`.
  - Add relationships: Event -> agendas (cascade delete), optional created_by -> Profile.
- Schemas: add `AgendaCreate/AgendaUpdate/AgendaResponse` and include agendas in `EventResponse` (optional list) in `backend/app/models/schemas.py`.
- DB session dependency: create a `get_db` dependency and use it in all routers (already in events; extend to agenda/auth routes).
- Routers:
  - `events.py`: add conflict detection on create/update (check overlap on start/end/location). Support pagination/filter params; include related agendas in response.
  - New `agenda_items` router: CRUD for agendas tied to event_id.
  - New `auth/admins` router: list/add/remove admin emails against `Profile` table; simple allowlist check endpoint for the admin gate.
  - `agenda.py`: move under `/agenda` (not `/api/agenda`) and accept event_id+topics; call AI and return structured timeline JSON.
- Services:
  - `ai.py`: take model/temperature from env; raise HTTPException-friendly errors; sanitize history; structure agenda output (sections with start/end/topic).
- Config:
  - Update `backend/.env.example` with `DATABASE_URL`, `OPENAI_API_KEY`, and any model names; keep `.env` out of git.
  - CORS origins: add real Vercel domain once set (e.g., `https://mcc-event-hub.vercel.app`).
- Tests: add `tests/` with FastAPI TestClient covering health, events CRUD, conflict rejection, agenda endpoint happy path (mock OpenAI), and admin verify.

## Frontend (Next.js) — Do Next
- Env wiring: add `NEXT_PUBLIC_API_URL` in `.env.local` and switch all fetches to `${process.env.NEXT_PUBLIC_API_URL}` instead of localhost literals.
- Data fetching:
  - Home page: replace SAMPLE_EVENTS with fetch to `/events`; add loading/error states; map to `CalendarView` and `EventCard`.
  - Agenda page: post to `/agenda` with conversation history; render structured timeline if backend returns structured JSON.
  - Admin page: call `/auth/verify-admin` (or similar) and route to dashboard on success.
- New pages/components:
  - `/events/[id]` detail page (Server Component) with OG tags.
  - `/kiosk` high-contrast, auto-refresh view (now + upcoming today).
  - Admin dashboard (Client): event CRUD form, react-big-calendar with live data, agenda items editor, admin list management, chatbot widget to Event Architect endpoint.
- Styling/UX: ensure Tailwind config present for brand tokens; audit mobile responsiveness and loading states.

## Data & Infra
- Postgres/Supabase: create tables (`events`, `agendas`, `profiles`); set `DATABASE_URL` locally and in Render/Supabase settings.
- Docker Compose: confirm `docker-compose.yml` matches env values; verify `docker-compose up` runs backend + db; add volume for persistence.
- Migrations: add Alembic config to track schema changes; generate initial revision for current models.

## Deployment
- Frontend → Vercel: set `NEXT_PUBLIC_API_URL` to backend URL.
- Backend → Render (or similar): set `DATABASE_URL`, `OPENAI_API_KEY`; enable health check; consider uptime pinger.
- Staging/AWS (optional): build/push backend Docker image for EC2 later; document run steps.

## Hygiene
- Remove committed `__pycache__`/`*.pyc` if tracked; keep `.gitignore` current.
- Add README sections for setup: `npm install && npm run dev` (frontend), `uvicorn app.main:app --reload` (backend), `docker-compose up` for full stack.
