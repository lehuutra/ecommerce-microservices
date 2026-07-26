import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CartView } from "@/components/cart/cart-view";
import { getCurrentUser } from "@/lib/server/auth";
import { getCartLines } from "@/lib/server/store";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review and update the products in your cart.",
};

const CartPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/cart");
  }

  const lines = await getCartLines();

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <p className="text-sm font-semibold text-indigo-600">Ready when you are</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Your cart</h1>
        <p className="mt-3 text-slate-600">
          Review quantities before you place the order.
        </p>

        <div className="mt-9">
          <CartView initialLines={lines} />
        </div>
      </section>
    </div>
  );
};

export default CartPage;
