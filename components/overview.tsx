"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface OverviewProps {
  data: any[]
};

export const Overview: React.FC<OverviewProps> = ({
  data
}) => {
  function getRandomHexColor() {
    // Generate a random number between 0 and 0xFFFFFF, convert it to a hex string, and pad with leading zeros
    const randomColor = Math.floor(Math.random() * 0xffffff).toString(16);
    // Return the hex color code formatted with a leading '#'
    return `#${randomColor.padStart(6, "0")}`;
  }
  return (
    
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="total" fill={getRandomHexColor()} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
};
