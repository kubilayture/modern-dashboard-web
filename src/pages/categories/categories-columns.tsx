import { useMemo } from "react"
import { useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil, Trash2, Power, PowerOff } from "lucide-react"
import type { Category } from "@/types"
import { DataTableColumnHeader } from "@/components/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface UseCategoriesColumnsOptions {
  onEdit?: (category: Category) => void
  onDelete?: (category: Category) => void
  onToggleStatus?: (category: Category) => void
}

const statusStyles: Record<Category["status"], string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

export function useCategoriesColumns(options: UseCategoriesColumnsOptions = {}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { onEdit, onDelete, onToggleStatus } = options

  const statusLabels: Record<Category["status"], string> = {
    active: t("categories.active"),
    inactive: t("categories.inactive"),
  }

  return useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "image",
        header: () => <span className="text-xs font-medium">{t("categories.image")}</span>,
        cell: ({ row }) => {
          const category = row.original
          return category.image ? (
            <div className="size-10 rounded-md overflow-hidden bg-muted">
              <img src={category.image} alt={category.name} className="size-full object-cover" />
            </div>
          ) : (
            <div className="size-10 rounded-md bg-muted" />
          )
        },
      },
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("categories.name")} />,
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        accessorKey: "slug",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("categories.slug")} />,
        cell: ({ row }) => <span className="font-mono text-sm text-muted-foreground">{row.original.slug}</span>,
      },
      {
        accessorKey: "productCount",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("categories.productCount")} />,
        cell: ({ row }) => <span className="font-medium">{row.original.productCount}</span>,
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("categories.status")} />,
        cell: ({ row }) => {
          const status = row.original.status
          return (
            <Badge variant="outline" className={cn("border-0", statusStyles[status])}>
              {statusLabels[status]}
            </Badge>
          )
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
      {
        id: "actions",
        header: () => <span className="text-xs font-medium">{t("categories.actions")}</span>,
        cell: ({ row }) => {
          const category = row.original
          return (
            <TooltipProvider>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => navigate(`/categories/${category.id}`)}>
                      <Eye className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("common.view")}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => onEdit?.(category)}>
                      <Pencil className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("common.edit")}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("size-8", category.status === "active" ? "text-orange-600" : "text-green-600")}
                      onClick={() => onToggleStatus?.(category)}
                    >
                      {category.status === "active" ? <PowerOff className="size-4" /> : <Power className="size-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {category.status === "active" ? t("categories.deactivateCategory") : t("categories.activateCategory")}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => onDelete?.(category)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("common.delete")}</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          )
        },
      },
    ],
    [t, navigate, onEdit, onDelete, onToggleStatus, statusLabels]
  )
}
