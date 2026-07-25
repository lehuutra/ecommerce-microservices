const BACKEND_REQUEST_TIMEOUT_MS = 10_000;

export function getBackendUrl(path: string): URL {
  const baseUrl = process.env.BACKEND_API_URL;

  if (!baseUrl) {
    throw new Error("BACKEND_API_URL is not configured");
  }

  const url = new URL(path, baseUrl);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("BACKEND_API_URL must use HTTP or HTTPS");
  }

  return url;
}

export function createBackendTimeoutSignal(): AbortSignal {
  return AbortSignal.timeout(BACKEND_REQUEST_TIMEOUT_MS);
}
