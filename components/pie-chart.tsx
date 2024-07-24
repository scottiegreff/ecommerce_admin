"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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
} from "@/components/ui/chart";



// const chartData = [
//   { name: "test", revenue: 275, fill: "var(--color-chrome)" },
//   { name: "safari", revenue: 200, fill: "var(--color-safari)" },
//   { name: "firefox", revenue: 287, fill: "var(--color-firefox)" },
//   { name: "edge", revenue: 173, fill: "var(--color-edge)" },
//   { name: "other", revenue: 190, fill: "var(--color-other)" },
// ];

const chartConfig = {
  visitors: {
    label: "% of Product Revenue",
  },
 
} satisfies ChartConfig;

type ChartData = {
  name: string,
  revenue: number,
  fill: string
}[]

interface PieChartComProps {
  chartData: ChartData,
  timePeriod: Date,
}

export default function PieChartCom({ chartData, timePeriod }: PieChartComProps) {
  const totalRevenue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + Number(curr.revenue), 0);
  }, []);
  

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Revenue since</CardTitle>
        <CardDescription>
        {timePeriod.toDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              />
            <Pie
              data={chartData}
              dataKey="revenue"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              >
         
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                    
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          ${totalRevenue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Revenue
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
              
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {/* Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /> */}
        </div>
        <div className="leading-none text-muted-foreground">
        Showing total product sales since <p className="text-center mt-2">{timePeriod.toDateString()}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
