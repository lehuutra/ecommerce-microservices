import Link from "next/link";

export const SiteFooter = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <p className="font-semibold text-slate-900">E-Commerce</p>
          <p className="mt-1">A full-stack microservices storefront.</p>
        </div>
        <nav aria-label="Footer navigation" className="flex gap-5">
          <Link className="transition hover:text-indigo-600" href="/products">
            Products
          </Link>
          <Link className="transition hover:text-indigo-600" href="/cart">
            Cart
          </Link>
          <Link className="transition hover:text-indigo-600" href="/orders">
            Orders
          </Link>
        </nav>
      </div>
    </footer>
  );
};
