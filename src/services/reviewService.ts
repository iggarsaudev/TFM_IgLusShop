import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

interface ReviewInput {
  product_id: number;
  rating: number;
  comment: string;
}

export function useCreateReview(onSuccess?: () => void, onError?: () => void) {
  return useMutation({
    mutationFn: (review: ReviewInput) => api.post("/api/reviews", review),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
}

export function useDeleteReview(onSuccess?: () => void, onError?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/reviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
}

export function useUpdateReview(onSuccess?: () => void, onError?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (review: { id: number; comment: string; rating: number }) =>
      api.put(`/api/reviews/${review.id}`, {
        comment: review.comment,
        rating: review.rating,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
}
