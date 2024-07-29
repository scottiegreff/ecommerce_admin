"use client";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const chartConfig = {
  product: {
    label: "Products",
    color: "#2563eb",
  },
  service: {
    label: "Services",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

type ChartData = {
  month: string;
  product: number;
  service: number;
}[];

interface BarChartComProps {
  chartData: ChartData;
}
function getRandomHexColor() {
  // Generate a random number between 0 and 0xFFFFFF, convert it to a hex string, and pad with leading zeros
  const randomColor = Math.floor(Math.random() * 0xffffff).toString(16);
  // Return the hex color code formatted with a leading '#'
  return `#${randomColor.padStart(6, "0")}`;
}

function BarChartCom({ chartData }: BarChartComProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="product" fill={getRandomHexColor()} radius={4} />
            <Bar dataKey="service" fill={getRandomHexColor()} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default BarChartCom;
