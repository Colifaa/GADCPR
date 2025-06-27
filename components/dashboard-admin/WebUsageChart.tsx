'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface WebUsageData {
  date: string;
  timeSpent: number;
  sessions: number;
}

interface WebUsageChartProps {
  data: WebUsageData[];
  chartConfig: any;
}

export function WebUsageChart({ data, chartConfig }: WebUsageChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span>Uso de la Web</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                fontSize={12}
              />
              <YAxis yAxisId="left" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="timeSpent"
                stroke="var(--color-timeSpent)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sessions"
                stroke="var(--color-sessions)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 