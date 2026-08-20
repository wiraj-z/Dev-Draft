import pytest

import models
from auth import create_access_token, hash_password


@pytest.mark.asyncio
async def test_create_post_and_list(client, db_session):
    # create user
    user = models.User(username="carol", email="carol@example.com", password_hash=hash_password("pass"))
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    headers = {"Authorization": f"Bearer {token}"}

    # create post
    resp = await client.post("/api/posts", json={"title": "Hello", "content": "World"}, headers=headers)
    assert resp.status_code == 201
    post = resp.json()
    assert post["title"] == "Hello"

    # list posts
    resp = await client.get("/api/posts")
    assert resp.status_code == 200
    body = resp.json()
    assert body["total"] >= 1