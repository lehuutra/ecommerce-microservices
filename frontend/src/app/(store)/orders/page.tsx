import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { OrderCard } from "@/components/orders/order-card";
import { getCurrentUser } from "@/lib/server/auth";
import { getOrders } from "@/lib/server/store";

export const metadata: Metadata = {
  title: "Your orders",
  description: "Review your order history and payment status.",
};

const OrdersPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/orders");
  }

  const orders = await getOrders();

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              Purchase history
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Your orders
            </h1>
            <p className="mt-3 text-slate-600">
              Follow payment and fulfillment status from one place.
            </p>
          </div>
          <Link
            className="w-fit rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            href="/products"
          >
            Continue shopping
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="mt-9 grid gap-5">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="mt-9 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 font-bold text-indigo-600">
              #
            </span>
            <h2 className="mt-5 text-xl font-bold">No orders yet</h2>
            <p className="mt-2 text-sm text-slate-500">
              Your completed checkouts will appear here.
            </p>
            <Link
              className="mt-6 inline-flex rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
              href="/products"
            >
              Browse products
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default OrdersPage;
