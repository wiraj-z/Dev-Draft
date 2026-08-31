import type {
  PaginatedPosts,
  Post,
  PostCreateData,
  PostsQueryParams,
  PostUpdateData,
} from "@/types/blog";
import { apiRequest, serverApiRequest } from "./client";

function buildPostsQuery(params: PostsQueryParams = {}): string {
  const searchParams = new URLSearchParams();
  if (params.skip !== undefined) {
    searchParams.set("skip", String(params.skip));
  }
  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getPosts(
  params?: PostsQueryParams,
): Promise<PaginatedPosts> {
  return serverApiRequest<PaginatedPosts>(
    `/api/posts${buildPostsQuery(params)}`,
  );
}

export async function getPost(id: number): Promise<Post> {
  return serverApiRequest<Post>(`/api/posts/${id}`);
}

export async function createPost(
  data: PostCreateData,
  token: string,
): Promise<Post> {
  return apiRequest<Post>("/api/posts", {
    method: "POST",
    body: data,
    token,
  });
}

export async function updatePost(
  id: number,
  data: PostUpdateData,
  token: string,
): Promise<Post> {
  return apiRequest<Post>(`/api/posts/${id}`, {
    method: "PATCH",
    body: data,
    token,
  });
}

export async function replacePost(
  id: number,
  data: PostCreateData,
  token: string,
): Promise<Post> {
  return apiRequest<Post>(`/api/posts/${id}`, {
    method: "PUT",
    body: data,
    token,
  });
}

export async function deletePost(id: number, token: string): Promise<void> {
  return apiRequest<void>(`/api/posts/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function getUserPosts(userId: number): Promise<Post[]> {
  return serverApiRequest<Post[]>(`/api/users/${userId}/posts`);
}
