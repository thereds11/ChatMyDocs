.PHONY: dev dev-back dev-front fmt lint

dev-back:
	cd backend && uvicorn app.main:app --reload --port 8000

dev-front:
	cd frontend && npm run dev

fmt:
	cd backend && ruff format .
	cd backend && ruff check --fix .
	cd frontend && npm run lint --silent || true

lint:
	cd backend && ruff check .
	cd frontend && npm run lint --silent || true
