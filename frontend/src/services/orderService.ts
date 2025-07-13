import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { OrderPost } from "../types/orderTypes";
import api from "./api";

export interface Product {
  name: string;
  image?: string;
}

export interface OrderDetailItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  product: Product;
}
export interface Order {
  id: number;
  status: "pending" | "cancelled" | "completed" | string;
  total: number;
  created_at: string;
  detalles: OrderDetailItem[];
}

// Crear pedido
export function useCreateOrder() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (order: OrderPost) => api.post("/api/orders", order),
    onSuccess: () => {
      navigate("/profile/orders");
    },
    onError: (error) => {
      console.error("Error al crear pedido:", error);
    },
  });
}

export const getOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<Order[]>("/api/orders");
  return data;
};

// Obtener un pedido por id
export const getOrderById = async (
  orderId: string | number
): Promise<Order> => {
  const { data } = await api.get(`/api/orders/${orderId}`);
  return data;
};

// Cambiar estado del pedido
export const updateOrderStatus = async (
  orderId: number,
  status: string
): Promise<void> => {
  await api.patch(`/api/orders/${orderId}/status`, { status });
};
