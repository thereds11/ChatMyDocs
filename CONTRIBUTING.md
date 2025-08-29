# Contributing to ChatMyDocs

Thanks for helping! 🫶

## Quick start
- Windows-friendly dev:
  - Backend: `cd backend && python -m venv .venv && .\.venv\Scripts\activate && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000`
  - Frontend: `cd frontend && npm i && npm run dev`
- Lint/test:
  - Backend: `.\backend\run_lint.bat --fix && .\backend\test.bat`
  - Frontend: `npm run lint && npm run typecheck`

## Commit style
Use **Conventional Commits**:
- `feat(rag): add streaming`
- `fix(api): handle empty uploads`
- `docs: update README`
- `chore(ci): add backend workflow`

## Code style
- **Python**: Ruff (format + lint), Pytest for tests.
- **TypeScript**: ESLint (flat config), Type checking (tsc).
- Keep components small, DRY, accessible; prefer composition.

## Branches & PRs
- Fork or create a feature branch from `main`.
- Keep PRs focused; add screenshots for UI changes.
- PR template checklist must pass.

## Issue triage
- Use labels: `bug`, `enhancement`, `good first issue`, `help wanted`.
- Small PRs are encouraged!
