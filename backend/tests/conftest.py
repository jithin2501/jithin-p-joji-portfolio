import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch
from mongomock_motor import AsyncMongoMockClient

from app.main import app
from app.core.database import db_instance, get_database

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test session."""
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(autouse=True)
async def mock_mongo():
    """Fixture to mock MongoDB connection and database. Runs for every test."""
    # Create the mock client and database
    mock_client = AsyncMongoMockClient()
    mock_db = mock_client["portfolio_test"]
    
    # Assign them to the global db_instance so app.core.database.get_database returns mock_db
    db_instance.client = mock_client
    db_instance.db = mock_db
    
    # Patch connect_to_mongo and close_mongo_connection to do nothing
    with patch("app.core.database.connect_to_mongo", new_callable=AsyncMock), \
         patch("app.core.database.close_mongo_connection", new_callable=AsyncMock):
        
        # Override the FastAPI dependency
        app.dependency_overrides[get_database] = lambda: mock_db
        yield mock_db
        app.dependency_overrides.clear()

@pytest.fixture
async def client():
    """Async HTTP Client fixture for invoking endpoint routes in tests."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
