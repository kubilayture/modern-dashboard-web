import { useTranslation } from "react-i18next";
import type { Column } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableFilterSelectProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  allLabel?: string;
  options: { label: string; value: string }[];
}

export function DataTableFilterSelect<TData, TValue>({
  column,
  title,
  allLabel,
  options,
}: DataTableFilterSelectProps<TData, TValue>) {
  const { t } = useTranslation();
  const filterValue = column.getFilterValue() as string | undefined;

  return (
    <Select
      value={filterValue ?? "all"}
      onValueChange={(value) =>
        column.setFilterValue(value === "all" ? undefined : value)
      }
    >
      <SelectTrigger className="h-8 w-40">
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel ?? t("orders.allStatus")}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
