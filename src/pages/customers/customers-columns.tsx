import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil, Trash2, Ban, UserCheck, UserX } from "lucide-react"
import type { Customer } from "@/types"
import { DataTableColumnHeader } from "@/components/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface UseCustomersColumnsOptions {
  onView?: (customer: Customer) => void
  onEdit?: (customer: Customer) => void
  onDelete?: (customer: Customer) => void
  onBan?: (customer: Customer) => void
  onActivate?: (customer: Customer) => void
}

const statusStyles: Record<Customer["status"], string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  banned: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function useCustomersColumns(options: UseCustomersColumnsOptions = {}) {
  const { t } = useTranslation()
  const { onView, onEdit, onDelete, onBan, onActivate } = options

  const statusLabels: Record<Customer["status"], string> = {
    active: t("customers.active"),
    inactive: t("customers.inactive"),
    banned: t("customers.banned"),
  }

  return useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("customers.name")} />,
        cell: ({ row }) => {
          const customer = row.original
          const initials = customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
          return (
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{customer.name}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("customers.email")} />,
      },
      {
        accessorKey: "phone",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("customers.phone")} />,
      },
      {
        accessorKey: "totalOrders",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("customers.totalOrders")} />,
        cell: ({ row }) => <span className="font-medium">{row.original.totalOrders}</span>,
      },
      {
        accessorKey: "totalSpent",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("customers.totalSpent")} />,
        cell: ({ row }) => {
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(row.original.totalSpent)
          return <span className="font-medium">{formatted}</span>
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("customers.status")} />,
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
        header: () => <span className="text-xs font-medium">{t("customers.actions")}</span>,
        cell: ({ row }) => {
          const customer = row.original
          return (
            <TooltipProvider>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => onView?.(customer)}>
                      <Eye className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("common.view")}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => onEdit?.(customer)}>
                      <Pencil className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("common.edit")}</TooltipContent>
                </Tooltip>
                {customer.status === "banned" ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 text-green-600" onClick={() => onActivate?.(customer)}>
                        <UserCheck className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("customers.activateCustomer")}</TooltipContent>
                  </Tooltip>
                ) : customer.status === "active" ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 text-orange-600" onClick={() => onBan?.(customer)}>
                        <Ban className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("customers.banCustomer")}</TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 text-blue-600" onClick={() => onActivate?.(customer)}>
                        <UserX className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("customers.activateCustomer")}</TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => onDelete?.(customer)}>
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
    [t, onView, onEdit, onDelete, onBan, onActivate, statusLabels]
  )
}
