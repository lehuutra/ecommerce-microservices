"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import type { ApiErrorResponse, LoginRequest } from "@/types/auth";

async function getErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return "Sign-in failed. Please try again.";
  }

  const error = (await response.json()) as Partial<ApiErrorResponse>;
  return error.message ?? "Sign-in failed. Please try again.";
}

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const request: LoginRequest = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    };

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        setError(await getErrorMessage(response));
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor="email"
        >
          Email
        </label>
        <input
          autoComplete="email"
          className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label
            className="block text-sm font-medium text-slate-700"
            htmlFor="password"
          >
            Password
          </label>
          <span className="text-xs text-slate-400">At least 6 characters</span>
        </div>
        <input
          autoComplete="current-password"
          className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          id="password"
          minLength={6}
          name="password"
          placeholder="Enter your password"
          required
          type="password"
        />
      </div>

      <p
        aria-live="polite"
        className={`min-h-6 text-sm ${error ? "text-red-600" : "text-transparent"}`}
        role={error ? "alert" : undefined}
      >
        {error ?? "No errors"}
      </p>

      <button
        className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-indigo-300"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
