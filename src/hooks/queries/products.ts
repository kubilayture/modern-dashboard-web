import { useQuery } from "@tanstack/react-query"
import { getProducts, getProductById } from "@/api"

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
}

export function useGetProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: getProducts,
  })
}

export function useGetProductById(id: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id!),
    queryFn: () => getProductById(id!),
    enabled: !!id,
  })
}
