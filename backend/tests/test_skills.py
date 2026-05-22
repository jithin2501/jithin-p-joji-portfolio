import pytest
from fastapi import status

async def test_create_skill(client):
    payload = {
        "name": "Python",
        "color": "#3776AB",
        "slug": "python",
        "desc": "Backend programming and scripting.",
        "page": 1
    }
    response = await client.post("/api/v1/skills/", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["name"] == "Python"
    assert data["slug"] == "python"
    assert data["page"] == 1
    assert "id" in data

async def test_get_all_skills(client):
    payload1 = {
        "name": "React",
        "color": "#61DAFB",
        "slug": "react",
        "desc": "Frontend UI component framework.",
        "page": 1
    }
    payload2 = {
        "name": "MongoDB",
        "color": "#47A248",
        "slug": "mongodb",
        "desc": "NoSQL document database.",
        "page": 2
    }
    await client.post("/api/v1/skills/", json=payload1)
    await client.post("/api/v1/skills/", json=payload2)

    response = await client.get("/api/v1/skills/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 2
    assert any(s["name"] == "React" for s in data)
    assert any(s["name"] == "MongoDB" for s in data)

async def test_get_skill_by_id(client):
    payload = {
        "name": "FastAPI",
        "color": "#009688",
        "slug": "fastapi",
        "desc": "Modern async Web framework for APIs.",
        "page": 1
    }
    create_res = await client.post("/api/v1/skills/", json=payload)
    skill_id = create_res.json()["id"]

    response = await client.get(f"/api/v1/skills/{skill_id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "FastAPI"
    assert data["slug"] == "fastapi"

async def test_get_skill_not_found(client):
    response = await client.get("/api/v1/skills/60c72b2f9b1d8e1f5c8b4567")
    assert response.status_code == status.HTTP_404_NOT_FOUND

async def test_update_skill(client):
    payload = {
        "name": "JavaScript",
        "color": "#F7DF1E",
        "slug": "js",
        "desc": "Programming language of the web.",
        "page": 1
    }
    create_res = await client.post("/api/v1/skills/", json=payload)
    skill_id = create_res.json()["id"]

    update_payload = {
        "name": "JavaScript (ES6+)",
        "color": "#F7DF1F",
        "desc": "Modern Javascript scripting.",
        "page": 2
    }
    response = await client.put(f"/api/v1/skills/{skill_id}", json=update_payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "JavaScript (ES6+)"
    assert data["color"] == "#F7DF1F"
    assert data["desc"] == "Modern Javascript scripting."
    assert data["page"] == 2
    assert data["slug"] == "js"  # Unmodified fields should be preserved

async def test_delete_skill(client):
    payload = {
        "name": "Cobol",
        "color": "#000000",
        "slug": "cobol",
        "desc": "Legacy systems coding.",
        "page": 3
    }
    create_res = await client.post("/api/v1/skills/", json=payload)
    skill_id = create_res.json()["id"]

    delete_res = await client.delete(f"/api/v1/skills/{skill_id}")
    assert delete_res.status_code == status.HTTP_204_NO_CONTENT

    get_res = await client.get(f"/api/v1/skills/{skill_id}")
    assert get_res.status_code == status.HTTP_404_NOT_FOUND
