import os
import requests
import pytest

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://ai-community-join.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def test_root(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200
    assert r.json().get("message") == "NEXUS AI COMMUNITY HUB API"


def test_create_founder_no_consent(session):
    r = session.post(f"{API}/founders", json={
        "name": "TEST_Layla", "skills": "x", "learning_goals": "y", "consent": False,
    })
    assert r.status_code == 400
    assert r.json().get("detail") == "UAE data privacy consent is required."


def test_create_founder_empty_fields(session):
    r = session.post(f"{API}/founders", json={
        "name": " ", "skills": "x", "learning_goals": "y", "consent": True,
    })
    assert r.status_code == 400
    assert r.json().get("detail") == "All fields are required."


def test_create_founder_success_and_list(session):
    payload = {
        "name": "TEST_Founder_Aisha",
        "skills": "Product strategy, MENA fundraising, growth loops",
        "learning_goals": "Pricing B2B SaaS in GCC and hiring an early CTO",
        "consent": True,
    }
    r = session.post(f"{API}/founders", json=payload, timeout=60)
    assert r.status_code == 200, r.text
    data = r.json()
    for k in ("id", "name", "skills", "learning_goals", "consent", "ai_insight", "created_at"):
        assert k in data
    assert data["name"] == payload["name"]
    assert data["consent"] is True
    assert isinstance(data["ai_insight"], str) and len(data["ai_insight"]) > 30

    # List and verify presence + desc sort
    lr = session.get(f"{API}/founders", timeout=30)
    assert lr.status_code == 200
    arr = lr.json()
    assert isinstance(arr, list) and len(arr) >= 1
    ids = [f["id"] for f in arr]
    assert data["id"] in ids
    # sorted by created_at desc
    times = [f["created_at"] for f in arr]
    assert times == sorted(times, reverse=True)
