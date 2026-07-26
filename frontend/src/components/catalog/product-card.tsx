import Link from "next/link";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductVisual } from "@/components/catalog/product-visual";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types/catalog";

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
      <Link href={`/products/${product.id}`}>
        <ProductVisual
          className="aspect-[4/3] transition duration-300 group-hover:scale-[1.02]"
          imageUrl={product.imageUrl}
          name={product.name}
        />
      </Link>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          {product.category.name}
        </p>
        <Link
          className="mt-2 block text-lg font-bold text-slate-950 transition hover:text-indigo-600"
          href={`/products/${product.id}`}
        >
          {product.name}
        </Link>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
          {product.description || "A fresh addition to the catalog."}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-slate-950">
            {formatCurrency(product.price)}
          </span>
          <AddToCartButton compact productId={product.id} />
        </div>
      </div>
    </article>
  );
};
