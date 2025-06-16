'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboardStore } from '@/store/dashboard';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function ContentGenerator() {
  const [contentType, setContentType] = useState<'post' | 'video' | 'podcast' | 'story'>('post');
  const [platform, setPlatform] = useState<'instagram' | 'twitter' | 'youtube' | 'tiktok' | 'linkedin' | 'spotify'>('instagram');
  
  const { generateContent, isLoading } = useDashboardStore();

  const handleGenerate = async () => {
    try {
      await generateContent(contentType, platform);
      toast.success('¡Contenido generado con éxito!');
    } catch (error) {
      toast.error('Error al generar el contenido');
    }
  };

  const contentTypes = [
    { value: 'post', label: 'Publicación para Redes Sociales' },
    { value: 'video', label: 'Guión de Video' },
    { value: 'podcast', label: 'Episodio de Podcast' },
    { value: 'story', label: 'Contenido para Stories' }
  ];

  const platforms = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'spotify', label: 'Spotify' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <span>Generar Nuevo Contenido</span>
        </CardTitle>
        <CardDescription>
          Crea contenido atractivo usando nuestro generador impulsado por IA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Contenido</label>
            <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Plataforma</label>
            <Select value={platform} onValueChange={(value: any) => setPlatform(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          onClick={handleGenerate} 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generar Contenido
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}