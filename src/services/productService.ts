import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductType } from "../types/productTypes";
import api from "./api";
 


// Obtener todos los productos
export function useProducts() {
  return useQuery<ProductType[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/api/products");
      return res.data;
    },
  });
}

// Obtener un producto por id
export function useProduct(id?: number) {
  return useQuery<ProductType>({
    queryKey: ["products", id],
    queryFn: async () => {
      const res = await api.get(`/api/products/${id}`);
      return res.data;
    },
    enabled: !!id, // Solo ejecuta si hay id
  });
}

// Crear producto
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: ProductType) => api.post("/api/products", product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// Actualizar producto
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, product }: { id: number; product: Partial<ProductType> }) => api.put(`/api/products/${id}`, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// Eliminar producto
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export const useCategories = () => {
  return useQuery<{ id: number; name: string }[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/api/categories");
      return res.data;
    },
  });
};
