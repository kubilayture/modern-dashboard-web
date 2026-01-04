import { useTranslation } from "react-i18next"
import type { Order } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, RefreshCw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface OrderCardProps {
  order: Order
  onView?: (order: Order) => void
  onChangeStatus?: (order: Order) => void
}

const statusStyles: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function OrderCard({ order, onView, onChangeStatus }: OrderCardProps) {
  const { t } = useTranslation()

  const statusLabels: Record<Order["status"], string> = {
    pending: t("orders.pending"),
    processing: t("orders.processing"),
    completed: t("orders.completed"),
    cancelled: t("orders.cancelled"),
  }

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(order.amount)

  const formattedDate = new Date(order.date).toLocaleDateString()

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onView?.(order)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold">{order.id}</span>
              <Badge variant="outline" className={cn("border-0 shrink-0", statusStyles[order.status])}>
                {statusLabels[order.status]}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="font-medium truncate">{order.customer}</p>
              <p className="text-sm text-muted-foreground truncate">{order.product}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold">{formattedAmount}</p>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(order)}>
                <Eye className="mr-2 size-4" />
                {t("common.view")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeStatus?.(order)}>
                <RefreshCw className="mr-2 size-4" />
                {t("orders.changeStatus")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}

export function OrderCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
