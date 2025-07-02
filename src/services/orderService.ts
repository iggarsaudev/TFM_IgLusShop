import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { OrderPost } from "../types/orderTypes";
import api from "./api";

// Crear pedido
export function useCreateOrder() {
    const navigate = useNavigate();    
  return useMutation({
    mutationFn: (order: OrderPost) => api.post("/api/orders", order),
    onSuccess: () => {
      navigate('/profile/orders');
    },
    onError: (error) => {
      console.error("Error al crear pedido:", error);
    }
  });
}
