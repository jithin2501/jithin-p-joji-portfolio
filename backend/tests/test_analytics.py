import pytest
from fastapi import status

async def test_track_visit(client):
    payload = {
        "userId": "user-12345",
        "path": "/home",
        "ip": "8.8.8.8",
        "city": "Mountain View",
        "country": "United States",
        "latitude": 37.422,
        "longitude": -122.084,
        "userAgent": "Mozilla/5.0"
    }
    response = await client.post("/api/v1/analytics/track", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["userId"] == "user-12345"
    assert data["path"] == "/home"
    assert data["ip"] == "8.8.8.8"
    assert data["city"] == "Mountain View"
    assert "id" in data
    assert "createdAt" in data

async def test_get_all_visits(client):
    # Track some visits
    await client.post("/api/v1/analytics/track", json={"userId": "u1", "path": "/page1"})
    await client.post("/api/v1/analytics/track", json={"userId": "u2", "path": "/page2"})

    response = await client.get("/api/v1/analytics/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 2
    assert any(v["userId"] == "u1" for v in data)
    assert any(v["userId"] == "u2" for v in data)

async def test_analytics_stats(client):
    # Setup - clear first to have clean stats
    await client.delete("/api/v1/analytics/clear")

    # Track distinct visits
    visits = [
        {"userId": "u1", "path": "/projects", "country": "USA"},
        {"userId": "u1", "path": "/projects", "country": "USA"},
        {"userId": "u2", "path": "/skills", "country": "India"},
        {"userId": "u3", "path": "/about", "country": "Germany"}
    ]
    for v in visits:
        await client.post("/api/v1/analytics/track", json=v)

    # Fetch stats
    response = await client.get("/api/v1/analytics/stats")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    assert data["totalVisits"] == 4
    assert data["uniqueUsers"] == 3
    
    # Verify top paths aggregation
    top_paths = {p["path"]: p["count"] for p in data["topPaths"]}
    assert "/projects" in top_paths
    assert top_paths["/projects"] == 2
    
    # Verify top countries aggregation
    top_countries = {c["country"]: c["count"] for c in data["topCountries"]}
    assert "USA" in top_countries
    assert top_countries["USA"] == 2
    assert "India" in top_countries
    assert top_countries["India"] == 1

async def test_clear_analytics(client):
    # Track a visit
    await client.post("/api/v1/analytics/track", json={"userId": "temp", "path": "/temp"})

    # Clear analytics
    clear_response = await client.delete("/api/v1/analytics/clear")
    assert clear_response.status_code == status.HTTP_200_OK
    assert "cleared successfully" in clear_response.json()["message"]

    # Verify no visits remain
    get_response = await client.get("/api/v1/analytics/")
    assert len(get_response.json()) == 0
