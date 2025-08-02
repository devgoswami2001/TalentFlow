'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ApplicationTrendsChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/monthly-stats/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${document.cookie.split('accessToken=')[1]?.split(';')[0]}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();

        const formatted = data.monthly_data.map((item) => ({
          month: item.month,
          applications: item.applications,
        }));

        setChartData(formatted);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchMonthlyStats();
  }, []);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <Tooltip />
          <Bar dataKey="applications" fill="#6366f1" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
