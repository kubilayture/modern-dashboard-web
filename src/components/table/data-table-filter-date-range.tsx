import type { Column } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"

interface DataTableFilterDateRangeProps<TData, TValue> {
  column: Column<TData, TValue>
}

export function DataTableFilterDateRange<TData, TValue>({
  column,
}: DataTableFilterDateRangeProps<TData, TValue>) {
  const filterValue = (column.getFilterValue() as [string, string]) ?? ["", ""]

  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        value={filterValue[0] ?? ""}
        onChange={(e) => {
          column.setFilterValue((old: [string, string]) => [e.target.value, old?.[1]])
        }}
        className="h-8 w-[140px]"
      />
      <span className="text-muted-foreground">-</span>
      <Input
        type="date"
        value={filterValue[1] ?? ""}
        onChange={(e) => {
          column.setFilterValue((old: [string, string]) => [old?.[0], e.target.value])
        }}
        className="h-8 w-[140px]"
      />
    </div>
  )
}
