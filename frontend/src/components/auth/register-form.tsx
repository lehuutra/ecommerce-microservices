"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import type { ApiErrorResponse, RegisterRequest } from "@/types/auth";

const getErrorMessage = async (response: Response): Promise<string> => {
  if (!response.headers.get("content-type")?.includes("application/json")) {
    return "Registration failed. Please try again.";
  }

  const error = (await response.json()) as Partial<ApiErrorResponse>;
  return error.message ?? "Registration failed. Please try again.";
};

export const RegisterForm = ({ nextPath = "/" }: { nextPath?: string }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const passwordConfirmation = String(
      formData.get("passwordConfirmation") ?? "",
    );

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    const request: RegisterRequest = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        setError(await getErrorMessage(response));
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="fullName">
          Full name
        </label>
        <input
          autoComplete="name"
          className={inputClassName}
          id="fullName"
          name="fullName"
          placeholder="Alex Morgan"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className={inputClassName}
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            autoComplete="new-password"
            className={inputClassName}
            id="password"
            minLength={6}
            name="password"
            placeholder="6+ characters"
            required
            type="password"
          />
        </div>
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-700"
            htmlFor="passwordConfirmation"
          >
            Confirm password
          </label>
          <input
            autoComplete="new-password"
            className={inputClassName}
            id="passwordConfirmation"
            minLength={6}
            name="passwordConfirmation"
            placeholder="Repeat password"
            required
            type="password"
          />
        </div>
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
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          className="font-semibold text-indigo-600 hover:text-indigo-700"
          href={`/login?next=${encodeURIComponent(nextPath)}`}
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};
