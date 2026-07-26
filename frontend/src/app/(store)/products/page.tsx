import type { Metadata } from "next";

import { ProductExplorer } from "@/components/catalog/product-explorer";
import { getCategories, getProducts } from "@/lib/server/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse and search the live product catalog.",
};

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string | string[];
    q?: string | string[];
  }>;
}) => {
  const [products, categories, params] = await Promise.all([
    getProducts(),
    getCategories(),
    searchParams,
  ]);
  const rawCategory = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const categoryId = rawCategory ? Number(rawCategory) : undefined;
  const query = Array.isArray(params.q) ? params.q[0] : params.q;

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-sm font-semibold text-indigo-600">Live catalog</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Find your next favorite
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Explore every active product currently available from the catalog
            service.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <ProductExplorer
          categories={categories}
          initialCategoryId={
            Number.isInteger(categoryId) ? categoryId : undefined
          }
          initialQuery={query}
          products={products}
        />
      </section>
    </div>
  );
};

export default ProductsPage;
