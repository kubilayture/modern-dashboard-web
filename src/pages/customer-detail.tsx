import { useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, Ban, UserCheck, Pencil, Trash2 } from "lucide-react"
import { Link } from "react-router"
import type { Customer, Order } from "@/types"
import { useGetCustomerById, useUpdateCustomer, useUpdateCustomerStatus, useDeleteCustomer, useGetOrders } from "@/hooks"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { CustomerFormDialog } from "./customers/customer-form-dialog"
import { CustomerDeleteDialog } from "./customers/customer-delete-dialog"

const statusStyles: Record<Customer["status"], string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  banned: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const orderStatusStyles: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function CustomerDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: customer, isPending } = useGetCustomerById(id)
  const { data: allOrders = [] } = useGetOrders()
  const updateCustomer = useUpdateCustomer()
  const updateCustomerStatus = useUpdateCustomerStatus()
  const deleteCustomerMutation = useDeleteCustomer()

  const customerOrders = allOrders.filter((order) => order.email === customer?.email)

  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const statusLabels: Record<Customer["status"], string> = {
    active: t("customers.active"),
    inactive: t("customers.inactive"),
    banned: t("customers.banned"),
  }

  const orderStatusLabels: Record<Order["status"], string> = {
    pending: t("orders.pending"),
    processing: t("orders.processing"),
    completed: t("orders.completed"),
    cancelled: t("orders.cancelled"),
  }

  const handleFormSubmit = async (data: Omit<Customer, "id">) => {
    if (!customer) return
    await updateCustomer.mutateAsync({ id: customer.id, data })
  }

  const handleDeleteConfirm = async () => {
    if (!customer) return
    await deleteCustomerMutation.mutateAsync(customer.id)
    navigate("/customers")
  }

  const handleBan = async () => {
    if (!customer) return
    await updateCustomerStatus.mutateAsync({ id: customer.id, status: "banned" })
  }

  const handleActivate = async () => {
    if (!customer) return
    await updateCustomerStatus.mutateAsync({ id: customer.id, status: "active" })
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

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <User className="size-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">{t("customers.notFound")}</h2>
        <Button variant="outline" onClick={() => navigate("/customers")}>
          <ArrowLeft className="mr-2 size-4" />
          {t("customers.backToCustomers")}
        </Button>
      </div>
    )
  }

  const initials = customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
  const formattedSpent = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(customer.totalSpent)
  const formattedDate = new Date(customer.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/customers")}>
          <ArrowLeft className="mr-2 size-4" />
          {t("customers.backToCustomers")}
        </Button>
        <div className="hidden sm:flex items-center gap-2">
          {customer.status === "banned" ? (
            <Button variant="outline" onClick={handleActivate}>
              <UserCheck className="mr-2 size-4" />
              {t("customers.activateCustomer")}
            </Button>
          ) : (
            <Button variant="outline" onClick={handleBan}>
              <Ban className="mr-2 size-4" />
              {t("customers.banCustomer")}
            </Button>
          )}
          <Button variant="outline" onClick={() => setFormDialogOpen(true)}>
            <Pencil className="mr-2 size-4" />
            {t("common.edit")}
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 size-4" />
            {t("common.delete")}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Avatar className="size-20">
          <AvatarImage src={customer.avatar} alt={customer.name} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <Badge variant="outline" className={cn("border-0", statusStyles[customer.status])}>
              {statusLabels[customer.status]}
            </Badge>
          </div>
          <p className="text-muted-foreground font-mono text-sm">{customer.id}</p>
        </div>
      </div>

      <div className="sm:hidden flex flex-wrap gap-2">
        {customer.status === "banned" ? (
          <Button variant="outline" size="sm" onClick={handleActivate}>
            <UserCheck className="mr-2 size-4" />
            {t("customers.activateCustomer")}
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={handleBan}>
            <Ban className="mr-2 size-4" />
            {t("customers.banCustomer")}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => setFormDialogOpen(true)}>
          <Pencil className="mr-2 size-4" />
          {t("common.edit")}
        </Button>
        <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
          <Trash2 className="mr-2 size-4" />
          {t("common.delete")}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="size-4" />
              {t("customers.contactInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="size-4 text-muted-foreground" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="size-4 text-muted-foreground" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="size-4 text-muted-foreground mt-0.5" />
              <span>{customer.address}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingBag className="size-4" />
              {t("customers.orderHistory")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("customers.totalOrders")}</span>
              <span className="font-semibold text-lg">{customer.totalOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("customers.totalSpent")}</span>
              <span className="font-semibold text-lg flex items-center gap-1">
                <DollarSign className="size-4" />
                {formattedSpent}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("customers.createdAt")}</span>
              <span className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                {formattedDate}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingBag className="size-4" />
            {t("customers.pastOrders")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customerOrders.length > 0 ? (
            <>
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("orders.orderId")}</TableHead>
                      <TableHead>{t("orders.product")}</TableHead>
                      <TableHead>{t("orders.amount")}</TableHead>
                      <TableHead>{t("orders.status")}</TableHead>
                      <TableHead>{t("orders.date")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Link
                            to={`/orders/${order.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {order.id}
                          </Link>
                        </TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(order.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("border-0", orderStatusStyles[order.status])}>
                            {orderStatusLabels[order.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-3">
                {customerOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/orders/${order.id}`}
                    className="block"
                  >
                    <Card className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-primary">{order.id}</span>
                              <Badge variant="outline" className={cn("border-0 text-xs", orderStatusStyles[order.status])}>
                                {orderStatusLabels[order.status]}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{order.product}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(order.amount)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <ShoppingBag className="size-12 mb-2 opacity-50" />
              <p>{t("customers.noOrders")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <CustomerFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        customer={customer}
        onSubmit={handleFormSubmit}
      />

      <CustomerDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        customer={customer}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
