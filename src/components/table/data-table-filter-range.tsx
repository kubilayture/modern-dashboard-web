import type { Column } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"

interface DataTableFilterRangeProps<TData, TValue> {
  column: Column<TData, TValue>
}

export function DataTableFilterRange<TData, TValue>({
  column,
}: DataTableFilterRangeProps<TData, TValue>) {
  const filterValue = (column.getFilterValue() as [number, number]) ?? [undefined, undefined]

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        placeholder="Min"
        value={filterValue[0] ?? ""}
        onChange={(e) => {
          const val = e.target.value ? Number(e.target.value) : undefined
          column.setFilterValue((old: [number, number]) => [val, old?.[1]])
        }}
        className="h-8 w-20"
      />
      <span className="text-muted-foreground">-</span>
      <Input
        type="number"
        placeholder="Max"
        value={filterValue[1] ?? ""}
        onChange={(e) => {
          const val = e.target.value ? Number(e.target.value) : undefined
          column.setFilterValue((old: [number, number]) => [old?.[0], val])
        }}
        className="h-8 w-20"
      />
    </div>
  )
}
