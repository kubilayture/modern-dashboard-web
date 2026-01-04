import { useTranslation } from "react-i18next"
import type { Table } from "@tanstack/react-table"
import type { Order } from "@/types"
import {
  DataTableFilterSelect,
  DataTableFilterRange,
  DataTableFilterDateRange,
} from "@/components/table"

interface OrdersTableFiltersProps {
  table: Table<Order>
}

export function OrdersTableFilters({ table }: OrdersTableFiltersProps) {
  const { t } = useTranslation()
  const statusColumn = table.getColumn("status")
  const amountColumn = table.getColumn("amount")
  const dateColumn = table.getColumn("date")

  const statusOptions = [
    { label: t("orders.pending"), value: "pending" },
    { label: t("orders.processing"), value: "processing" },
    { label: t("orders.completed"), value: "completed" },
    { label: t("orders.cancelled"), value: "cancelled" },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3 py-4">
      {statusColumn && (
        <DataTableFilterSelect
          column={statusColumn}
          title={t("orders.status")}
          options={statusOptions}
        />
      )}
      {amountColumn && <DataTableFilterRange column={amountColumn} />}
      {dateColumn && <DataTableFilterDateRange column={dateColumn} />}
    </div>
  )
}
