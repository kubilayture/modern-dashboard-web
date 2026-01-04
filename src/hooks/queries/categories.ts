import { useQuery } from "@tanstack/react-query"
import { getCategories, getCategoryById } from "@/api"

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  detail: (id: string) => [...categoryKeys.all, "detail", id] as const,
}

export function useGetCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: getCategories,
  })
}

export function useGetCategoryById(id: string | undefined) {
  return useQuery({
    queryKey: categoryKeys.detail(id!),
    queryFn: () => getCategoryById(id!),
    enabled: !!id,
  })
}
