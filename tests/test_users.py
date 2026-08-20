import pytest
from conftest import auth_headers, create_user, get_token
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


# ── Registration ──────────────────────────────────────────────────────────────


async def test_register_success(client: AsyncClient):
    resp = await create_user(client)
    assert resp.status_code == 201
    data = resp.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert "password" not in data  # never expose passwords
    assert "password_hash" not in data


async def test_register_duplicate_username(client: AsyncClient):
    await create_user(client)
    resp = await create_user(client, email="other@example.com")  # same username
    assert resp.status_code == 400
    assert "username" in resp.json()["detail"].lower()


async def test_register_duplicate_email(client: AsyncClient):
    await create_user(client)
    resp = await create_user(client, username="otheruser")  # same email
    assert resp.status_code == 400
    assert "email" in resp.json()["detail"].lower()


async def test_register_missing_fields(client: AsyncClient):
    resp = await client.post("/api/users", json={"username": "onlyname"})
    assert resp.status_code == 422


# ── Login ─────────────────────────────────────────────────────────────────────


async def test_login_success(client: AsyncClient):
    await create_user(client)
    resp = await client.post(
        "/api/users/token",
        data={
            "username": "test@example.com",
            "password": "password123",
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


async def test_login_wrong_password(client: AsyncClient):
    await create_user(client)
    resp = await client.post(
        "/api/users/token",
        data={
            "username": "test@example.com",
            "password": "wrongpassword",
        },
    )
    assert resp.status_code == 401


async def test_login_nonexistent_user(client: AsyncClient):
    resp = await client.post(
        "/api/users/token",
        data={
            "username": "nobody@example.com",
            "password": "password123",
        },
    )
    assert resp.status_code == 401


# ── /me ───────────────────────────────────────────────────────────────────────


async def test_get_me(client: AsyncClient):
    await create_user(client)
    headers = await auth_headers(client)
    resp = await client.get("/api/users/me", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["email"] == "test@example.com"


async def test_get_me_no_token(client: AsyncClient):
    resp = await client.get("/api/users/me")
    assert resp.status_code == 401


# ── Get user by ID ────────────────────────────────────────────────────────────


async def test_get_user_by_id(client: AsyncClient):
    created = await create_user(client)
    user_id = created.json()["id"]
    resp = await client.get(f"/api/users/{user_id}")
    assert resp.status_code == 200
    assert resp.json()["username"] == "testuser"


async def test_get_user_not_found(client: AsyncClient):
    resp = await client.get("/api/users/9999")
    assert resp.status_code == 404


# ── Update user ───────────────────────────────────────────────────────────────


async def test_update_user_username(client: AsyncClient):
    created = await create_user(client)
    user_id = created.json()["id"]
    headers = await auth_headers(client)
    resp = await client.patch(
        f"/api/users/{user_id}", json={"username": "newname"}, headers=headers
    )
    assert resp.status_code == 200
    assert resp.json()["username"] == "newname"


async def test_update_user_forbidden(client: AsyncClient):
    """User A cannot update User B."""
    await create_user(client, username="userA", email="a@example.com")
    created_b = await create_user(client, username="userB", email="b@example.com")
    user_b_id = created_b.json()["id"]

    headers = await auth_headers(client, email="a@example.com")
    resp = await client.patch(
        f"/api/users/{user_b_id}", json={"username": "hacked"}, headers=headers
    )
    assert resp.status_code == 403


async def test_update_user_duplicate_username(client: AsyncClient):
    created = await create_user(client)
    user_id = created.json()["id"]
    await create_user(client, username="taken", email="taken@example.com")

    headers = await auth_headers(client)
    resp = await client.patch(
        f"/api/users/{user_id}", json={"username": "taken"}, headers=headers
    )
    assert resp.status_code == 400


# ── Delete user ───────────────────────────────────────────────────────────────


async def test_delete_user(client: AsyncClient):
    created = await create_user(client)
    user_id = created.json()["id"]
    headers = await auth_headers(client)
    resp = await client.delete(f"/api/users/{user_id}", headers=headers)
    assert resp.status_code == 204


async def test_delete_user_forbidden(client: AsyncClient):
    await create_user(client, username="userA", email="a@example.com")
    created_b = await create_user(client, username="userB", email="b@example.com")
    user_b_id = created_b.json()["id"]

    headers = await auth_headers(client, email="a@example.com")
    resp = await client.delete(f"/api/users/{user_b_id}", headers=headers)
    assert resp.status_code == 403


# ── Change password ───────────────────────────────────────────────────────────


async def test_change_password_success(client: AsyncClient):
    await create_user(client)
    headers = await auth_headers(client)
    resp = await client.patch(
        "/api/users/me/password",
        json={
            "current_password": "password123",
            "new_password": "newpassword456",
        },
        headers=headers,
    )
    assert resp.status_code == 200

    # old password no longer works
    resp2 = await client.post(
        "/api/users/token",
        data={
            "username": "test@example.com",
            "password": "password123",
        },
    )
    assert resp2.status_code == 401


async def test_change_password_wrong_current(client: AsyncClient):
    await create_user(client)
    headers = await auth_headers(client)
    resp = await client.patch(
        "/api/users/me/password",
        json={
            "current_password": "wrongpassword",
            "new_password": "newpassword456",
        },
        headers=headers,
    )
    assert resp.status_code == 400


# ── User posts ────────────────────────────────────────────────────────────────


async def test_get_user_posts_empty(client: AsyncClient):
    created = await create_user(client)
    user_id = created.json()["id"]
    resp = await client.get(f"/api/users/{user_id}/posts")
    assert resp.status_code == 200
    assert resp.json() == []


async def test_get_user_posts_not_found(client: AsyncClient):
    resp = await client.get("/api/users/9999/posts")
    assert resp.status_code == 404
