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

// Obtener todos los productos
export function useOutlet() {
  return useQuery<ProductType[]>({
    queryKey: ["outlet"],
    queryFn: async () => {
      const res = await api.get("/api/outlet");
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

// Obtener un producto por id
export function useOutletProduct(id?: number) {
  return useQuery<ProductType>({
    queryKey: ["products", id],
    queryFn: async () => {
      const res = await api.get(`/api/outlet/${id}`);
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
    mutationFn: async ({
      id,
      product,
    }: {
      id: number;
      product: Partial<ProductType>;
    }) => api.put(`/api/products/${id}`, product),
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

export const useProviders = () => {
  return useQuery<{ id: number; name: string }[]>({
    queryKey: ["providers"],
    queryFn: async () => {
      const res = await api.get("/api/providers");
      return res.data;
    },
  });
};

export function useUploadProductImage() {
  return useMutation({
    mutationFn: async ({ id, image }: { id: number; image: File }) => {
      const formData = new FormData();
      formData.append("image", image);
      return api.post(`/api/products/${id}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  });
}

export function useFullProduct(id: number | string) {
  return useQuery<ProductType>({
    queryKey: ["fullProduct", id],
    queryFn: async () => {
      const res = await api.get(`/api/products/full/${id}`);
      return res.data;
    },
    enabled: !!id, // Solo hacer la llamada si hay id válido
  });
}

export function useDeleteProductGeneral() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isOutlet }: { id: number; isOutlet: boolean }) =>
      api.delete(isOutlet ? `/api/outlet/${id}` : `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["outlet"] });
    },
  });
}
