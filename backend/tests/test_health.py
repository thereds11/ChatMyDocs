from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json().get("ok") is True


def test_stats_ok() -> None:
    r = client.get("/stats")
    assert r.status_code == 200
    assert "documents" in r.json()
