import Link from "next/link";
import { Suspense } from "react";

import { LogoutButton } from "@/components/auth/logout-button";
import { getCurrentUser } from "@/lib/server/auth";

const AccountArea = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 sm:inline-flex"
          href="/login"
        >
          Sign in
        </Link>
        <Link
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          href="/register"
        >
          Create account
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        className="hidden text-right sm:block"
        href="/orders"
        title="View your orders"
      >
        <span className="block text-sm font-semibold text-slate-900">
          {user.fullName}
        </span>
        <span className="block text-xs text-slate-500">{user.email}</span>
      </Link>
      <LogoutButton />
    </div>
  );
};

const AccountSkeleton = () => {
  return <div className="h-10 w-32 animate-pulse rounded-full bg-slate-100" />;
};

export const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-7">
          <Link className="flex items-center gap-2 font-bold text-slate-950" href="/">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-300">
              E
            </span>
            <span className="hidden sm:inline">E-Commerce</span>
          </Link>

          <nav aria-label="Primary navigation" className="flex items-center gap-1">
            <Link
              className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              href="/products"
            >
              Shop
            </Link>
            <Link
              className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              href="/orders"
            >
              Orders
            </Link>
            <Link
              className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              href="/cart"
            >
              Cart
            </Link>
          </nav>
        </div>

        <Suspense fallback={<AccountSkeleton />}>
          <AccountArea />
        </Suspense>
      </div>
    </header>
  );
};
