'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { department: 'Engineering', days: 28 },
  { department: 'Product', days: 35 },
  { department: 'Design', days: 42 },
  { department: 'Marketing', days: 25 },
  { department: 'Sales', days: 30 },
];

const chartConfig = {
  days: {
    label: 'Days to Fill',
    color: 'hsl(var(--chart-1))',
  },
};

export function TimeToFillChart() {
  return (
     <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart 
                data={chartData}
                margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
            >
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey="department"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
            />
            <YAxis />
            <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="days" fill="var(--color-days)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
