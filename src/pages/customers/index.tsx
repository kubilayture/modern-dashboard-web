import { useState, useMemo } from "react"
import { useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Search, X, Plus, ChevronDown } from "lucide-react"
import type { Customer } from "@/types"
import { useGetCustomers, useCreateCustomer, useUpdateCustomer, useUpdateCustomerStatus, useDeleteCustomer } from "@/hooks"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DataTablePagination,
  DataTableViewOptions,
  DataTableLoading,
  DataTableEmpty,
} from "@/components/table"
import { CustomerCard, CustomerCardSkeleton } from "@/components/cards"
import { useCustomersColumns } from "./customers-columns"
import { CustomerFormDialog } from "./customer-form-dialog"
import { CustomerDeleteDialog } from "./customer-delete-dialog"

const ITEMS_PER_PAGE = 6

export function CustomersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: customers = [], isPending } = useGetCustomers()
  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()
  const updateCustomerStatus = useUpdateCustomerStatus()
  const deleteCustomerMutation = useDeleteCustomer()

  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState("")

  const [mobileSearch, setMobileSearch] = useState("")
  const [mobileStatusFilter, setMobileStatusFilter] = useState<string>("all")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const filteredCustomers = useMemo(() => {
    let result = customers

    if (mobileSearch) {
      const search = mobileSearch.toLowerCase()
      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(search) ||
          customer.email.toLowerCase().includes(search) ||
          customer.phone.toLowerCase().includes(search)
      )
    }

    if (mobileStatusFilter !== "all") {
      result = result.filter((customer) => customer.status === mobileStatusFilter)
    }

    return result
  }, [customers, mobileSearch, mobileStatusFilter])

  const visibleCustomers = filteredCustomers.slice(0, visibleCount)
  const hasMore = visibleCount < filteredCustomers.length

  const handleAddClick = () => {
    setEditingCustomer(null)
    setFormDialogOpen(true)
  }

  const handleViewClick = (customer: Customer) => {
    navigate(`/customers/${customer.id}`)
  }

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormDialogOpen(true)
  }

  const handleDeleteClick = (customer: Customer) => {
    setDeletingCustomer(customer)
    setDeleteDialogOpen(true)
  }

  const handleToggleStatus = async (customer: Customer) => {
    const newStatus = customer.status === "banned" ? "active" : "banned"
    await updateCustomerStatus.mutateAsync({ id: customer.id, status: newStatus })
  }

  const handleBanClick = async (customer: Customer) => {
    await updateCustomerStatus.mutateAsync({ id: customer.id, status: "banned" })
  }

  const handleActivateClick = async (customer: Customer) => {
    await updateCustomerStatus.mutateAsync({ id: customer.id, status: "active" })
  }

  const handleFormSubmit = async (data: Omit<Customer, "id">) => {
    if (editingCustomer) {
      await updateCustomer.mutateAsync({ id: editingCustomer.id, data })
    } else {
      await createCustomer.mutateAsync(data)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingCustomer) return
    await deleteCustomerMutation.mutateAsync(deletingCustomer.id)
    setDeletingCustomer(null)
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
  }

  const handleResetMobileFilters = () => {
    setMobileSearch("")
    setMobileStatusFilter("all")
    setVisibleCount(ITEMS_PER_PAGE)
  }

  const columns = useCustomersColumns({
    onView: handleViewClick,
    onEdit: handleEditClick,
    onDelete: handleDeleteClick,
    onBan: handleBanClick,
    onActivate: handleActivateClick,
  })

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  })

  const isFiltered = columnFilters.length > 0 || globalFilter !== ""
  const isMobileFiltered = mobileSearch !== "" || mobileStatusFilter !== "all"

  return (
    <div className="space-y-6">
      <div className="hidden lg:block">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex flex-col justify-between space-y-2">
              <CardTitle>{t("customers.title")}</CardTitle>
              <CardDescription>{t("customers.description")}</CardDescription>
            </div>
            <Button onClick={handleAddClick}>
              <Plus className="mr-2 size-4" />
              {t("customers.addCustomer")}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder={t("customers.searchPlaceholder")}
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="h-9 pl-8"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                    onValueChange={(value) =>
                      table.getColumn("status")?.setFilterValue(value === "all" ? undefined : [value])
                    }
                  >
                    <SelectTrigger className="h-9 w-35">
                      <SelectValue placeholder={t("customers.allStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("customers.allStatus")}</SelectItem>
                      <SelectItem value="active">{t("customers.active")}</SelectItem>
                      <SelectItem value="inactive">{t("customers.inactive")}</SelectItem>
                      <SelectItem value="banned">{t("customers.banned")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {isFiltered && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        table.resetColumnFilters()
                        setGlobalFilter("")
                      }}
                      className="h-8 px-2 lg:px-3"
                    >
                      {t("common.reset")}
                      <X className="ml-2 size-4" />
                    </Button>
                  )}
                  <DataTableViewOptions table={table} />
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {isPending ? (
                      <DataTableLoading columns={columns.length} />
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length}>
                          <DataTableEmpty />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination table={table} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:hidden space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{t("customers.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("customers.description")}</p>
          </div>
          <Button size="sm" onClick={handleAddClick}>
            <Plus className="mr-2 size-4" />
            {t("customers.addCustomer")}
          </Button>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder={t("customers.searchPlaceholder")}
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
                <SelectValue placeholder={t("customers.allStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("customers.allStatus")}</SelectItem>
                <SelectItem value="active">{t("customers.active")}</SelectItem>
                <SelectItem value="inactive">{t("customers.inactive")}</SelectItem>
                <SelectItem value="banned">{t("customers.banned")}</SelectItem>
              </SelectContent>
            </Select>

            {isMobileFiltered && (
              <Button variant="ghost" size="sm" onClick={handleResetMobileFilters}>
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {isPending ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <CustomerCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("common.noResults")}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {visibleCustomers.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onView={handleViewClick}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onToggleStatus={handleToggleStatus}
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
              {visibleCustomers.length} / {filteredCustomers.length}
            </p>
          </>
        )}
      </div>

      <CustomerFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        customer={editingCustomer}
        onSubmit={handleFormSubmit}
      />

      <CustomerDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        customer={deletingCustomer}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
