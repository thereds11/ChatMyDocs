import asyncio
import sys
import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(scope="session", autouse=True)
def _windows_event_loop_policy() -> None:
    # Avoid "pending overlapped" warnings on Windows when asyncio deallocates
    if sys.platform.startswith("win"):
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

@pytest.fixture()
def client():
    # Ensure the client closes sockets cleanly
    with TestClient(app) as c:
        yield c
