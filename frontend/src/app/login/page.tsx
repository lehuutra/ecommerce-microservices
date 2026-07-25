import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Sign in | E-Commerce",
  description: "Sign in to your E-Commerce account.",
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
      </div>

      <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white p-7 shadow-2xl shadow-indigo-950/40 sm:p-10">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
          href="/"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            E
          </span>
          E-Commerce
        </Link>

        <div className="mt-8">
          <p className="text-sm font-medium text-indigo-600">Welcome back</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Sign in to your account
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Use your registered account to continue shopping.
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-slate-500">
          New to E-Commerce? Account registration is coming next.
        </p>
      </section>
    </main>
  );
}
