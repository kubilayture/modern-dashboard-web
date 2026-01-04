import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, RefreshCw } from "lucide-react"
import type { Order } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DataTableColumnHeader } from "@/components/table"
import { cn } from "@/lib/utils"

const statusStyles: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

interface UseOrdersColumnsOptions {
  onView?: (order: Order) => void
  onChangeStatus?: (order: Order) => void
}

export function useOrdersColumns(options: UseOrdersColumnsOptions = {}): ColumnDef<Order>[] {
  const { t } = useTranslation()
  const { onView, onChangeStatus } = options

  return useMemo(() => {
    const statusLabels: Record<Order["status"], string> = {
      pending: t("orders.pending"),
      processing: t("orders.processing"),
      completed: t("orders.completed"),
      cancelled: t("orders.cancelled"),
    }

    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("orders.orderId")} />,
      },
      {
        accessorKey: "customer",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("orders.customer")} />,
      },
      {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("orders.email")} />,
      },
      {
        accessorKey: "product",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("orders.product")} />,
      },
      {
        accessorKey: "amount",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("orders.amount")} />,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"))
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount)
          return <span className="font-medium">{formatted}</span>
        },
        filterFn: (row, id, value: [number, number]) => {
          const amount = row.getValue(id) as number
          const [min, max] = value
          if (min !== undefined && amount < min) return false
          if (max !== undefined && amount > max) return false
          return true
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("orders.status")} />,
        cell: ({ row }) => {
          const status = row.getValue("status") as Order["status"]
          return (
            <Badge variant="outline" className={cn("border-0", statusStyles[status])}>
              {statusLabels[status]}
            </Badge>
          )
        },
        filterFn: (row, id, value) => {
          return value === row.getValue(id)
        },
      },
      {
        accessorKey: "date",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("orders.date")} />,
        filterFn: (row, id, value: [string, string]) => {
          const date = row.getValue(id) as string
          const [start, end] = value
          if (start && date < start) return false
          if (end && date > end) return false
          return true
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">{t("orders.actions")}</span>,
        enableHiding: false,
        cell: ({ row }) => {
          const order = row.original
          return (
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => onView?.(order)}
                  >
                    <Eye className="size-4" />
                    <span className="sr-only">{t("common.view")}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("common.view")}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => onChangeStatus?.(order)}
                  >
                    <RefreshCw className="size-4" />
                    <span className="sr-only">{t("orders.changeStatus")}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("orders.changeStatus")}</TooltipContent>
              </Tooltip>
            </div>
          )
        },
      },
    ]
  }, [t, onView, onChangeStatus])
}
