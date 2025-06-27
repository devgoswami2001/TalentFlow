'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

const chartData = [
  { source: 'LinkedIn', value: 275, fill: 'var(--color-linkedin)' },
  { source: 'Indeed', value: 200, fill: 'var(--color-indeed)' },
  { source: 'Referrals', value: 187, fill: 'var(--color-referrals)' },
  { source: 'Website', value: 150, fill: 'var(--color-website)' },
  { source: 'Other', value: 75, fill: 'var(--color-other)' },
];

const chartConfig = {
    value: {
        label: "Applicants"
    },
    linkedin: {
        label: "LinkedIn",
        color: "hsl(var(--chart-1))",
    },
    indeed: {
        label: "Indeed",
        color: "hsl(var(--chart-2))",
    },
    referrals: {
        label: "Referrals",
        color: "hsl(var(--chart-3))",
    },
    website: {
        label: "Company Website",
        color: "hsl(var(--chart-4))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-5))",
    },
};

export function SourceOfHireChart() {
  return (
    <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="source" />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="source"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={0}
              >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="source" />}
                className="-mt-4 flex-wrap"
              />
            </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
