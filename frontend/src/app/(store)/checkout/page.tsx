import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CheckoutPanel } from "@/components/checkout/checkout-panel";
import { getCurrentUser } from "@/lib/server/auth";
import { getCartLines } from "@/lib/server/store";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review and place your order.",
};

const CheckoutPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/checkout");
  }

  const lines = await getCartLines();
  if (lines.length === 0 || lines.some((line) => !line.product)) {
    redirect("/cart");
  }

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <p className="text-sm font-semibold text-indigo-600">Final step</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Checkout</h1>
        <p className="mt-3 text-slate-600">
          Confirm your order and let the payment workflow take it from here.
        </p>

        <div className="mt-9">
          <CheckoutPanel lines={lines} userEmail={user.email} />
        </div>
      </section>
    </div>
  );
};

export default CheckoutPage;
