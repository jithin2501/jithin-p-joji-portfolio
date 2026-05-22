import pytest
from fastapi import status

async def test_upload_and_active_fallback(client):
    # Upload first resume
    payload1 = {
        "name": "Resume 2024",
        "base64_data": "JVBERi0xLjQKJcFS..."
    }
    response1 = await client.post("/api/v1/resumes/", json=payload1)
    assert response1.status_code == status.HTTP_201_CREATED
    data1 = response1.json()
    assert data1["name"] == "Resume 2024"
    assert data1["is_active"] is True  # First resume should be active automatically
    assert "id" in data1
    resume1_id = data1["id"]

    # Upload second resume
    payload2 = {
        "name": "Resume 2025",
        "base64_data": "JVBERi0xLjQKJcFT2025..."
    }
    response2 = await client.post("/api/v1/resumes/", json=payload2)
    assert response2.status_code == status.HTTP_201_CREATED
    data2 = response2.json()
    assert data2["name"] == "Resume 2025"
    assert data2["is_active"] is False  # Subsequent resumes should not be active automatically
    resume2_id = data2["id"]

    # Verify that get_active_resume returns the active one (Resume 2024)
    active_res = await client.get("/api/v1/resumes/active")
    assert active_res.status_code == status.HTTP_200_OK
    assert active_res.json()["id"] == resume1_id
    assert active_res.json()["name"] == "Resume 2024"

async def test_activate_resume_flow(client):
    # Setup - Upload two resumes
    res1 = await client.post("/api/v1/resumes/", json={"name": "R1", "base64_data": "B1"})
    res2 = await client.post("/api/v1/resumes/", json={"name": "R2", "base64_data": "B2"})
    r1_id = res1.json()["id"]
    r2_id = res2.json()["id"]

    # Activate R2
    act_res = await client.post(f"/api/v1/resumes/{r2_id}/activate")
    assert act_res.status_code == status.HTTP_200_OK
    assert act_res.json()["is_active"] is True

    # Verify R1 is deactivated
    list_res = await client.get("/api/v1/resumes/")
    resumes = list_res.json()
    r1_meta = next(r for r in resumes if r["id"] == r1_id)
    r2_meta = next(r for r in resumes if r["id"] == r2_id)
    assert r1_meta["is_active"] is False
    assert r2_meta["is_active"] is True

    # Verify R2 is returned by active endpoint
    active_res = await client.get("/api/v1/resumes/active")
    assert active_res.json()["id"] == r2_id

async def test_delete_active_resume_activates_latest(client):
    # Upload R1 then R2
    res1 = await client.post("/api/v1/resumes/", json={"name": "Resume Old", "base64_data": "B1"})
    res2 = await client.post("/api/v1/resumes/", json={"name": "Resume New", "base64_data": "B2"})
    r1_id = res1.json()["id"]
    r2_id = res2.json()["id"]

    # Activate R1 (the old one)
    await client.post(f"/api/v1/resumes/{r1_id}/activate")

    # Delete R1
    delete_res = await client.delete(f"/api/v1/resumes/{r1_id}")
    assert delete_res.status_code == status.HTTP_204_NO_CONTENT

    # Verify R2 (the latest remaining resume) is now active
    active_res = await client.get("/api/v1/resumes/active")
    assert active_res.status_code == status.HTTP_200_OK
    assert active_res.json()["id"] == r2_id

async def test_get_resume_by_id(client):
    res = await client.post("/api/v1/resumes/", json={"name": "Specific Resume", "base64_data": "JVBERi..."})
    r_id = res.json()["id"]

    response = await client.get(f"/api/v1/resumes/{r_id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "Specific Resume"
    assert data["base64_data"] == "JVBERi..."

async def test_get_resume_not_found(client):
    response = await client.get("/api/v1/resumes/nonexistentresumeid")
    assert response.status_code == status.HTTP_404_NOT_FOUND
