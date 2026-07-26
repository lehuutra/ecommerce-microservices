import Link from "next/link";

import { ProductCard } from "@/components/catalog/product-card";
import { getCurrentUser } from "@/lib/server/auth";
import { getCategories, getProducts } from "@/lib/server/store";

export const dynamic = "force-dynamic";

const Home = async () => {
  const [user, products, categories] = await Promise.all([
    getCurrentUser(),
    getProducts(),
    getCategories(),
  ]);
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-slate-50 text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 px-6 py-20 text-white sm:py-28">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
              Built for everyday discovery
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              Great finds, without the complicated checkout.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Browse a live catalog, keep your cart across sessions, and follow
              every order from payment to confirmation.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-indigo-50"
                href="/products"
              >
                Shop all products
              </Link>
              {!user && (
                <Link
                  className="rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                  href="/register"
                >
                  Create an account
                </Link>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-indigo-950/40 backdrop-blur">
            {categories.slice(0, 4).map((category, index) => (
              <Link
                className={`min-h-32 rounded-2xl p-5 transition hover:-translate-y-1 ${
                  index === 0
                    ? "bg-indigo-500"
                    : index === 1
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-white/10"
                }`}
                href={`/products?category=${category.id}`}
                key={category.id}
              >
                <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  Category
                </span>
                <span className="mt-10 block text-lg font-bold">
                  {category.name}
                </span>
              </Link>
            ))}
            {categories.length === 0 && (
              <div className="col-span-2 flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-white/20 text-center text-sm text-slate-300">
                Categories will appear here when the catalog is ready.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Fresh picks</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Featured products
            </h2>
          </div>
          <Link
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            href="/products"
          >
            View the full catalog →
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h3 className="font-semibold text-slate-900">
              The catalog is being prepared
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Products will show up here as soon as they are added.
            </p>
          </div>
        )}
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-3 lg:px-8">
          {[
            ["Fast discovery", "Search and filter the live catalog in a few taps."],
            ["Persistent cart", "Your Redis-backed cart stays ready for seven days."],
            ["Track every order", "See payment and order status in one clear timeline."],
          ].map(([title, description], index) => (
            <article className="flex gap-4" key={title}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 font-bold text-indigo-600">
                {index + 1}
              </span>
              <div>
                <h3 className="font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
