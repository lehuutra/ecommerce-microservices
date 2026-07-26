import type { Product } from "@/types/catalog";

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface CartResponse {
  userEmail: string;
  items: CartItem[];
}

export interface CartLine extends CartItem {
  product: Product | null;
}

export interface OrderItemRequest {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface OrderItem extends OrderItemRequest {
  id: number;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "DELIVERED";

export interface Order {
  id: number;
  userEmail: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  status: PaymentStatus;
  transactionId: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
}
