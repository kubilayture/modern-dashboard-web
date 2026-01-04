import { useTranslation } from "react-i18next"
import type { Customer } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Eye, Pencil, Trash2, Ban, UserCheck } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface CustomerCardProps {
  customer: Customer
  onView?: (customer: Customer) => void
  onEdit?: (customer: Customer) => void
  onDelete?: (customer: Customer) => void
  onToggleStatus?: (customer: Customer) => void
}

const statusStyles: Record<Customer["status"], string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  banned: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function CustomerCard({ customer, onView, onEdit, onDelete, onToggleStatus }: CustomerCardProps) {
  const { t } = useTranslation()

  const statusLabels: Record<Customer["status"], string> = {
    active: t("customers.active"),
    inactive: t("customers.inactive"),
    banned: t("customers.banned"),
  }

  const initials = customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)

  const formattedSpent = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(customer.totalSpent)

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onView?.(customer)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-12 shrink-0">
            <AvatarImage src={customer.avatar} alt={customer.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{customer.name}</h3>
                  <Badge variant="outline" className={cn("border-0 shrink-0", statusStyles[customer.status])}>
                    {statusLabels[customer.status]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{customer.email}</p>
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
                  <DropdownMenuItem onClick={() => onView?.(customer)}>
                    <Eye className="mr-2 size-4" />
                    {t("common.view")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit?.(customer)}>
                    <Pencil className="mr-2 size-4" />
                    {t("common.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onToggleStatus?.(customer)}>
                    {customer.status === "banned" ? (
                      <>
                        <UserCheck className="mr-2 size-4" />
                        {t("customers.activateCustomer")}
                      </>
                    ) : (
                      <>
                        <Ban className="mr-2 size-4" />
                        {t("customers.banCustomer")}
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete?.(customer)} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 size-4" />
                    {t("common.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t("customers.totalOrders")}: <span className="font-medium text-foreground">{customer.totalOrders}</span>
              </span>
              <span className="font-semibold">{formattedSpent}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CustomerCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="size-12 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-14" />
            </div>
            <Skeleton className="h-4 w-36" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
