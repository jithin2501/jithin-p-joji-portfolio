import pytest
from fastapi import status
from app.core.config import settings

async def test_superadmin_login(client):
    # Test logging in as the default Superadmin
    response = await client.post(
        "/api/v1/auth/login",
        json={"pincode": settings.ADMIN_PINCODE}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["role"] == "Superadmin"
    assert data["username"] == "admin"
    assert "access_token" in data
    assert data["token_type"] == "bearer"

async def test_login_invalid_pincode(client):
    # Test failing to login with an invalid pincode
    response = await client.post(
        "/api/v1/auth/login",
        json={"pincode": "999999"}  # Incorrect pincode
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Incorrect passcode"

async def test_create_and_login_custom_admin(client):
    # 1. Create a custom Admin user
    new_user_payload = {
        "username": "jithindev",
        "pincode": "112233"
    }
    create_response = await client.post(
        "/api/v1/auth/users",
        json=new_user_payload
    )
    assert create_response.status_code == status.HTTP_200_OK
    user_data = create_response.json()
    assert user_data["username"] == "jithindev"
    assert user_data["role"] == "Admin"
    assert user_data["status"] == "Active"
    assert "id" in user_data

    # 2. Login with the newly created custom Admin user
    login_response = await client.post(
        "/api/v1/auth/login",
        json={"pincode": "112233"}
    )
    assert login_response.status_code == status.HTTP_200_OK
    login_data = login_response.json()
    assert login_data["username"] == "jithindev"
    assert login_data["role"] == "Admin"
    assert "access_token" in login_data

async def test_create_user_validation(client):
    # Test invalid passcode formatting (must be exactly 6 digits)
    response = await client.post(
        "/api/v1/auth/users",
        json={"username": "testuser", "pincode": "123"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "exactly 6 numeric digits" in response.json()["detail"]

    # Test alphanumeric passcode failure
    response = await client.post(
        "/api/v1/auth/users",
        json={"username": "testuser", "pincode": "abcde1"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    # Test duplicate username failure
    await client.post(
        "/api/v1/auth/users",
        json={"username": "duplicate", "pincode": "654321"}
    )
    response = await client.post(
        "/api/v1/auth/users",
        json={"username": "duplicate", "pincode": "987654"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Username already taken" in response.json()["detail"]

async def test_inactive_user_login(client):
    # 1. Create custom Admin
    create_response = await client.post(
        "/api/v1/auth/users",
        json={"username": "inactivedev", "pincode": "665544"}
    )
    user_id = create_response.json()["id"]

    # 2. Toggle status to Inactive
    toggle_response = await client.put(f"/api/v1/auth/users/{user_id}/status")
    assert toggle_response.status_code == status.HTTP_200_OK
    assert toggle_response.json()["status"] == "Inactive"

    # 3. Attempt login
    login_response = await client.post(
        "/api/v1/auth/login",
        json={"pincode": "665544"}
    )
    assert login_response.status_code == status.HTTP_403_FORBIDDEN
    assert "inactive" in login_response.json()["detail"].lower()

async def test_get_users_list(client):
    # Create custom user
    await client.post(
        "/api/v1/auth/users",
        json={"username": "anotheruser", "pincode": "998877"}
    )

    response = await client.get("/api/v1/auth/users")
    assert response.status_code == status.HTTP_200_OK
    users = response.json()
    assert len(users) >= 2
    # Verify Superadmin is virtualized at index 0
    assert users[0]["username"] == "admin"
    assert users[0]["role"] == "Superadmin"
    # Verify our custom user is present
    custom_user = next((u for u in users if u["username"] == "anotheruser"), None)
    assert custom_user is not None
    assert custom_user["role"] == "Admin"

async def test_update_user_access(client):
    create_response = await client.post(
        "/api/v1/auth/users",
        json={"username": "accessuser", "pincode": "778899"}
    )
    user_id = create_response.json()["id"]

    # Update access
    new_access = "projects,skills,analytics"
    update_response = await client.put(
        f"/api/v1/auth/users/{user_id}/access",
        json={"page_access": new_access}
    )
    assert update_response.status_code == status.HTTP_200_OK
    assert update_response.json()["page_access"] == new_access

async def test_delete_user(client):
    create_response = await client.post(
        "/api/v1/auth/users",
        json={"username": "deleteduser", "pincode": "443322"}
    )
    user_id = create_response.json()["id"]

    # Delete custom user
    delete_response = await client.delete(f"/api/v1/auth/users/{user_id}")
    assert delete_response.status_code == status.HTTP_204_NO_CONTENT

    # Verify deleted from user list
    list_response = await client.get("/api/v1/auth/users")
    users = list_response.json()
    assert not any(u["id"] == user_id for u in users)
