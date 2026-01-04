import { useQuery } from "@tanstack/react-query"
import { getDashboardStats, getRevenueData, getCategoryData } from "@/api"

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  revenue: () => [...dashboardKeys.all, "revenue"] as const,
  category: () => [...dashboardKeys.all, "category"] as const,
}

export function useGetDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
  })
}

export function useGetRevenueData() {
  return useQuery({
    queryKey: dashboardKeys.revenue(),
    queryFn: getRevenueData,
  })
}

export function useGetCategoryData() {
  return useQuery({
    queryKey: dashboardKeys.category(),
    queryFn: getCategoryData,
  })
}
