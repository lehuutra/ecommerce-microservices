import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import {
  createBackendTimeoutSignal,
  getBackendUrl,
} from "@/lib/server/backend";
import type { AuthUser } from "@/types/auth";

const isAuthUser = (value: unknown): value is AuthUser => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.email === "string" &&
    typeof user.fullName === "string" &&
    typeof user.role === "string"
  );
};

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(getBackendUrl("/api/auth/me"), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: createBackendTimeoutSignal(),
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      return null;
    }

    const user: unknown = await response.json();
    return isAuthUser(user) ? user : null;
  } catch {
    return null;
  }
});
