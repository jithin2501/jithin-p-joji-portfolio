import pytest
from fastapi import status

async def test_create_contact_submission(client):
    payload = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "subject": "Inquiry about Portfolio",
        "message": "Hi, I love your website. Let's work together!"
    }
    response = await client.post("/api/v1/contacts/", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["name"] == "Jane Doe"
    assert data["email"] == "jane@example.com"
    assert "id" in data
    assert "createdAt" in data

async def test_get_all_contacts(client):
    payload1 = {
        "name": "User 1",
        "email": "user1@example.com",
        "subject": "Subject 1",
        "message": "Hello from user 1"
    }
    payload2 = {
        "name": "User 2",
        "email": "user2@example.com",
        "subject": "Subject 2",
        "message": "Hello from user 2"
    }
    await client.post("/api/v1/contacts/", json=payload1)
    await client.post("/api/v1/contacts/", json=payload2)

    response = await client.get("/api/v1/contacts/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 2
    assert any(c["name"] == "User 1" for c in data)
    assert any(c["name"] == "User 2" for c in data)

async def test_delete_contact_message(client):
    payload = {
        "name": "Spam User",
        "email": "spam@example.com",
        "subject": "Crypto Offers",
        "message": "Get rich quick!"
    }
    create_res = await client.post("/api/v1/contacts/", json=payload)
    contact_id = create_res.json()["id"]

    delete_res = await client.delete(f"/api/v1/contacts/{contact_id}")
    assert delete_res.status_code == status.HTTP_204_NO_CONTENT

    # Verify deleted by listing all
    list_res = await client.get("/api/v1/contacts/")
    assert not any(c["id"] == contact_id for c in list_res.json())

async def test_delete_contact_not_found(client):
    response = await client.delete("/api/v1/contacts/60c72b2f9b1d8e1f5c8b4567")
    assert response.status_code == status.HTTP_404_NOT_FOUND
