import Link from "next/link";

import { StatusBadge } from "@/components/orders/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Order } from "@/types/commerce";

export const OrderCard = ({ order }: { order: Order }) => {
  const itemCount = order.items.reduce(
    (count, item) => count + item.quantity,
    0,
  );

  return (
    <Link
      className="group block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg sm:p-6"
      href={`/orders/${order.id}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Order #{order.id}
          </p>
          <p className="mt-2 font-bold text-slate-950">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="mt-6 flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
        <div className="text-sm text-slate-500">
          <p>
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
          <p className="mt-1 truncate">
            {order.items.map((item) => item.productName).join(", ")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-950">
            {formatCurrency(order.totalAmount)}
          </p>
          <p className="mt-1 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
            View details →
          </p>
        </div>
      </div>
    </Link>
  );
};
