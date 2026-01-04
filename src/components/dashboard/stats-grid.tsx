import { useTranslation } from "react-i18next"
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"
import { useGetDashboardStats } from "@/hooks"
import { StatCard } from "./stat-card"
import { StatCardSkeleton } from "./stat-card-skeleton"

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

export function StatsGrid() {
  const { t } = useTranslation()
  const { data: stats, isPending } = useGetDashboardStats()

  if (isPending) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t("dashboard.totalRevenue")}
        value={formatCurrency(stats.totalRevenue)}
        change={stats.revenueChange}
        icon={DollarSign}
      />
      <StatCard
        title={t("dashboard.totalOrders")}
        value={formatNumber(stats.totalOrders)}
        change={stats.ordersChange}
        icon={ShoppingCart}
      />
      <StatCard
        title={t("dashboard.totalCustomers")}
        value={formatNumber(stats.totalCustomers)}
        change={stats.customersChange}
        icon={Users}
      />
      <StatCard
        title={t("dashboard.conversionRate")}
        value={`${stats.conversionRate}%`}
        change={stats.conversionChange}
        icon={TrendingUp}
      />
    </div>
  )
}
