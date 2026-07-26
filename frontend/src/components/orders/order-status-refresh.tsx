"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const OrderStatusRefresh = ({ isPending }: { isPending: boolean }) => {
  const router = useRouter();
  const [refreshes, setRefreshes] = useState(0);

  useEffect(() => {
    if (!isPending || refreshes >= 10) {
      return;
    }

    const timer = window.setTimeout(() => {
      setRefreshes((count) => count + 1);
      router.refresh();
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [isPending, refreshes, router]);

  if (!isPending) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-500" />
      <p className="flex-1">
        Payment is processing. This page refreshes automatically.
      </p>
      <button
        className="font-semibold underline underline-offset-4"
        onClick={() => router.refresh()}
        type="button"
      >
        Refresh now
      </button>
    </div>
  );
};
