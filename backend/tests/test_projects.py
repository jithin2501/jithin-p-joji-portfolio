import pytest
from fastapi import status

async def test_create_project(client):
    payload = {
        "title": "E-Commerce App",
        "subtitle": "SCALABLE ONLINE STORE",
        "description": "High performance e-commerce application.",
        "long_desc": "Built with Next.js, FastAPI and MongoDB. Uses Redis for caching.",
        "image": "https://example.com/thumbnail.jpg",
        "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
        "category": "Web Applications",
        "role": "Lead Architect",
        "duration": "3 Months",
        "completed": "Dec 2025",
        "tools": "VS Code, Git",
        "methodology": "Scrum",
        "features": [
            {"title": "Cart System", "desc": "Persistent reactive cart", "icon": "cart"}
        ],
        "tech_stack": [
            {"name": "Next.js", "icon": "nextjs"},
            {"name": "FastAPI", "icon": "fastapi"}
        ],
        "learned": "Learned Redis caching mechanisms and MongoDB schema designs.",
        "featured": "feature",
        "live_url": "https://store.example.com",
        "github_url": "https://github.com/example/store"
    }
    response = await client.post("/api/v1/projects/", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["title"] == "E-Commerce App"
    assert data["role"] == "Lead Architect"
    assert len(data["tech_stack"]) == 2
    assert "id" in data

async def test_get_all_projects(client):
    payload = {
        "title": "Project A",
        "description": "Desc A",
        "long_desc": "Long Desc A",
        "image": "imgA.jpg",
        "category": "Mobile Apps",
        "role": "iOS Developer",
        "duration": "1 Month",
        "completed": "Jan 2026",
        "tools": "Xcode",
        "methodology": "Kanban",
        "learned": "SwiftUI and async concurrency.",
        "featured": "project"
    }
    await client.post("/api/v1/projects/", json=payload)

    response = await client.get("/api/v1/projects/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 1
    assert any(p["title"] == "Project A" for p in data)

async def test_get_project_by_id(client):
    payload = {
        "title": "Project B",
        "description": "Desc B",
        "long_desc": "Long Desc B",
        "image": "imgB.jpg",
        "category": "Cloud Services",
        "role": "DevOps Engineer",
        "duration": "2 Months",
        "completed": "Feb 2026",
        "tools": "Docker, Kubernetes",
        "methodology": "CI/CD",
        "learned": "Terraform provisioning.",
        "featured": "new"
    }
    create_res = await client.post("/api/v1/projects/", json=payload)
    project_id = create_res.json()["id"]

    response = await client.get(f"/api/v1/projects/{project_id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == "Project B"
    assert data["category"] == "Cloud Services"

async def test_get_project_not_found(client):
    response = await client.get("/api/v1/projects/60c72b2f9b1d8e1f5c8b4567")
    assert response.status_code == status.HTTP_404_NOT_FOUND

async def test_update_project(client):
    payload = {
        "title": "Old Project",
        "description": "Old Desc",
        "long_desc": "Old Long Desc",
        "image": "old.jpg",
        "category": "Desktop",
        "role": "C# Developer",
        "duration": "6 Months",
        "completed": "March 2025",
        "tools": "Visual Studio",
        "methodology": "Waterfall",
        "learned": "Legacy systems migration.",
        "featured": "freelancing"
    }
    create_res = await client.post("/api/v1/projects/", json=payload)
    project_id = create_res.json()["id"]

    update_payload = {
        "title": "New Awesome Project",
        "featured": "feature",
        "role": "Senior Consultant"
    }
    response = await client.put(f"/api/v1/projects/{project_id}", json=update_payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == "New Awesome Project"
    assert data["featured"] == "feature"
    assert data["role"] == "Senior Consultant"
    assert data["category"] == "Desktop"  # Unchanged fields remain

async def test_delete_project(client):
    payload = {
        "title": "Trash Project",
        "description": "To be deleted",
        "long_desc": "Long description of trash project.",
        "image": "trash.jpg",
        "category": "Testing",
        "role": "QA Engineer",
        "duration": "1 Week",
        "completed": "April 2026",
        "tools": "Selenium",
        "methodology": "Agile",
        "learned": "How to delete projects.",
        "featured": "project"
    }
    create_res = await client.post("/api/v1/projects/", json=payload)
    project_id = create_res.json()["id"]

    delete_res = await client.delete(f"/api/v1/projects/{project_id}")
    assert delete_res.status_code == status.HTTP_204_NO_CONTENT

    get_res = await client.get(f"/api/v1/projects/{project_id}")
    assert get_res.status_code == status.HTTP_404_NOT_FOUND
