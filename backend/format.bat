@echo off
call .\.venv\Scripts\activate
python -m ruff format .
