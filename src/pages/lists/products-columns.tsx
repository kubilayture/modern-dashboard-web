import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil, Trash2 } from "lucide-react"
import type { Product } from "@/types"
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

const statusStyles: Record<Product["status"], string> = {
  in_stock: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  low_stock: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  out_of_stock: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

interface UseProductsColumnsOptions {
  onView?: (product: Product) => void
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
}

export function useProductsColumns(options: UseProductsColumnsOptions = {}): ColumnDef<Product>[] {
  const { t } = useTranslation()
  const { onView, onEdit, onDelete } = options

  return useMemo(() => {
    const statusLabels: Record<Product["status"], string> = {
      in_stock: t("products.inStock"),
      low_stock: t("products.lowStock"),
      out_of_stock: t("products.outOfStock"),
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
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("products.productId")} />,
        cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("id")}</span>,
      },
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("products.productName")} />,
        cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
      },
      {
        accessorKey: "category",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("products.category")} />,
        filterFn: (row, id, value) => value === row.getValue(id),
      },
      {
        accessorKey: "price",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("products.price")} />,
        cell: ({ row }) => {
          const product = row.original
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: product.currency,
          }).format(product.price)
          return <span className="font-medium">{formatted}</span>
        },
        filterFn: (row, id, value: [number, number]) => {
          const price = row.getValue(id) as number
          const [min, max] = value
          if (min !== undefined && price < min) return false
          if (max !== undefined && price > max) return false
          return true
        },
      },
      {
        accessorKey: "stock",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("products.stockColumn")} />,
        cell: ({ row }) => <span>{row.getValue("stock")}</span>,
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("products.status")} />,
        cell: ({ row }) => {
          const status = row.getValue("status") as Product["status"]
          return (
            <Badge variant="outline" className={cn("border-0", statusStyles[status])}>
              {statusLabels[status]}
            </Badge>
          )
        },
        filterFn: (row, id, value) => value === row.getValue(id),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">{t("products.actions")}</span>,
        enableHiding: false,
        cell: ({ row }) => {
          const product = row.original
          return (
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => onView?.(product)}
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
                    onClick={() => onEdit?.(product)}
                  >
                    <Pencil className="size-4" />
                    <span className="sr-only">{t("common.edit")}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("common.edit")}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete?.(product)}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">{t("common.delete")}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("common.delete")}</TooltipContent>
              </Tooltip>
            </div>
          )
        },
      },
    ]
  }, [t, onView, onEdit, onDelete])
}
