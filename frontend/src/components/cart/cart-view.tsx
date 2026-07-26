"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { ProductVisual } from "@/components/catalog/product-visual";
import { formatCurrency } from "@/lib/format";
import type { CartLine } from "@/types/commerce";

export const CartView = ({ initialLines }: { initialLines: CartLine[] }) => {
  const router = useRouter();
  const [lines, setLines] = useState(initialLines);
  const [pendingProductId, setPendingProductId] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = useMemo(
    () =>
      lines.reduce(
        (total, line) =>
          total + (line.product?.price ?? 0) * line.quantity,
        0,
      ),
    [lines],
  );

  const replaceQuantity = async (productId: number, quantity: number) => {
    setError(null);
    setPendingProductId(productId);

    try {
      const removeResponse = await fetch(
        `/api/store/cart/items/${productId}`,
        { method: "DELETE" },
      );

      if (!removeResponse.ok) {
        throw new Error("Unable to update your cart");
      }

      if (quantity > 0) {
        const addResponse = await fetch("/api/store/cart/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        });

        if (!addResponse.ok) {
          throw new Error("Unable to update your cart");
        }
      }

      setLines((current) =>
        quantity > 0
          ? current.map((line) =>
              line.productId === productId ? { ...line, quantity } : line,
            )
          : current.filter((line) => line.productId !== productId),
      );
      router.refresh();
    } catch {
      setError("Your cart could not be updated. Please try again.");
    } finally {
      setPendingProductId(null);
    }
  };

  const clearCart = async () => {
    setError(null);
    setIsClearing(true);

    try {
      const response = await fetch("/api/store/cart", { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Unable to clear cart");
      }

      setLines([]);
      router.refresh();
    } catch {
      setError("Your cart could not be cleared. Please try again.");
    } finally {
      setIsClearing(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-bold text-indigo-600">
          0
        </span>
        <h2 className="mt-5 text-xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-sm text-slate-500">
          Browse the catalog and add something you love.
        </p>
        <Link
          className="mt-6 inline-flex rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          href="/products"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {lines.length} {lines.length === 1 ? "item" : "items"}
          </p>
          <button
            className="text-sm font-semibold text-slate-500 transition hover:text-red-600 disabled:cursor-wait disabled:opacity-50"
            disabled={isClearing}
            onClick={clearCart}
            type="button"
          >
            {isClearing ? "Clearing..." : "Clear cart"}
          </button>
        </div>

        {lines.map((line) => {
          const product = line.product;
          const isPending = pendingProductId === line.productId;

          return (
            <article
              className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:gap-6 sm:p-5"
              key={line.productId}
            >
              <ProductVisual
                className="h-24 w-24 shrink-0 rounded-2xl sm:h-32 sm:w-32"
                imageUrl={product?.imageUrl ?? null}
                name={product?.name ?? `Product ${line.productId}`}
              />
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                        {product?.category.name ?? "Unavailable product"}
                      </p>
                      <Link
                        className="mt-1 block truncate font-bold text-slate-950 hover:text-indigo-600"
                        href={`/products/${line.productId}`}
                      >
                        {product?.name ?? `Product #${line.productId}`}
                      </Link>
                    </div>
                    <p className="shrink-0 font-bold">
                      {formatCurrency((product?.price ?? 0) * line.quantity)}
                    </p>
                  </div>
                  {!product && (
                    <p className="mt-2 text-xs text-amber-600">
                      This item is no longer available for checkout.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div
                    aria-label={`Quantity for ${product?.name ?? `product ${line.productId}`}`}
                    className="inline-flex items-center rounded-full border border-slate-300"
                    role="group"
                  >
                    <button
                      aria-label="Decrease quantity"
                      className="h-9 w-9 rounded-full text-lg font-semibold transition hover:bg-slate-100 disabled:cursor-wait disabled:opacity-40"
                      disabled={isPending}
                      onClick={() =>
                        replaceQuantity(line.productId, line.quantity - 1)
                      }
                      type="button"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {line.quantity}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      className="h-9 w-9 rounded-full text-lg font-semibold transition hover:bg-slate-100 disabled:cursor-wait disabled:opacity-40"
                      disabled={isPending}
                      onClick={() =>
                        replaceQuantity(line.productId, line.quantity + 1)
                      }
                      type="button"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="text-sm font-semibold text-slate-500 hover:text-red-600 disabled:cursor-wait disabled:opacity-40"
                    disabled={isPending}
                    onClick={() => replaceQuantity(line.productId, 0)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        <p
          aria-live="polite"
          className={`min-h-6 text-sm ${error ? "text-red-600" : "text-transparent"}`}
          role={error ? "alert" : undefined}
        >
          {error ?? "No errors"}
        </p>
      </section>

      <aside className="h-fit rounded-3xl bg-slate-950 p-6 text-white lg:sticky lg:top-24">
        <h2 className="text-xl font-bold">Order summary</h2>
        <dl className="mt-6 space-y-4 text-sm">
          <div className="flex justify-between text-slate-300">
            <dt>Subtotal</dt>
            <dd>{formatCurrency(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-slate-300">
            <dt>Shipping</dt>
            <dd>Free</dd>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-bold">
            <dt>Total</dt>
            <dd>{formatCurrency(subtotal)}</dd>
          </div>
        </dl>
        <Link
          className={`mt-7 flex w-full items-center justify-center rounded-full px-5 py-3 font-semibold transition ${
            lines.every((line) => line.product)
              ? "bg-white text-slate-950 hover:bg-indigo-50"
              : "pointer-events-none bg-white/20 text-white/50"
          }`}
          href="/checkout"
        >
          Continue to checkout
        </Link>
        <Link
          className="mt-3 flex justify-center py-2 text-sm font-semibold text-slate-300 hover:text-white"
          href="/products"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
};
