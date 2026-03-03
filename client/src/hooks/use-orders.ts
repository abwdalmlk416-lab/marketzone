import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Order, CreateOrderRequest } from "@shared/schema";

export function useOrders(params?: { role?: string, userId?: string }) {
  return useQuery<Order[]>({
    queryKey: [api.orders.list.path, params],
    queryFn: async () => {
      const url = new URL(api.orders.list.path, window.location.origin);
      if (params?.role) url.searchParams.append("role", params.role);
      if (params?.userId) url.searchParams.append("userId", params.userId);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return await res.json();
    },
    // Poll for updates to simulate real-time
    refetchInterval: 10000 
  });
}

export function useOrder(id: number) {
  return useQuery<Order | null>({
    queryKey: [api.orders.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.orders.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch order");
      return await res.json();
    },
    refetchInterval: 5000 
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateOrderRequest) => {
      const res = await fetch(api.orders.create.path, {
        method: api.orders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, totalAmount: data.totalAmount.toString() }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create order");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.orders.list.path] });
    }
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, driverId }: { id: number, status: string, driverId?: number }) => {
      const url = buildUrl(api.orders.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.orders.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, driverId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update order");
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.orders.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.orders.get.path, variables.id] });
    }
  });
}
