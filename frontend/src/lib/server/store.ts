import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import {
  BackendRequestError,
  requestBackend,
} from "@/lib/server/backend";
import type { Category, Product } from "@/types/catalog";
import type {
  CartLine,
  CartResponse,
  Order,
  Payment,
} from "@/types/commerce";

export const getProducts = cache(async (): Promise<Product[]> => {
  return requestBackend<Product[]>("/api/products");
});

export const getCategories = cache(async (): Promise<Category[]> => {
  return requestBackend<Category[]>("/api/categories");
});

export const getProduct = cache(async (id: number): Promise<Product | null> => {
  try {
    return await requestBackend<Product>(`/api/products/${id}`);
  } catch (reason) {
    if (reason instanceof BackendRequestError && reason.status === 404) {
      return null;
    }

    throw reason;
  }
});

const getRequiredToken = async (): Promise<string> => {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    throw new BackendRequestError(401, "Authentication is required");
  }

  return token;
};

export const getCart = async (): Promise<CartResponse> => {
  return requestBackend<CartResponse>(
    "/api/cart",
    {},
    await getRequiredToken(),
  );
};

export const getCartLines = async (): Promise<CartLine[]> => {
  const cart = await getCart();

  return Promise.all(
    cart.items.map(async (item) => ({
      ...item,
      product: await getProduct(item.productId),
    })),
  );
};

export const getOrders = async (): Promise<Order[]> => {
  return requestBackend<Order[]>(
    "/api/orders",
    {},
    await getRequiredToken(),
  );
};

export const getOrder = async (id: number): Promise<Order | null> => {
  try {
    return await requestBackend<Order>(
      `/api/orders/${id}`,
      {},
      await getRequiredToken(),
    );
  } catch (reason) {
    if (reason instanceof BackendRequestError && reason.status === 404) {
      return null;
    }

    throw reason;
  }
};

export const getPaymentForOrder = async (
  orderId: number,
): Promise<Payment | null> => {
  try {
    return await requestBackend<Payment>(
      `/api/payments/order/${orderId}`,
      {},
      await getRequiredToken(),
    );
  } catch (reason) {
    if (reason instanceof BackendRequestError && reason.status === 404) {
      return null;
    }

    throw reason;
  }
};
