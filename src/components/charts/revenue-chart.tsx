import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useGetRevenueData } from "@/hooks";
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

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function RevenueChart() {
  const { t } = useTranslation();
  const { data = [], isPending } = useGetRevenueData();
  const [chartType, setChartType] = useState<ChartType>("line");

  const chartConfig = {
    value: {
      label: t("dashboard.revenue"),
      color: "var(--chart-1)",
    },
    value2: {
      label: t("dashboard.expenses"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const renderChart = () => {
    if (isPending) {
      return <Skeleton className="h-75 w-full rounded-lg" />;
    }

    switch (chartType) {
      case "line":
        return (
          <ChartContainer config={chartConfig} className="h-75 w-full">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="value2"
                stroke="var(--color-value2)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </LineChart>
          </ChartContainer>
        );
      case "bar":
        return (
          <ChartContainer config={chartConfig} className="h-75 w-full">
            <BarChart
              data={data}
              margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="value"
                fill="var(--color-value)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="value2"
                fill="var(--color-value2)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        );
      case "pie":
        return (
          <ChartContainer config={chartConfig} className="h-75 w-full">
            <PieChart>
              <Pie
                data={data.slice(0, 5)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
              >
                {data.slice(0, 5).map((_, index) => (
                  <Cell
                    key={index}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            {t("dashboard.revenueOverview")}
          </CardTitle>
          <CardDescription>{t("dashboard.monthlyRevenueExpenses")}</CardDescription>
        </div>
        <ChartTypeSelector value={chartType} onChange={setChartType} />
      </CardHeader>
      <CardContent className="pt-4 overflow-hidden">{renderChart()}</CardContent>
    </Card>
  );
}
