import { useState } from "react"
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
import { Search, X } from "lucide-react"
import type { Order } from "@/types"
import { useGetOrders, useUpdateOrderStatus } from "@/hooks"
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
  DataTablePagination,
  DataTableViewOptions,
  DataTableLoading,
  DataTableEmpty,
} from "@/components/table"
import { useOrdersColumns } from "./orders-columns"
import { OrdersTableFilters } from "./orders-table-filters"
import { OrderStatusDialog } from "./order-status-dialog"

export function OrdersTable() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: orders = [], isPending } = useGetOrders()
  const updateOrderStatus = useUpdateOrderStatus()

  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

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

  const ordersColumns = useOrdersColumns({
    onView: handleViewClick,
    onChangeStatus: handleChangeStatusClick,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data: orders,
    columns: ordersColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  const isFiltered = columnFilters.length > 0 || globalFilter !== ""

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder={t("orders.searchPlaceholder")}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-9 pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
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
      <OrdersTableFilters table={table} />
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
              <DataTableLoading columns={ordersColumns.length} />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={ordersColumns.length}>
                  <DataTableEmpty />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />

      <OrderStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        order={selectedOrder}
        onSubmit={handleStatusChange}
      />
    </div>
  )
}
