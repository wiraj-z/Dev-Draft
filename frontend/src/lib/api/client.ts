import { env } from "@/config/env";
import { parseApiError } from "@/lib/utils/errors";

export type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  headers?: HeadersInit;
  formData?: FormData;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token, headers = {}, formData } = options;

  const requestHeaders = new Headers(headers);

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  let requestBody: BodyInit | undefined;

  if (formData) {
    requestBody = formData;
  } else if (body !== undefined) {
    if (!requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }
    requestBody = typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await fetch(`${env.apiUrl}${path}`, {
    method,
    headers: requestHeaders,
    body: requestBody,
    cache: "no-store",
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function serverApiRequest<T>(
  path: string,
  options: Omit<RequestOptions, "token"> = {},
): Promise<T> {
  return apiRequest<T>(path, options);
}
