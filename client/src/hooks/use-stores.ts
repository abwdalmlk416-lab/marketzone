import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Store, CreateStoreRequest } from "@shared/schema";

export function useStores() {
  return useQuery<Store[]>({
    queryKey: [api.stores.list.path],
    queryFn: async () => {
      const res = await fetch(api.stores.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stores");
      return await res.json();
    }
  });
}

export function useStore(id?: string | number) {
  return useQuery<Store | null>({
    queryKey: [api.stores.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.stores.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch store");
      return await res.json();
    },
    enabled: !!id
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateStoreRequest) => {
      const res = await fetch(api.stores.create.path, {
        method: api.stores.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create store");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.stores.list.path] });
    }
  });
}

export function useUpdateStoreStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const url = buildUrl(api.stores.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.stores.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update store status");
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.stores.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stores.get.path, variables.id] });
    }
  });
}
