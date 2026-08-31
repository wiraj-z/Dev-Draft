import type { Post } from "@/types/blog";
import type { UserPrivate, UserPublic, UserUpdateData } from "@/types/user";
import { apiRequest, serverApiRequest } from "./client";

export async function getUser(userId: number): Promise<UserPublic> {
  return serverApiRequest<UserPublic>(`/api/users/${userId}`);
}

export async function updateUser(
  userId: number,
  data: UserUpdateData,
  token: string,
): Promise<UserPrivate> {
  return apiRequest<UserPrivate>(`/api/users/${userId}`, {
    method: "PATCH",
    body: data,
    token,
  });
}

export async function deleteUser(userId: number, token: string): Promise<void> {
  return apiRequest<void>(`/api/users/${userId}`, {
    method: "DELETE",
    token,
  });
}

export async function uploadProfilePicture(
  userId: number,
  file: File,
  token: string,
): Promise<UserPrivate> {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest<UserPrivate>(`/api/users/${userId}/picture`, {
    method: "PATCH",
    formData,
    token,
  });
}

export async function deleteProfilePicture(
  userId: number,
  token: string,
): Promise<UserPrivate> {
  return apiRequest<UserPrivate>(`/api/users/${userId}/picture`, {
    method: "DELETE",
    token,
  });
}

export async function getUserPosts(userId: number): Promise<Post[]> {
  return serverApiRequest<Post[]>(`/api/users/${userId}/posts`);
}
