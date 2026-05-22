import pytest
from fastapi import status

async def test_create_experience(client):
    payload = {
        "title": "Software Engineer",
        "company": "Tech Corp",
        "date_from": "Jan 2022",
        "date_to": "Present",
        "desc": "Developing core features and systems.",
        "tags": ["Python", "FastAPI", "React"],
        "location": "San Francisco, CA",
        "dot_color": "#2196F3"
    }
    response = await client.post("/api/v1/experiences/", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["title"] == "Software Engineer"
    assert data["company"] == "Tech Corp"
    assert data["tags"] == ["Python", "FastAPI", "React"]
    assert "id" in data

async def test_get_all_experiences(client):
    payload1 = {
        "title": "Developer",
        "company": "Company A",
        "date_from": "2020",
        "date_to": "2021",
        "desc": "Maintained client codebases.",
        "tags": ["JS", "CSS"],
        "location": "Boston, MA",
        "dot_color": "#4CAF50"
    }
    payload2 = {
        "title": "Intern",
        "company": "Company B",
        "date_from": "2019",
        "date_to": "2020",
        "desc": "Built prototypes.",
        "tags": ["HTML"],
        "location": "Remote",
        "dot_color": "#FFC107"
    }
    await client.post("/api/v1/experiences/", json=payload1)
    await client.post("/api/v1/experiences/", json=payload2)

    response = await client.get("/api/v1/experiences/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 2
    assert any(e["company"] == "Company A" for e in data)
    assert any(e["company"] == "Company B" for e in data)

async def test_get_experience_by_id(client):
    payload = {
        "title": "CTO",
        "company": "Startup Inc",
        "date_from": "2023",
        "date_to": "2025",
        "desc": "Scaling team and product.",
        "tags": ["Architecture", "Leadership"],
        "location": "Seattle, WA",
        "dot_color": "#9C27B0"
    }
    create_res = await client.post("/api/v1/experiences/", json=payload)
    exp_id = create_res.json()["id"]

    response = await client.get(f"/api/v1/experiences/{exp_id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == "CTO"
    assert data["company"] == "Startup Inc"

async def test_get_experience_not_found(client):
    response = await client.get("/api/v1/experiences/60c72b2f9b1d8e1f5c8b4567")
    assert response.status_code == status.HTTP_404_NOT_FOUND

async def test_update_experience(client):
    payload = {
        "title": "Junior Developer",
        "company": "Enterprise Ltd",
        "date_from": "2021",
        "date_to": "2022",
        "desc": "Fixing bugs.",
        "tags": ["Java"],
        "location": "London, UK",
        "dot_color": "#E91E63"
    }
    create_res = await client.post("/api/v1/experiences/", json=payload)
    exp_id = create_res.json()["id"]

    update_payload = {
        "title": "Regular Developer",
        "dot_color": "#9E9E9E",
        "tags": ["Java", "Spring Boot"]
    }
    response = await client.put(f"/api/v1/experiences/{exp_id}", json=update_payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == "Regular Developer"
    assert data["dot_color"] == "#9E9E9E"
    assert data["tags"] == ["Java", "Spring Boot"]
    assert data["company"] == "Enterprise Ltd"  # Unchanged remains

async def test_delete_experience(client):
    payload = {
        "title": "Temp Role",
        "company": "Temp Corp",
        "date_from": "2020",
        "date_to": "2020",
        "desc": "Short task.",
        "tags": ["None"],
        "location": "Office",
        "dot_color": "#000000"
    }
    create_res = await client.post("/api/v1/experiences/", json=payload)
    exp_id = create_res.json()["id"]

    delete_res = await client.delete(f"/api/v1/experiences/{exp_id}")
    assert delete_res.status_code == status.HTTP_204_NO_CONTENT

    get_res = await client.get(f"/api/v1/experiences/{exp_id}")
    assert get_res.status_code == status.HTTP_404_NOT_FOUND
