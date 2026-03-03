import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Product, CreateProductRequest } from "@shared/schema";

export function useProducts(storeId?: number) {
  return useQuery<Product[]>({
    queryKey: [api.products.list.path, storeId],
    queryFn: async () => {
      const url = new URL(api.products.list.path, window.location.origin);
      if (storeId) url.searchParams.append("storeId", storeId.toString());
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      return await res.json();
    }
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateProductRequest) => {
      // Coerce price to numeric string if it's a number for DB insertion
      const payload = { ...data, price: data.price.toString() };
      const res = await fetch(api.products.create.path, {
        method: api.products.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create product");
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
    }
  });
}
