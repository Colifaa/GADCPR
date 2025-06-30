'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { UserPlus, Activity, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface RecentUsersData {
  date: string;
  registrations: number;
  verified: number;
}

interface UserRetentionData {
  period: string;
  retention: number;
}

interface UserActivityData {
  hour: string;
  active: number;
}

interface UserAnalysisChartsProps {
  recentUsers: RecentUsersData[];
  userRetention: UserRetentionData[];
  userActivity: UserActivityData[];
  chartConfig: any;
}

export function UserAnalysisCharts({ 
  recentUsers, 
  userRetention, 
  userActivity, 
  chartConfig 
}: UserAnalysisChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Últimos Usuarios Registrados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-green-600" />
            <span>Registros Recientes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentUsers} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="registrations" fill="var(--color-registrations)" />
                <Bar dataKey="verified" fill="var(--color-verified)" />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Retención de Usuarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-purple-600" />
            <span>Retención de Usuarios</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userRetention} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" fontSize={12} />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="retention"
                  stroke="var(--color-retention)"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Actividad por Hora */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Actividad por Hora</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userActivity} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" fontSize={12} />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="active"
                  stroke="var(--color-active)"
                  fill="var(--color-active)"
                  fillOpacity={0.7}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
} 