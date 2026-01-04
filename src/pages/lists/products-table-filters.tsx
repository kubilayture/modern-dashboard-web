import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import type { Table } from "@tanstack/react-table"
import type { Product } from "@/types"
import {
  DataTableFilterSelect,
  DataTableFilterRange,
} from "@/components/table"

interface ProductsTableFiltersProps {
  table: Table<Product>
  data: Product[]
}

export function ProductsTableFilters({ table, data }: ProductsTableFiltersProps) {
  const { t } = useTranslation()
  const categoryColumn = table.getColumn("category")
  const statusColumn = table.getColumn("status")
  const priceColumn = table.getColumn("price")

  const categoryOptions = useMemo(() => {
    const categories = [...new Set(data.map((p) => p.category))]
    return categories.map((category) => ({
      label: category,
      value: category,
    }))
  }, [data])

  const statusOptions = [
    { label: t("products.inStock"), value: "in_stock" },
    { label: t("products.lowStock"), value: "low_stock" },
    { label: t("products.outOfStock"), value: "out_of_stock" },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3 py-4">
      {categoryColumn && (
        <DataTableFilterSelect
          column={categoryColumn}
          title={t("products.category")}
          allLabel={t("products.allCategories")}
          options={categoryOptions}
        />
      )}
      {statusColumn && (
        <DataTableFilterSelect
          column={statusColumn}
          title={t("products.status")}
          allLabel={t("products.allStatus")}
          options={statusOptions}
        />
      )}
      {priceColumn && <DataTableFilterRange column={priceColumn} />}
    </div>
  )
}
