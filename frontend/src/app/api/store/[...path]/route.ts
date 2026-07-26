import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import {
  BackendRequestError,
  requestBackend,
} from "@/lib/server/backend";
import type { ApiErrorResponse } from "@/types/auth";

const MAX_REQUEST_BODY_BYTES = 64 * 1024;

const ALLOWED_ROUTES = [
  { methods: ["GET"], pattern: /^products(?:\/\d+)?$/ },
  { methods: ["GET"], pattern: /^categories(?:\/\d+)?$/ },
  { methods: ["GET", "POST", "DELETE"], pattern: /^cart$/ },
  { methods: ["POST"], pattern: /^cart\/items$/ },
  { methods: ["DELETE"], pattern: /^cart\/items\/\d+$/ },
  { methods: ["GET", "POST"], pattern: /^orders$/ },
  { methods: ["GET"], pattern: /^orders\/\d+$/ },
  { methods: ["GET"], pattern: /^payments\/order\/\d+$/ },
] as const;

const createErrorResponse = (status: number, message: string) => {
  const body: ApiErrorResponse = {
    status,
    message,
    timestamp: new Date().toISOString(),
    errors: null,
  };

  return NextResponse.json(body, { status });
};

const isAllowed = (method: string, path: string): boolean =>
  ALLOWED_ROUTES.some(
    (route) =>
      (route.methods as readonly string[]).includes(method) &&
      route.pattern.test(path),
  );

const proxyRequest = async (
  request: Request,
  context: RouteContext<"/api/store/[...path]">,
) => {
  const { path: segments } = await context.params;
  const path = segments.join("/");

  if (!isAllowed(request.method, path)) {
    return createErrorResponse(404, "Store API route not found");
  }

  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const isPublicGet =
    request.method === "GET" &&
    (path.startsWith("products") || path.startsWith("categories"));

  if (!token && !isPublicGet) {
    return createErrorResponse(401, "Authentication is required");
  }

  let body: string | undefined;

  if (request.method !== "GET" && request.method !== "DELETE") {
    const contentLength = Number(request.headers.get("content-length") ?? 0);

    if (contentLength > MAX_REQUEST_BODY_BYTES) {
      return createErrorResponse(413, "Request body is too large");
    }

    body = await request.text();

    if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_BODY_BYTES) {
      return createErrorResponse(413, "Request body is too large");
    }
  }

  try {
    const result = await requestBackend<unknown>(
      `/api/${path}`,
      {
        method: request.method,
        body: body || undefined,
      },
      token,
    );

    if (result === undefined) {
      return new NextResponse(null, { status: 204 });
    }

    const status =
      request.method === "POST" && path === "orders" ? 201 : 200;
    return NextResponse.json(result, { status });
  } catch (reason) {
    if (reason instanceof BackendRequestError) {
      const body: ApiErrorResponse = {
        status: reason.status,
        message: reason.message,
        timestamp: new Date().toISOString(),
        errors: reason.errors,
      };
      return NextResponse.json(body, { status: reason.status });
    }

    return createErrorResponse(500, "Unexpected store API error");
  }
};

export const GET = proxyRequest;
export const POST = proxyRequest;
export const DELETE = proxyRequest;
