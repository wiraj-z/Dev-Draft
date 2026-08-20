import pytest
from sqlalchemy import select

import models
from auth import hash_password


@pytest.mark.asyncio
async def test_create_user_and_login(client):
    resp = await client.post(
        "/api/users",
        json={
            "username": "alice",
            "email": "alice@example.com",
            "password": "password123",
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["username"] == "alice"

    # login
    resp = await client.post(
        "/api/users/token",
        data={"username": "alice@example.com", "password": "password123"},
    )
    assert resp.status_code == 200
    token = resp.json()["access_token"]

    # get current user
    headers = {"Authorization": f"Bearer {token}"}
    resp = await client.get("/api/users/me", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["email"] == "alice@example.com"


@pytest.mark.asyncio
async def test_forgot_password_creates_token(client, db_session):
    # create user directly in DB
    user = models.User(
        username="bob", email="bob@example.com", password_hash=hash_password("pw")
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    resp = await client.post(
        "/api/users/forgot-password", json={"email": "bob@example.com"}
    )
    assert resp.status_code == 202

    res = await db_session.execute(
        select(models.PasswordResetToken).where(
            models.PasswordResetToken.user_id == user.id
        )
    )
    token = res.scalars().first()
    assert token is not None
