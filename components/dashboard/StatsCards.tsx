'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStore } from '@/store/dashboard';
import { TrendingUp, FileText, Heart, Zap } from 'lucide-react';

export function StatsCards() {
  const { stats } = useDashboardStore();

  const cards = [
    {
      title: 'Contenido Total',
      value: stats.totalContent,
      icon: FileText,
      description: 'Piezas de contenido creadas',
      color: 'text-blue-600'
    },
    {
      title: 'Publicado este Mes',
      value: stats.publishedThisMonth,
      icon: TrendingUp,
      description: 'Contenido publicado',
      color: 'text-green-600'
    },
    {
      title: 'Interacción Total',
      value: stats.totalEngagement,
      icon: Heart,
      description: 'Me gusta, compartidos y comentarios',
      color: 'text-pink-600'
    },
    {
      title: 'Créditos Restantes',
      value: stats.creditsRemaining,
      icon: Zap,
      description: `${stats.creditsUsed} usados este mes`,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}