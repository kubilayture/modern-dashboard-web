import { useQuery } from "@tanstack/react-query"
import { getOrders, getOrderById } from "@/api"

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
}

export function useGetOrders() {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: getOrders,
  })
}

export function useGetOrderById(id: string | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(id!),
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  })
}
