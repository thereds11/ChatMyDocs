@echo off
call .\.venv\Scripts\activate
IF "%1"=="--fix" (
  python -m ruff check . --fix
  python -m ruff format .
) ELSE (
  python -m ruff check .
  python -m ruff format --check .
)
