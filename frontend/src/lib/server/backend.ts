import "server-only";

import type { ApiErrorResponse } from "@/types/auth";

const BACKEND_REQUEST_TIMEOUT_MS = 10_000;

export class BackendRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors?: Record<string, string> | null,
  ) {
    super(message);
    this.name = "BackendRequestError";
  }
}

export const getBackendUrl = (path: string): URL => {
  const baseUrl = process.env.BACKEND_API_URL;

  if (!baseUrl) {
    throw new Error("BACKEND_API_URL is not configured");
  }

  const url = new URL(path, baseUrl);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("BACKEND_API_URL must use HTTP or HTTPS");
  }

  return url;
};

export const createBackendTimeoutSignal = (): AbortSignal =>
  AbortSignal.timeout(BACKEND_REQUEST_TIMEOUT_MS);

export const readJsonResponse = async (
  response: Response,
): Promise<unknown> => {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  return response.json();
};

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const error = value as Record<string, unknown>;
  return (
    typeof error.status === "number" &&
    typeof error.message === "string" &&
    typeof error.timestamp === "string"
  );
};

export const requestBackend = async <T,>(
  path: string,
  init: RequestInit = {},
  token?: string,
): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(getBackendUrl(path), {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
      cache: init.cache ?? "no-store",
      signal: init.signal ?? createBackendTimeoutSignal(),
    });
  } catch (reason) {
    if (reason instanceof DOMException && reason.name === "TimeoutError") {
      throw new BackendRequestError(504, "The backend request timed out");
    }

    throw new BackendRequestError(502, "The backend service is unavailable");
  }

  const responseBody = await readJsonResponse(response);

  if (!response.ok) {
    if (isApiErrorResponse(responseBody)) {
      throw new BackendRequestError(
        response.status,
        responseBody.message,
        responseBody.errors,
      );
    }

    throw new BackendRequestError(
      response.status,
      `Backend request failed with status ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (responseBody === null) {
    throw new BackendRequestError(502, "The backend returned invalid data");
  }

  return responseBody as T;
};
