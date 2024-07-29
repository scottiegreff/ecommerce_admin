"use client";
import PieChartCom from "@/components/pie-chart";
import { Bar, BarChart, CartesianGrid, XAxis, Area, AreaChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import React from "react";
import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

interface AreaChartComProps {
  chartData: ChartData;
}
function getRandomHexColor() {
  // Generate a random number between 0 and 0xFFFFFF, convert it to a hex string, and pad with leading zeros
  const randomColor = Math.floor(Math.random() * 0xffffff).toString(16);
  // Return the hex color code formatted with a leading '#'
  return `#${randomColor.padStart(6, "0")}`;
}

function AreaChartCom({ chartData }: AreaChartComProps) {

  // console.log("CHART DATA: ",chartData)
  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent >
        <ChartContainer className="md:h-[70vh] mx-auto" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="service"
              type="natural"
              fill={getRandomHexColor()}
              fillOpacity={0.4}
              stroke={getRandomHexColor()}
              stackId="a"
            />
            <Area
              dataKey="product"
              type="natural"
              fill={getRandomHexColor()}
              fillOpacity={0.4}
              stroke={getRandomHexColor()}
              stackId="a"
            />
          </AreaChart>
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

export default AreaChartCom;
