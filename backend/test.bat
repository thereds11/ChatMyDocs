@echo off
setlocal
call .\.venv\Scripts\activate
set PYTHONPATH=%CD%
pytest
endlocal
