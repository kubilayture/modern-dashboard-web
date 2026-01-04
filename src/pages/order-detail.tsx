import { useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import { ArrowLeft, Package, RefreshCw, Mail, Calendar, DollarSign, User } from "lucide-react"
import type { Order } from "@/types"
import { useGetOrderById, useUpdateOrderStatus } from "@/hooks"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { OrderStatusDialog } from "./orders/order-status-dialog"

const statusStyles: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function OrderDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: order, isPending } = useGetOrderById(id)
  const updateOrderStatus = useUpdateOrderStatus()

  const [statusDialogOpen, setStatusDialogOpen] = useState(false)

  const handleStatusChange = async (orderId: string, status: Order["status"]) => {
    await updateOrderStatus.mutateAsync({ id: orderId, status })
  }

  const statusLabels: Record<Order["status"], string> = {
    pending: t("orders.pending"),
    processing: t("orders.processing"),
    completed: t("orders.completed"),
    cancelled: t("orders.cancelled"),
  }

  if (isPending) {
    return (
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Package className="size-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">{t("orders.notFound")}</h2>
        <Button variant="outline" onClick={() => navigate("/orders")}>
          <ArrowLeft className="mr-2 size-4" />
          {t("orders.backToOrders")}
        </Button>
      </div>
    )
  }

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(order.amount)

  const formattedDate = new Date(order.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/orders")}>
          <ArrowLeft className="mr-2 size-4" />
          {t("orders.backToOrders")}
        </Button>
        <Button variant="outline" onClick={() => setStatusDialogOpen(true)}>
          <RefreshCw className="mr-2 size-4" />
          {t("orders.changeStatus")}
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{order.id}</h1>
          <Badge variant="outline" className={cn("border-0", statusStyles[order.status])}>
            {statusLabels[order.status]}
          </Badge>
        </div>
        <p className="text-muted-foreground">{formattedDate}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="size-4" />
              {t("orders.customerInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("orders.customer")}</p>
              <p className="font-medium">{order.customer}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("orders.email")}</p>
              <p className="font-medium flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                {order.email}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="size-4" />
              {t("orders.orderInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("orders.product")}</p>
              <p className="font-medium">{order.product}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("orders.amount")}</p>
              <p className="font-medium flex items-center gap-2">
                <DollarSign className="size-4 text-muted-foreground" />
                {formattedAmount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="size-4" />
            {t("orders.timeline")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="size-3 rounded-full bg-primary" />
                <div className="w-px h-8 bg-border" />
              </div>
              <div>
                <p className="font-medium">{t("orders.orderPlaced")}</p>
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
            {order.status !== "pending" && order.status !== "cancelled" && (
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="size-3 rounded-full bg-primary" />
                  {order.status === "completed" && <div className="w-px h-8 bg-border" />}
                </div>
                <div>
                  <p className="font-medium">{t("orders.orderProcessing")}</p>
                  <p className="text-sm text-muted-foreground">{t("orders.inProgress")}</p>
                </div>
              </div>
            )}
            {order.status === "completed" && (
              <div className="flex items-start gap-4">
                <div className="size-3 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">{t("orders.orderCompleted")}</p>
                  <p className="text-sm text-muted-foreground">{t("orders.delivered")}</p>
                </div>
              </div>
            )}
            {order.status === "cancelled" && (
              <div className="flex items-start gap-4">
                <div className="size-3 rounded-full bg-red-500" />
                <div>
                  <p className="font-medium">{t("orders.orderCancelled")}</p>
                  <p className="text-sm text-muted-foreground">{t("orders.cancelledDesc")}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <OrderStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        order={order}
        onSubmit={handleStatusChange}
      />
    </div>
  )
}
