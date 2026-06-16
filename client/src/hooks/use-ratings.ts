import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateRating(type: 'product' | 'store', id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { rating: number; comment?: string }) => {
      const body = type === 'product'
        ? { productId: id, rating: data.rating, comment: data.comment }
        : { storeId: id, rating: data.rating, comment: data.comment };
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("فشل في إضافة التقييم");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ratings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ratings/avg"] });
    },
  });
}

export function useRatings(params: { productId?: number; storeId?: number }) {
  const queryParams = new URLSearchParams();
  if (params.productId) queryParams.set("productId", params.productId.toString());
  if (params.storeId) queryParams.set("storeId", params.storeId.toString());

  return useQuery({
    queryKey: ["/api/ratings", params],
    queryFn: async () => {
      const res = await fetch(`/api/ratings?${queryParams.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("فشل في جلب التقييمات");
      return await res.json() as Array<{
        id: number;
        customerId: number;
        productId: number | null;
        storeId: number | null;
        rating: number;
        comment: string | null;
        createdAt: string;
      }>;
    },
    enabled: !!(params.productId || params.storeId),
  });
}

export function useAverageRating(params: { productId?: number; storeId?: number }) {
  const queryParams = new URLSearchParams();
  if (params.productId) queryParams.set("productId", params.productId.toString());
  if (params.storeId) queryParams.set("storeId", params.storeId.toString());

  return useQuery({
    queryKey: ["/api/ratings/avg", params],
    queryFn: async () => {
      const res = await fetch(`/api/ratings/avg?${queryParams.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("فشل في جلب متوسط التقييم");
      return await res.json() as { average: number };
    },
    enabled: !!(params.productId || params.storeId),
  });
}
