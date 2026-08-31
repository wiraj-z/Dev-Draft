import type {
  ChangePasswordData,
  ForgotPasswordData,
  LoginCredentials,
  MessageResponse,
  RegisterData,
  ResetPasswordData,
  TokenResponse,
} from "@/types/auth";
import type { UserPrivate } from "@/types/user";
import { apiRequest } from "./client";

export async function login(credentials: LoginCredentials): Promise<TokenResponse> {
  const formData = new URLSearchParams();
  formData.set("username", credentials.email);
  formData.set("password", credentials.password);

  return apiRequest<TokenResponse>("/api/users/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });
}

export async function register(data: RegisterData): Promise<UserPrivate> {
  return apiRequest<UserPrivate>("/api/users", {
    method: "POST",
    body: data,
  });
}

export async function getCurrentUser(token: string): Promise<UserPrivate> {
  return apiRequest<UserPrivate>("/api/users/me", { token });
}

export async function forgotPassword(
  data: ForgotPasswordData,
): Promise<MessageResponse> {
  return apiRequest<MessageResponse>("/api/users/forgot-password", {
    method: "POST",
    body: data,
  });
}

export async function resetPassword(
  data: ResetPasswordData,
): Promise<MessageResponse> {
  return apiRequest<MessageResponse>("/api/users/reset-password", {
    method: "POST",
    body: data,
  });
}

export async function changePassword(
  data: ChangePasswordData,
  token: string,
): Promise<MessageResponse> {
  return apiRequest<MessageResponse>("/api/users/me/password", {
    method: "PATCH",
    body: data,
    token,
  });
}
