import { BarChart3, LineChart, PieChart } from "lucide-react"
import { cn } from "@/lib/utils"

export type ChartType = "line" | "bar" | "pie"

interface ChartTypeSelectorProps {
  value: ChartType
  onChange: (type: ChartType) => void
  options?: ChartType[]
}

const icons: Record<ChartType, typeof LineChart> = {
  line: LineChart,
  bar: BarChart3,
  pie: PieChart,
}

export function ChartTypeSelector({
  value,
  onChange,
  options = ["line", "bar", "pie"],
}: ChartTypeSelectorProps) {
  return (
    <div className="flex rounded-lg bg-muted p-1">
      {options.map((type) => {
        const Icon = icons[type]
        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={cn(
              "flex size-8 items-center justify-center rounded-md transition-colors",
              value === type
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
          </button>
        )
      })}
    </div>
  )
}
