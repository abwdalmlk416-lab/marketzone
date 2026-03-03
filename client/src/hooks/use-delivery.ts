import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { DeliveryTracking, UpdateDeliveryTrackingRequest } from "@shared/schema";

export function useDeliveryLocation(orderId: number) {
  return useQuery<DeliveryTracking | null>({
    queryKey: [api.delivery.getLocation.path, orderId],
    queryFn: async () => {
      const url = buildUrl(api.delivery.getLocation.path, { orderId });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch location");
      return await res.json();
    },
    refetchInterval: 3000 // fast poll for "live" tracking
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateDeliveryTrackingRequest) => {
      const res = await fetch(api.delivery.updateLocation.path, {
        method: api.delivery.updateLocation.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update location");
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.delivery.getLocation.path, variables.orderId] });
    }
  });
}
