import pytest
from httpx import AsyncClient

from conftest import auth_headers, create_user

pytestmark = pytest.mark.anyio


# ── Helpers ───────────────────────────────────────────────────────────────────


async def create_post(
    client: AsyncClient, headers: dict, title="Test Post", content="Some content"
):
    resp = await client.post(
        "/api/posts", json={"title": title, "content": content}, headers=headers
    )
    return resp


# ── Get posts ─────────────────────────────────────────────────────────────────


async def test_get_posts_empty(client: AsyncClient):
    resp = await client.get("/api/posts")
    assert resp.status_code == 200
    data = resp.json()
    assert data["posts"] == []
    assert data["total"] == 0
    assert data["has_more"] is False


async def test_get_posts_pagination(client: AsyncClient):
    await create_user(client)
    headers = await auth_headers(client)
    for i in range(5):
        await create_post(client, headers, title=f"Post {i}")

    resp = await client.get("/api/posts?skip=0&limit=3")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["posts"]) == 3
    assert data["total"] == 5
    assert data["has_more"] is True

    resp2 = await client.get("/api/posts?skip=3&limit=3")
    data2 = resp2.json()
    assert len(data2["posts"]) == 2
    assert data2["has_more"] is False


async def test_get_posts_invalid_params(client: AsyncClient):
    resp = await client.get("/api/posts?skip=-1")
    assert resp.status_code == 422

    resp2 = await client.get("/api/posts?limit=0")
    assert resp2.status_code == 422

    resp3 = await client.get("/api/posts?limit=101")
    assert resp3.status_code == 422




# ── Create post ───────────────────────────────────────────────────────────────


async def test_create_post_success(client: AsyncClient):
    await create_user(client)
    headers = await auth_headers(client)
    resp = await create_post(client, headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Test Post"
    assert data["content"] == "Some content"
    assert "author" in data
    assert data["author"]["username"] == "testuser"


async def test_create_post_unauthenticated(client: AsyncClient):
    resp = await client.post("/api/posts", json={"title": "No auth", "content": "body"})
    assert resp.status_code == 401


async def test_create_post_missing_fields(client: AsyncClient):
    await create_user(client)
    headers = await auth_headers(client)
    resp = await client.post(
        "/api/posts", json={"title": "No content"}, headers=headers
    )
    assert resp.status_code == 422


# ── Get single post ───────────────────────────────────────────────────────────


async def test_get_post_success(client: AsyncClient):
    await create_user(client)
    headers = await auth_headers(client)
    created = await create_post(client, headers)
    post_id = created.json()["id"]

    resp = await client.get(f"/api/posts/{post_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == post_id


async def test_get_post_not_found(client: AsyncClient):
    resp = await client.get("/api/posts/9999")
    assert resp.status_code == 404


# ── Update post (PUT) ─────────────────────────────────────────────────────────


async def test_update_post_full(client: AsyncClient):
    await create_user(client)
    headers = await auth_headers(client)
    created = await create_post(client, headers)
    post_id = created.json()["id"]

    resp = await client.put(
        f"/api/posts/{post_id}",
        json={
            "title": "Updated Title",
            "content": "Updated content",
        },
        headers=headers,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "Updated Title"
    assert data["content"] == "Updated content"


async def test_update_post_not_found(client: AsyncClient):
    await create_user(client)
    headers = await auth_headers(client)
    resp = await client.put(
        "/api/posts/9999", json={"title": "X", "content": "Y"}, headers=headers
    )
    assert resp.status_code == 404


async def test_update_post_forbidden(client: AsyncClient):
    """User A cannot update User B's post."""
    await create_user(client, username="userA", email="a@example.com")
    await create_user(client, username="userB", email="b@example.com")

    headers_b = await auth_headers(client, email="b@example.com")
    created = await create_post(client, headers_b, title="B's post")
    post_id = created.json()["id"]

    headers_a = await auth_headers(client, email="a@example.com")
    resp = await client.put(
        f"/api/posts/{post_id}",
        json={"title": "Hijacked", "content": "hacked"},
        headers=headers_a,
    )
    assert resp.status_code == 403


async def test_update_post_unauthenticated(client: AsyncClient):
    await create_user(client)
    headers = await auth_headers(client)
    created = await create_post(client, headers)
    post_id = created.json()["id"]

    resp = await client.put(
        f"/api/posts/{post_id}", json={"title": "X", "content": "Y"}
    )
    assert resp.status_code == 401


# ── Partial update (PATCH) ────────────────────────────────────────────────────


async def test_patch_post_title_only(client: AsyncClient):
    await create_user(client)
    headers = await auth_headers(client)
    created = await create_post(
        client, headers, title="Original", content="Original content"
    )
    post_id = created.json()["id"]

    resp = await client.patch(
        f"/api/posts/{post_id}", json={"title": "New Title"}, headers=headers
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "New Title"
    assert data["content"] == "Original content"  # unchanged


async def test_patch_post_forbidden(client: AsyncClient):
    await create_user(client, username="userA", email="a@example.com")
    await create_user(client, username="userB", email="b@example.com")

    headers_b = await auth_headers(client, email="b@example.com")
    created = await create_post(client, headers_b)
    post_id = created.json()["id"]

    headers_a = await auth_headers(client, email="a@example.com")
    resp = await client.patch(
        f"/api/posts/{post_id}", json={"title": "Hijacked"}, headers=headers_a
    )
    assert resp.status_code == 403


# ── Delete post ───────────────────────────────────────────────────────────────


async def test_delete_post_success(client: AsyncClient):
    await create_user(client)
    headers = await auth_headers(client)
    created = await create_post(client, headers)
    post_id = created.json()["id"]

    resp = await client.delete(f"/api/posts/{post_id}", headers=headers)
    assert resp.status_code == 204

    # confirm it's gone
    resp2 = await client.get(f"/api/posts/{post_id}")
    assert resp2.status_code == 404


async def test_delete_post_not_found(client: AsyncClient):
    await create_user(client)
    headers = await auth_headers(client)
    resp = await client.delete("/api/posts/9999", headers=headers)
    assert resp.status_code == 404


async def test_delete_post_forbidden(client: AsyncClient):
    await create_user(client, username="userA", email="a@example.com")
    await create_user(client, username="userB", email="b@example.com")

    headers_b = await auth_headers(client, email="b@example.com")
    created = await create_post(client, headers_b)
    post_id = created.json()["id"]

    headers_a = await auth_headers(client, email="a@example.com")
    resp = await client.delete(f"/api/posts/{post_id}", headers=headers_a)
    assert resp.status_code == 403


async def test_delete_post_unauthenticated(client: AsyncClient):
    await create_user(client)
    headers = await auth_headers(client)
    created = await create_post(client, headers)
    post_id = created.json()["id"]

    resp = await client.delete(f"/api/posts/{post_id}")
    assert resp.status_code == 401
