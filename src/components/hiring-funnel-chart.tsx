
'use client';

import { Funnel, FunnelChart, LabelList, ResponsiveContainer, Tooltip } from 'recharts';
import { applicants } from '@/lib/data';
import { ChartContainer, ChartTooltipContent } from './ui/chart';

const statusOrder = ['Applied', 'Shortlisted', 'Interview', 'Offer', 'Hired'];

const funnelData = statusOrder.map((status, index) => {
    const count = applicants.filter(a => {
        // A candidate who is 'Hired' has also been 'Applied', 'Shortlisted', etc.
        const statusIndex = statusOrder.indexOf(a.status);
        return statusIndex >= index;
    }).length;
    return { name: status, value: count, fill: `hsl(var(--chart-${index + 1}))` };
});

const chartConfig = {
    value: {
        label: 'Candidates',
    },
    Applied: { label: 'Applied', color: 'hsl(var(--chart-1))' },
    Shortlisted: { label: 'Shortlisted', color: 'hsl(var(--chart-2))' },
    Interview: { label: 'Interview', color: 'hsl(var(--chart-3))' },
    Offer: { label: 'Offer', color: 'hsl(var(--chart-4))' },
    Hired: { label: 'Hired', color: 'hsl(var(--chart-5))' },
} as const;


export function HiringFunnelChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
                <Tooltip 
                  content={<ChartTooltipContent nameKey="name"/>}
                />
                <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive
                    lastShapeType="rectangle"
                >
                  <LabelList position="right" fill="hsl(var(--foreground))" stroke="none" dataKey="name" className="text-sm font-medium"/>
                  <LabelList 
                    position="center" 
                    dataKey="value" 
                    className="text-lg font-bold fill-primary-foreground" 
                  />
                </Funnel>
            </FunnelChart>
        </ResponsiveContainer>
    </ChartContainer>
  );
}
