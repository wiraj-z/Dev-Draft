import { authConfig } from "@/config/auth";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(authConfig.tokenStorageKey);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(authConfig.tokenStorageKey, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(authConfig.tokenStorageKey);
}
