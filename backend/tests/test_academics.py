import pytest
from fastapi import status

async def test_create_academic_record(client):
    payload = {
        "title": "Bachelor of Technology",
        "school": "State University",
        "location": "New York, USA",
        "date_range": "2020 - 2024",
        "score": "3.8/4.0",
        "color_theme": "blue",
        "icon_type": "graduation-cap"
    }
    response = await client.post("/api/v1/academics/", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["school"] == payload["school"]
    assert "id" in data

async def test_get_all_academics(client):
    # Setup - Create two academic records
    payload1 = {
        "title": "School Degree",
        "school": "High School",
        "location": "Boston, USA",
        "date_range": "2016 - 2020",
        "score": "95%",
        "color_theme": "green",
        "icon_type": "book"
    }
    payload2 = {
        "title": "College Degree",
        "school": "Community College",
        "location": "Boston, USA",
        "date_range": "2020 - 2022",
        "score": "3.9 GPA",
        "color_theme": "purple",
        "icon_type": "award"
    }
    await client.post("/api/v1/academics/", json=payload1)
    await client.post("/api/v1/academics/", json=payload2)

    response = await client.get("/api/v1/academics/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 2
    assert any(item["title"] == "School Degree" for item in data)
    assert any(item["title"] == "College Degree" for item in data)

async def test_get_academic_by_id(client):
    payload = {
        "title": "Ph.D. in Computer Science",
        "school": "MIT",
        "location": "Cambridge, USA",
        "date_range": "2024 - 2028",
        "score": "4.0/4.0",
        "color_theme": "red",
        "icon_type": "microscope"
    }
    create_res = await client.post("/api/v1/academics/", json=payload)
    acad_id = create_res.json()["id"]

    response = await client.get(f"/api/v1/academics/{acad_id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == "Ph.D. in Computer Science"
    assert data["school"] == "MIT"

async def test_get_academic_by_invalid_or_missing_id(client):
    # Invalid BSON ObjectId format
    response = await client.get("/api/v1/academics/invalidid123")
    assert response.status_code == status.HTTP_404_NOT_FOUND

    # Valid BSON format but missing
    response = await client.get("/api/v1/academics/60c72b2f9b1d8e1f5c8b4567")
    assert response.status_code == status.HTTP_404_NOT_FOUND

async def test_update_academic_record(client):
    payload = {
        "title": "Associate Degree",
        "school": "Local College",
        "location": "Miami, USA",
        "date_range": "2018 - 2020",
        "score": "3.5",
        "color_theme": "yellow",
        "icon_type": "certificate"
    }
    create_res = await client.post("/api/v1/academics/", json=payload)
    acad_id = create_res.json()["id"]

    update_payload = {
        "title": "Associate Degree in Business",
        "school": "Miami Dade College",
        "score": "3.75",
        "color_theme": "orange"
    }
    response = await client.put(f"/api/v1/academics/{acad_id}", json=update_payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == "Associate Degree in Business"
    assert data["school"] == "Miami Dade College"
    assert data["score"] == "3.75"
    assert data["color_theme"] == "orange"
    assert data["location"] == "Miami, USA"  # Unchanged fields remain

async def test_delete_academic_record(client):
    payload = {
        "title": "Short Course",
        "school": "Online Academy",
        "location": "Remote",
        "date_range": "2023",
        "score": "Pass",
        "color_theme": "grey",
        "icon_type": "laptop"
    }
    create_res = await client.post("/api/v1/academics/", json=payload)
    acad_id = create_res.json()["id"]

    delete_res = await client.delete(f"/api/v1/academics/{acad_id}")
    assert delete_res.status_code == status.HTTP_204_NO_CONTENT

    get_res = await client.get(f"/api/v1/academics/{acad_id}")
    assert get_res.status_code == status.HTTP_404_NOT_FOUND

async def test_academic_settings(client):
    # Retrieve default academic page settings
    get_res = await client.get("/api/v1/academics/settings")
    assert get_res.status_code == status.HTTP_200_OK
    settings = get_res.json()
    assert "highlights" in settings
    assert "stat1_label" in settings

    # Update settings
    updated_settings = {
        "description": "Custom Academics Description",
        "highlights": ["Honor Society", "Graduated Magna Cum Laude"],
        "stat1_label": "B.Tech GPA",
        "stat1_value": "9.2",
        "stat2_label": "12th Board",
        "stat2_value": "95%",
        "stat3_label": "10th Board",
        "stat3_value": "92%"
    }
    put_res = await client.put("/api/v1/academics/settings", json=updated_settings)
    assert put_res.status_code == status.HTTP_200_OK
    data = put_res.json()
    assert data["description"] == "Custom Academics Description"
    assert "Graduated Magna Cum Laude" in data["highlights"]
    assert data["stat1_value"] == "9.2"
