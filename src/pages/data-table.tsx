import { useState, useMemo } from "react"
import { useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import { Search, X, ChevronDown } from "lucide-react"
import type { Order } from "@/types"
import { useGetOrders, useUpdateOrderStatus } from "@/hooks"
import { OrdersTable } from "./data-table/orders-table"
import { OrderStatusDialog } from "./data-table/order-status-dialog"
import { OrderCard, OrderCardSkeleton } from "@/components/cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ITEMS_PER_PAGE = 6

export function DataTablePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: orders = [], isPending } = useGetOrders()
  const updateOrderStatus = useUpdateOrderStatus()

  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const [mobileSearch, setMobileSearch] = useState("")
  const [mobileStatusFilter, setMobileStatusFilter] = useState<string>("all")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const filteredOrders = useMemo(() => {
    let result = orders

    if (mobileSearch) {
      const search = mobileSearch.toLowerCase()
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(search) ||
          order.customer.toLowerCase().includes(search) ||
          order.product.toLowerCase().includes(search)
      )
    }

    if (mobileStatusFilter !== "all") {
      result = result.filter((order) => order.status === mobileStatusFilter)
    }

    return result
  }, [orders, mobileSearch, mobileStatusFilter])

  const visibleOrders = filteredOrders.slice(0, visibleCount)
  const hasMore = visibleCount < filteredOrders.length

  const handleViewClick = (order: Order) => {
    navigate(`/orders/${order.id}`)
  }

  const handleChangeStatusClick = (order: Order) => {
    setSelectedOrder(order)
    setStatusDialogOpen(true)
  }

  const handleStatusChange = async (orderId: string, status: Order["status"]) => {
    await updateOrderStatus.mutateAsync({ id: orderId, status })
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
  }

  const handleResetFilters = () => {
    setMobileSearch("")
    setMobileStatusFilter("all")
    setVisibleCount(ITEMS_PER_PAGE)
  }

  const isFiltered = mobileSearch !== "" || mobileStatusFilter !== "all"

  return (
    <div className="space-y-6">
      <div className="hidden lg:block">
        <Card>
          <CardHeader>
            <CardTitle>{t("orders.title")}</CardTitle>
            <CardDescription>{t("orders.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersTable />
          </CardContent>
        </Card>
      </div>

      <div className="lg:hidden space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t("orders.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("orders.description")}</p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder={t("orders.searchPlaceholder")}
              value={mobileSearch}
              onChange={(e) => {
                setMobileSearch(e.target.value)
                setVisibleCount(ITEMS_PER_PAGE)
              }}
              className="pl-8"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={mobileStatusFilter}
              onValueChange={(value) => {
                setMobileStatusFilter(value)
                setVisibleCount(ITEMS_PER_PAGE)
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t("orders.allStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("orders.allStatus")}</SelectItem>
                <SelectItem value="pending">{t("orders.pending")}</SelectItem>
                <SelectItem value="processing">{t("orders.processing")}</SelectItem>
                <SelectItem value="completed">{t("orders.completed")}</SelectItem>
                <SelectItem value="cancelled">{t("orders.cancelled")}</SelectItem>
              </SelectContent>
            </Select>

            {isFiltered && (
              <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {isPending ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("common.noResults")}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {visibleOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onView={handleViewClick}
                  onChangeStatus={handleChangeStatusClick}
                />
              ))}
            </div>

            {hasMore && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLoadMore}
              >
                {t("common.loadMore")}
                <ChevronDown className="ml-2 size-4" />
              </Button>
            )}

            <p className="text-center text-sm text-muted-foreground">
              {visibleOrders.length} / {filteredOrders.length}
            </p>
          </>
        )}
      </div>

      <OrderStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        order={selectedOrder}
        onSubmit={handleStatusChange}
      />
    </div>
  )
}
