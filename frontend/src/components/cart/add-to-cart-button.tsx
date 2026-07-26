"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import type { ApiErrorResponse } from "@/types/auth";

export const AddToCartButton = ({
  productId,
  quantity = 1,
  compact = false,
}: {
  productId: number;
  quantity?: number;
  compact?: boolean;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "adding" | "added" | "error">(
    "idle",
  );

  const handleAdd = async () => {
    setState("adding");

    try {
      const response = await fetch("/api/store/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.status === 401) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!response.ok) {
        const error = (await response.json()) as Partial<ApiErrorResponse>;
        throw new Error(error.message ?? "Unable to add this product");
      }

      setState("added");
      router.refresh();
      window.setTimeout(() => setState("idle"), 1800);
    } catch {
      setState("error");
      window.setTimeout(() => setState("idle"), 2200);
    }
  };

  const label =
    state === "adding"
      ? "Adding..."
      : state === "added"
        ? "Added"
        : state === "error"
          ? "Try again"
          : compact
            ? "Add"
            : "Add to cart";

  return (
    <button
      aria-live="polite"
      className={`rounded-full bg-indigo-600 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-wait disabled:bg-indigo-300 ${
        compact ? "px-4 py-2 text-sm" : "px-6 py-3"
      }`}
      disabled={state === "adding"}
      onClick={handleAdd}
      type="button"
    >
      {label}
    </button>
  );
};
