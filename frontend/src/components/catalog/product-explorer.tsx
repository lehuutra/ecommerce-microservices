"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/catalog/product-card";
import type { Category, Product } from "@/types/catalog";

export const ProductExplorer = ({
  products,
  categories,
  initialCategoryId,
  initialQuery,
}: {
  products: Product[];
  categories: Category[];
  initialCategoryId?: number;
  initialQuery?: string;
}) => {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [categoryId, setCategoryId] = useState<number | null>(
    initialCategoryId ?? null,
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        categoryId === null || product.category.id === categoryId;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description?.toLowerCase().includes(normalizedQuery) ||
        product.category.name.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [categoryId, products, query]);

  return (
    <>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block flex-1" htmlFor="product-search">
            <span className="sr-only">Search products</span>
            <input
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              id="product-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, descriptions, or categories..."
              type="search"
              value={query}
            />
          </label>
          <div
            aria-label="Filter by category"
            className="flex gap-2 overflow-x-auto pb-1"
            role="group"
          >
            <button
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                categoryId === null
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              onClick={() => setCategoryId(null)}
              type="button"
            >
              All
            </button>
            {categories.map((category) => (
              <button
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  categoryId === category.id
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                key={category.id}
                onClick={() => setCategoryId(category.id)}
                type="button"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
        <p>
          <strong className="text-slate-900">{filteredProducts.length}</strong>{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
        </p>
        {(query || categoryId !== null) && (
          <button
            className="font-semibold text-indigo-600 hover:text-indigo-700"
            onClick={() => {
              setQuery("");
              setCategoryId(null);
            }}
            type="button"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="font-semibold text-slate-900">No products found</h2>
          <p className="mt-2 text-sm text-slate-500">
            Try another search or clear the selected category.
          </p>
        </div>
      )}
    </>
  );
};
