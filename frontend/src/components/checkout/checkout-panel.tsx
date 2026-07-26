"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { ProductVisual } from "@/components/catalog/product-visual";
import { formatCurrency } from "@/lib/format";
import type { ApiErrorResponse } from "@/types/auth";
import type { CartLine, Order } from "@/types/commerce";

export const CheckoutPanel = ({
  lines,
  userEmail,
}: {
  lines: CartLine[];
  userEmail: string;
}) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = useMemo(
    () =>
      lines.reduce(
        (amount, line) =>
          amount + (line.product?.price ?? 0) * line.quantity,
        0,
      ),
    [lines],
  );

  const placeOrder = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/store/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.flatMap((line) =>
            line.product
              ? [
                  {
                    productId: line.product.id,
                    productName: line.product.name,
                    price: line.product.price,
                    quantity: line.quantity,
                  },
                ]
              : [],
          ),
        }),
      });

      if (!response.ok) {
        const body = (await response.json()) as Partial<ApiErrorResponse>;
        throw new Error(body.message ?? "Unable to place your order");
      }

      const order = (await response.json()) as Order;
      await fetch("/api/store/cart", { method: "DELETE" });
      router.replace(`/orders/${order.id}`);
      router.refresh();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to place your order. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-indigo-600">Account</p>
          <h2 className="mt-2 text-xl font-bold">Customer details</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-xs uppercase tracking-wider text-slate-400">
                Email
              </dt>
              <dd className="mt-1 font-semibold text-slate-900">{userEmail}</dd>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-xs uppercase tracking-wider text-slate-400">
                Delivery
              </dt>
              <dd className="mt-1 font-semibold text-slate-900">
                Digital checkout demo
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-indigo-600">Payment</p>
          <h2 className="mt-2 text-xl font-bold">Automatic test payment</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This project uses a mock payment gateway. After the order is
            created, the payment saga processes it automatically and updates
            the order status.
          </p>
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            No real card will be charged.
          </div>
        </div>
      </section>

      <aside className="h-fit rounded-3xl bg-slate-950 p-6 text-white lg:sticky lg:top-24">
        <h2 className="text-xl font-bold">Review order</h2>
        <div className="mt-6 space-y-4">
          {lines.map((line) => (
            <div className="flex gap-3" key={line.productId}>
              <ProductVisual
                className="h-14 w-14 shrink-0 rounded-xl"
                imageUrl={line.product?.imageUrl ?? null}
                name={line.product?.name ?? `Product ${line.productId}`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {line.product?.name}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Qty {line.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {formatCurrency((line.product?.price ?? 0) * line.quantity)}
              </p>
            </div>
          ))}
        </div>
        <dl className="mt-6 border-t border-white/10 pt-5">
          <div className="flex items-center justify-between text-lg font-bold">
            <dt>Total</dt>
            <dd>{formatCurrency(total)}</dd>
          </div>
        </dl>

        <p
          aria-live="polite"
          className={`mt-5 min-h-6 text-sm ${error ? "text-red-300" : "text-transparent"}`}
          role={error ? "alert" : undefined}
        >
          {error ?? "No errors"}
        </p>
        <button
          className="mt-2 flex w-full items-center justify-center rounded-full bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-indigo-50 disabled:cursor-wait disabled:bg-white/30 disabled:text-white/60"
          disabled={isSubmitting}
          onClick={placeOrder}
          type="button"
        >
          {isSubmitting ? "Placing order..." : "Place order"}
        </button>
      </aside>
    </div>
  );
};
