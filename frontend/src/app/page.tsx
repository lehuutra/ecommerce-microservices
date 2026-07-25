import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { getCurrentUser } from "@/lib/server/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link className="flex items-center gap-2 font-bold" href="/">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              E
            </span>
            E-Commerce
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-900">
                  {user.fullName}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <LogoutButton />
            </div>
          ) : (
            <Link
              className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              href="/login"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white sm:py-32">
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
              Microservices storefront
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Shopping built on a modern distributed backend.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Authentication is now connected end to end. Product discovery,
              cart, and checkout experiences are the next frontend milestones.
            </p>
            <div className="mt-10 flex justify-center">
              {user ? (
                <p className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-slate-200">
                  Signed in as <strong className="text-white">{user.fullName}</strong>
                  <span className="ml-2 text-indigo-300">{user.role}</span>
                </p>
              ) : (
                <Link
                  className="rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-indigo-50"
                  href="/login"
                >
                  Get started
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
          {[
            ["Discover", "Browse products and categories from the catalog service."],
            ["Build your cart", "Keep a fast, Redis-backed cart across your session."],
            ["Checkout safely", "Place orders through the payment saga workflow."],
          ].map(([title, description]) => (
            <article
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              key={title}
            >
              <h2 className="text-lg font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
