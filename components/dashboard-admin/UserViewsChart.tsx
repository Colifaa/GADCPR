'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Eye } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface UserViewsData {
  date: string;
  views: number;
  uniqueVisitors: number;
}

interface UserViewsChartProps {
  data: UserViewsData[];
  chartConfig: any;
}

export function UserViewsChart({ data, chartConfig }: UserViewsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5 text-green-600" />
          <span>Vistas de Usuario</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="views"
                stackId="1"
                stroke="var(--color-views)"
                fill="var(--color-views)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="uniqueVisitors"
                stackId="2"
                stroke="var(--color-uniqueVisitors)"
                fill="var(--color-uniqueVisitors)"
                fillOpacity={0.6}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 