import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { OrderStatusRefresh } from "@/components/orders/order-status-refresh";
import { StatusBadge } from "@/components/orders/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { getCurrentUser } from "@/lib/server/auth";
import { getOrder, getPaymentForOrder } from "@/lib/server/store";

export const metadata: Metadata = {
  title: "Order details",
  description: "Review order items, totals, and payment status.",
};

const OrderDetailPage = async ({
  params,
}: PageProps<"/orders/[id]">) => {
  const user = await getCurrentUser();
  const { id } = await params;

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/orders/${id}`)}`);
  }

  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    notFound();
  }

  const order = await getOrder(orderId);
  if (!order) {
    notFound();
  }

  const payment = await getPaymentForOrder(orderId);
  const isPending =
    order.status === "PENDING" || payment?.status === "PENDING" || !payment;

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        <Link
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          href="/orders"
        >
          ← Back to orders
        </Link>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400">
              Order #{order.id}
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Order details
            </h1>
            <p className="mt-3 text-slate-600">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="mt-8">
          <OrderStatusRefresh isPending={isPending} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Items</h2>
              <div className="mt-5 divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div
                    className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                    key={item.id}
                  >
                    <div>
                      <Link
                        className="font-semibold text-slate-950 hover:text-indigo-600"
                        href={`/products/${item.productId}`}
                      >
                        {item.productName}
                      </Link>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5 text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Payment</h2>
              {payment ? (
                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <dt className="text-xs uppercase tracking-wider text-slate-400">
                      Status
                    </dt>
                    <dd className="mt-2">
                      <StatusBadge status={payment.status} />
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <dt className="text-xs uppercase tracking-wider text-slate-400">
                      Amount
                    </dt>
                    <dd className="mt-2 font-bold">
                      {formatCurrency(payment.amount)}
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                    <dt className="text-xs uppercase tracking-wider text-slate-400">
                      Transaction
                    </dt>
                    <dd className="mt-2 break-all font-mono text-sm font-semibold">
                      {payment.transactionId ??
                        payment.failureReason ??
                        "Waiting for payment result"}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  The payment record is being created by the order saga.
                </p>
              )}
            </section>
          </div>

          <aside className="h-fit rounded-3xl bg-slate-950 p-6 text-white">
            <h2 className="text-lg font-bold">Order progress</h2>
            <ol className="mt-6 space-y-5 text-sm">
              <li className="flex gap-3">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-emerald-400 text-center text-xs font-bold leading-5 text-slate-950">
                  1
                </span>
                <div>
                  <p className="font-semibold">Order received</p>
                  <p className="mt-1 text-slate-400">Saved successfully</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span
                  className={`mt-0.5 h-5 w-5 rounded-full text-center text-xs font-bold leading-5 ${
                    payment
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-white/15 text-white"
                  }`}
                >
                  2
                </span>
                <div>
                  <p className="font-semibold">Payment processed</p>
                  <p className="mt-1 text-slate-400">
                    {payment?.status.toLowerCase() ?? "Waiting"}
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span
                  className={`mt-0.5 h-5 w-5 rounded-full text-center text-xs font-bold leading-5 ${
                    order.status !== "PENDING"
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-white/15 text-white"
                  }`}
                >
                  3
                </span>
                <div>
                  <p className="font-semibold">Order updated</p>
                  <p className="mt-1 text-slate-400">
                    {order.status.toLowerCase()}
                  </p>
                </div>
              </li>
            </ol>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default OrderDetailPage;
