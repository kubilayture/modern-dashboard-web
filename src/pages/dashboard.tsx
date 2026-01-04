import { StatsGrid } from "@/components/dashboard"
import { RevenueChart, CategoryChart } from "@/components/charts"

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <StatsGrid />
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <RevenueChart />
        <CategoryChart />
      </div>
    </div>
  )
}
