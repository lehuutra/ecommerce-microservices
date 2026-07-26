import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductCard } from "@/components/catalog/product-card";
import { ProductVisual } from "@/components/catalog/product-visual";
import { formatCurrency } from "@/lib/format";
import { getProduct, getProducts } from "@/lib/server/store";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params,
}: PageProps<"/products/[id]">): Promise<Metadata> => {
  const { id } = await params;
  const product = await getProduct(Number(id));

  return product
    ? {
        title: product.name,
        description:
          product.description ?? `Shop ${product.name} from E-Commerce.`,
      }
    : { title: "Product not found" };
};

const ProductDetailPage = async ({
  params,
}: PageProps<"/products/[id]">) => {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  const [product, products] = await Promise.all([
    getProduct(productId),
    getProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.category.id === product.category.id,
    )
    .slice(0, 3);

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <Link className="hover:text-indigo-600" href="/products">
            Shop
          </Link>
          <span className="px-2">/</span>
          <span>{product.category.name}</span>
        </nav>

        <section className="mt-6 grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
          <ProductVisual
            className="min-h-80 lg:min-h-[34rem]"
            imageUrl={product.imageUrl}
            name={product.name}
          />
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              {product.category.name}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
              {product.name}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              {product.description ||
                "A carefully selected product from our live catalog."}
            </p>
            <p className="mt-8 text-3xl font-bold text-slate-950">
              {formatCurrency(product.price)}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <AddToCartButton productId={product.id} />
              <Link
                className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                href="/cart"
              >
                View cart
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-200 pt-6 text-sm">
              <div>
                <p className="text-slate-400">Availability</p>
                <p className="mt-1 font-semibold text-emerald-600">Available</p>
              </div>
              <div>
                <p className="text-slate-400">Product ID</p>
                <p className="mt-1 font-semibold text-slate-700">
                  #{product.id}
                </p>
              </div>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="py-14">
            <h2 className="text-2xl font-bold tracking-tight">
              More in {product.category.name}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
