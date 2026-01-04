import { useQuery } from "@tanstack/react-query"
import { getCustomers, getCustomerById } from "@/api"

export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  detail: (id: string) => [...customerKeys.all, "detail", id] as const,
}

export function useGetCustomers() {
  return useQuery({
    queryKey: customerKeys.lists(),
    queryFn: getCustomers,
  })
}

export function useGetCustomerById(id: string | undefined) {
  return useQuery({
    queryKey: customerKeys.detail(id!),
    queryFn: () => getCustomerById(id!),
    enabled: !!id,
  })
}
