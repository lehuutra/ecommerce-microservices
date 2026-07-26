"use client";

import Link from "next/link";
import { useEffect } from "react";

const StoreError = ({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-6 py-16 text-center">
      <div className="w-full rounded-3xl border border-red-100 bg-white p-10 shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-xl font-bold text-red-600">
          !
        </span>
        <h1 className="mt-5 text-2xl font-bold">We could not load this page</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          A backend service may still be starting. Try the request again in a
          moment.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
            onClick={() => unstable_retry()}
            type="button"
          >
            Try again
          </button>
          <Link
            className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            href="/"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoreError;
