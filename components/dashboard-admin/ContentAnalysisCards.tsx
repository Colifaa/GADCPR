'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { TrendingUp, ArrowDown, ArrowUp, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface TopicData {
  topic: string;
  views: number;
  growth: number;
}

interface PlatformData {
  platform: string;
  posts: number;
  engagement: number;
  reach: number;
  color: string;
}

interface ContentAnalysisCardsProps {
  trendingTopics: TopicData[];
  leastVisitedTopics: TopicData[];
  platformStats: PlatformData[];
  chartConfig: any;
}

export function ContentAnalysisCards({ 
  trendingTopics, 
  leastVisitedTopics, 
  platformStats, 
  chartConfig 
}: ContentAnalysisCardsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Temas en Tendencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Temas en Tendencia</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendingTopics.map((topic, index) => (
              <div key={topic.topic} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{topic.topic}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {topic.views.toLocaleString()} vistas
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-green-600 flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {topic.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Temas Menos Visitados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowDown className="h-5 w-5 text-red-600" />
            <span>Temas Menos Visitados</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leastVisitedTopics.map((topic, index) => (
              <div key={topic.topic} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{topic.topic}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {topic.views.toLocaleString()} vistas
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-red-600 flex items-center">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    {Math.abs(topic.growth)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mejores Plataformas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-orange-600" />
            <span>Mejores Plataformas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ChartContainer config={chartConfig} className="aspect-square w-full max-w-[350px] mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformStats}
                  dataKey="posts"
                  nameKey="platform"
                  cx="50%"
                  cy="50%"
                  outerRadius="75%"
                  label={({ platform, percent }) => `${platform} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={11}
                >
                  {platformStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                          <p className="font-medium">{data.platform}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Posts: {data.posts.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Engagement: {data.engagement}%
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Alcance: {data.reach.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
} 