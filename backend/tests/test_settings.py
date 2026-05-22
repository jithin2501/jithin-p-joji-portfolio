import pytest
from fastapi import status

async def test_get_default_settings(client):
    # Fetch default settings from database (should return fallback values if uninitialized)
    response = await client.get("/api/v1/settings/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "hero" in data
    assert "socials" in data
    assert "projects" in data["hero"]
    assert "github" in data["socials"]

async def test_update_settings(client):
    payload = {
        "hero": {
            "projects": "25+",
            "experience": "3+ Yrs",
            "commits": "5K+",
            "satisfaction": "100%",
            "availability": "Available for Full-time hire",
            "clients": "20+"
        },
        "socials": {
            "github": "https://github.com/newuser",
            "linkedin": "https://linkedin.com/in/newuser",
            "email": "newuser@example.com",
            "phone": "+1 234 567 890",
            "location": "Seattle, WA, USA",
            "whatsapp": "https://wa.me/1234567890",
            "instagram": "https://instagram.com/newuser"
        },
        "about_image": "https://example.com/about.png"
    }

    # Update settings
    put_response = await client.put("/api/v1/settings/", json=payload)
    assert put_response.status_code == status.HTTP_200_OK
    data = put_response.json()
    assert data["hero"]["projects"] == "25+"
    assert data["hero"]["experience"] == "3+ Yrs"
    assert data["socials"]["email"] == "newuser@example.com"
    assert data["socials"]["location"] == "Seattle, WA, USA"
    assert data["about_image"] == "https://example.com/about.png"

    # Fetch again to verify persistence
    get_response = await client.get("/api/v1/settings/")
    assert get_response.status_code == status.HTTP_200_OK
    assert get_response.json()["hero"]["projects"] == "25+"
