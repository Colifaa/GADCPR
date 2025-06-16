'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDashboardStore } from '@/store/dashboard';
import { Calendar, Eye, Heart, MessageCircle, Share, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export function RecentContent() {
  const { recentContent, deleteContent } = useDashboardStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return 'bg-pink-100 text-pink-800';
      case 'twitter':
        return 'bg-blue-100 text-blue-800';
      case 'linkedin':
        return 'bg-blue-100 text-blue-800';
      case 'youtube':
        return 'bg-red-100 text-red-800';
      case 'tiktok':
        return 'bg-black text-white';
      case 'spotify':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'scheduled':
        return 'Programado';
      case 'draft':
        return 'Borrador';
      case 'failed':
        return 'Fallido';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contenido Reciente</CardTitle>
        <CardDescription>
          Tu contenido generado y publicado más reciente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentContent.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aún no hay contenido generado. ¡Usa el generador de arriba para crear tu primera pieza!
          </div>
        ) : (
          recentContent.map((item) => (
            <div key={item.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium truncate">{item.title}</h3>
                  <Badge className={getStatusColor(item.status)}>
                    {getStatusLabel(item.status)}
                  </Badge>
                  <Badge className={getPlatformColor(item.platform)}>
                    {item.platform}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(item.createdAt, 'MMM d, yyyy')}</span>
                  </div>
                  
                  {item.engagement && (
                    <>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{item.engagement.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{item.engagement.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{item.engagement.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Share className="h-4 w-4" />
                        <span>{item.engagement.shares}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteContent(item.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}