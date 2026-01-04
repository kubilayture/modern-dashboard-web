import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useGetCategoryData } from "@/hooks";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartTypeSelector, type ChartType } from "./chart-type-selector";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function CategoryChart() {
  const { t } = useTranslation();
  const { data = [], isPending } = useGetCategoryData();
  const [chartType, setChartType] = useState<ChartType>("bar");

  const chartConfig = {
    value: {
      label: t("dashboard.sales"),
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const renderChart = () => {
    if (isPending) {
      return <Skeleton className="h-75 w-full rounded-lg" />;
    }

    switch (chartType) {
      case "bar":
        return (
          <ChartContainer config={chartConfig} className="h-75 w-full">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                width={80}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        );
      case "pie":
        return (
          <ChartContainer config={chartConfig} className="h-75 w-full">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            {t("dashboard.salesByCategory")}
          </CardTitle>
          <CardDescription>{t("dashboard.productCategoryBreakdown")}</CardDescription>
        </div>
        <ChartTypeSelector
          value={chartType}
          onChange={setChartType}
          options={["bar", "pie"]}
        />
      </CardHeader>
      <CardContent className="pt-4 overflow-hidden">{renderChart()}</CardContent>
    </Card>
  );
}
