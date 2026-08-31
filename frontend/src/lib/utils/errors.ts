export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public detail?: string | Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof ApiError) {
    if (typeof error.detail === "string") {
      return error.detail;
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export async function parseApiError(response: Response): Promise<ApiError> {
  let detail: string | Record<string, unknown> | undefined;

  try {
    const data = await response.json();
    if (typeof data.detail === "string") {
      detail = data.detail;
    } else if (Array.isArray(data.detail)) {
      detail = data.detail
        .map((item: { msg?: string }) => item.msg)
        .filter(Boolean)
        .join(", ");
    } else if (data.message) {
      detail = data.message;
    }
  } catch {
    detail = undefined;
  }

  const message =
    typeof detail === "string"
      ? detail
      : `Request failed with status ${response.status}`;

  return new ApiError(message, response.status, detail);
}
