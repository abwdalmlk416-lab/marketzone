import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useStoreAnalytics(storeId: number) {
  return useQuery({
    queryKey: [api.analytics.getStoreStats.path, storeId],
    queryFn: async () => {
      const url = buildUrl(api.analytics.getStoreStats.path, { id: storeId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch store analytics");
      return await res.json() as { totalOrders: number, totalRevenue: number };
    }
  });
}

export function usePlatformAnalytics() {
  return useQuery({
    queryKey: [api.analytics.getPlatformStats.path],
    queryFn: async () => {
      const res = await fetch(api.analytics.getPlatformStats.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch platform analytics");
      return await res.json() as { totalStores: number, pendingStores: number, totalOrders: number, totalRevenue: number };
    }
  });
}
