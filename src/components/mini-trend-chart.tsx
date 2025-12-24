
'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartTooltipContent, ChartContainer } from './ui/chart';

type MiniTrendChartProps = {
  data: { date: string; [key: string]: any }[];
  dataKey: string;
};

export default function MiniTrendChart({ data, dataKey }: MiniTrendChartProps) {
  const chartConfig = {
    [dataKey]: {
      label: dataKey.charAt(0).toUpperCase() + dataKey.slice(1),
      color: 'hsl(var(--chart-1))',
    },
  };
  
  // Use a derived key for the line stroke color to avoid conflicts if dataKey is e.g. "total"
  const colorKey = `${dataKey}Color`;
   const finalChartConfig = {
      ...chartConfig,
      [colorKey]: {
          color: 'hsl(var(--chart-1))'
      }
  }


  return (
    <ChartContainer config={finalChartConfig} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent hideIndicator hideLabel />}
          />
          <Line
            dataKey={dataKey}
            type="monotone"
            stroke={`var(--color-${colorKey})`}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
