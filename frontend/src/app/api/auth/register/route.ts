import { NextResponse } from "next/server";

import {
  AUTH_COOKIE_MAX_AGE_SECONDS,
  AUTH_COOKIE_NAME,
} from "@/lib/auth/constants";
import {
  BackendRequestError,
  requestBackend,
} from "@/lib/server/backend";
import type {
  ApiErrorResponse,
  AuthResponse,
  AuthUser,
  RegisterRequest,
} from "@/types/auth";

const MAX_REQUEST_BODY_BYTES = 8 * 1024;

const errorResponse = (
  status: number,
  message: string,
  errors?: Record<string, string>,
) => {
  const body: ApiErrorResponse = {
    status,
    message,
    timestamp: new Date().toISOString(),
    errors,
  };

  return NextResponse.json(body, { status });
};

const isRegisterRequest = (value: unknown): value is RegisterRequest => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const request = value as Record<string, unknown>;
  return (
    typeof request.fullName === "string" &&
    request.fullName.trim().length > 0 &&
    typeof request.email === "string" &&
    request.email.trim().length > 0 &&
    typeof request.password === "string" &&
    request.password.length >= 6
  );
};

export const POST = async (request: Request) => {
  if (!request.headers.get("content-type")?.includes("application/json")) {
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

  if (!isRegisterRequest(body)) {
    return errorResponse(400, "Please complete all required fields", {
      fullName: "Full name is required",
      email: "A valid email is required",
      password: "Password must be at least 6 characters",
    });
  }

  const registerRequest: RegisterRequest = {
    fullName: body.fullName.trim(),
    email: body.email.trim(),
    password: body.password,
  };

  try {
    const auth = await requestBackend<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(registerRequest),
    });

    if (!auth.token || !auth.email || !auth.fullName || !auth.role) {
      return errorResponse(502, "Authentication service returned invalid data");
    }

    const user: AuthUser = {
      email: auth.email,
      fullName: auth.fullName,
      role: auth.role,
    };
    const response = NextResponse.json(user);
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: auth.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
    });

    return response;
  } catch (reason) {
    if (reason instanceof BackendRequestError) {
      return errorResponse(reason.status, reason.message, reason.errors ?? undefined);
    }

    return errorResponse(500, "Unable to create your account");
  }
};
