
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartTooltipContent, ChartContainer } from './ui/chart';
import { format } from 'date-fns';

type ApplicationTrendsChartProps = {
  data: { month: string; total_applications: number; hired: number }[];
};

export default function ApplicationTrendsChart({ data }: ApplicationTrendsChartProps) {
  const chartConfig = {
    total_applications: {
      label: 'Applications',
      color: 'hsl(var(--chart-1))',
    },
    hired: {
      label: 'Hired',
      color: 'hsl(var(--chart-2))',
    },
  };

  const chartData = data.map(item => ({
    ...item,
    month: item.month,
  }));

  return (
    <div className="w-full h-[300px]">
       <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => format(new Date(value), "MMM")}
            />
             <YAxis tickLine={false} axisLine={false} />
            <Tooltip
                cursor={true}
                content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="total_applications" fill="var(--color-total_applications)" radius={4} />
            <Bar dataKey="hired" fill="var(--color-hired)" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
