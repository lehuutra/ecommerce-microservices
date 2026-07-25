import { NextResponse } from "next/server";

import {
  AUTH_COOKIE_MAX_AGE_SECONDS,
  AUTH_COOKIE_NAME,
} from "@/lib/auth/constants";
import {
  createBackendTimeoutSignal,
  getBackendUrl,
} from "@/lib/server/backend";
import type {
  ApiErrorResponse,
  AuthResponse,
  AuthUser,
  LoginRequest,
} from "@/types/auth";

const MAX_REQUEST_BODY_BYTES = 8 * 1024;

function errorResponse(
  status: number,
  message: string,
  errors?: Record<string, string>,
) {
  const body: ApiErrorResponse = {
    status,
    message,
    timestamp: new Date().toISOString(),
    errors,
  };

  return NextResponse.json(body, { status });
}

function isLoginRequest(value: unknown): value is LoginRequest {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const request = value as Record<string, unknown>;

  return (
    typeof request.email === "string" &&
    request.email.trim().length > 0 &&
    typeof request.password === "string" &&
    request.password.length > 0
  );
}

function isAuthResponse(value: unknown): value is AuthResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const response = value as Record<string, unknown>;

  return (
    typeof response.token === "string" &&
    response.token.length > 0 &&
    typeof response.email === "string" &&
    typeof response.fullName === "string" &&
    typeof response.role === "string"
  );
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  return response.json();
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return errorResponse(415, "Content-Type must be application/json");
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > MAX_REQUEST_BODY_BYTES) {
    return errorResponse(413, "Request body is too large");
  }

  let body: unknown;

  try {
    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BODY_BYTES) {
      return errorResponse(413, "Request body is too large");
    }

    body = JSON.parse(rawBody);
  } catch {
    return errorResponse(400, "Request body must be valid JSON");
  }

  if (!isLoginRequest(body)) {
    return errorResponse(400, "Email and password are required", {
      email: "Email must be a non-empty string",
      password: "Password must be a non-empty string",
    });
  }

  const loginRequest: LoginRequest = {
    email: body.email.trim(),
    password: body.password,
  };

  try {
    const backendResponse = await fetch(getBackendUrl("/api/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginRequest),
      cache: "no-store",
      signal: createBackendTimeoutSignal(),
    });
    const responseBody = await parseJsonResponse(backendResponse);

    if (!backendResponse.ok) {
      if (responseBody !== null) {
        return NextResponse.json(responseBody, {
          status: backendResponse.status,
        });
      }

      return errorResponse(
        backendResponse.status,
        "Authentication request failed",
      );
    }

    if (!isAuthResponse(responseBody)) {
      return errorResponse(502, "Authentication service returned invalid data");
    }

    const { token, ...user } = responseBody;
    const response = NextResponse.json<AuthUser>(user);

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
    });

    return response;
  } catch (reason) {
    if (reason instanceof DOMException && reason.name === "TimeoutError") {
      return errorResponse(504, "Authentication service timed out");
    }

    return errorResponse(502, "Authentication service is unavailable");
  }
}
