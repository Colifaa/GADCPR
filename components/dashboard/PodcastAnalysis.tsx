'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PodcastAnalysisProps {
  podcast: {
    id: string;
    title: string;
    creator?: string;
    network?: string;
    genre?: string;
    theme?: string;
    subtheme?: string;
    duration?: string;
    listeners?: string;
    description?: string;
  };
  onBack: () => void;
}

export function PodcastAnalysis({ podcast, onBack }: PodcastAnalysisProps) {
  const router = useRouter();

  const handleGeneration = () => {
    // Navegar a la página de generación de contenido
    router.push('/seleccion');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Selección del podcast</h1>
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* Podcast Info Section */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-6">
            {/* Podcast Image */}
            <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-300 rounded-sm"></div>
              </div>
            </div>

            {/* Podcast Details */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {podcast.title || 'Estrategias para el crecimiento de comunidades'}
              </h2>
              
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Creador:</span> {podcast.creator || 'Mariam Lopez'}
                </div>
                <div>
                  <span className="font-medium">Red:</span> {podcast.network || ''}
                </div>
                <div>
                  <span className="font-medium">Género:</span> {podcast.genre || 'Educacional'}
                </div>
                <div>
                  <span className="font-medium">Tema:</span> {podcast.theme || 'Crecimiento de comunidades'}
                </div>
                <div>
                  <span className="font-medium">Subtema:</span> {podcast.subtheme || 'Uso de Redes Sociales:'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gray-100">
            <CardContent className="p-6 text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Subtema principal</h3>
              <p className="text-lg font-bold text-gray-900">
                {podcast.subtheme || 'Uso de Redes Sociales:'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-100">
            <CardContent className="p-6 text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Duración del episodio</h3>
              <p className="text-lg font-bold text-gray-900">
                {podcast.duration || '02:00:00h'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-100">
            <CardContent className="p-6 text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Número de oyentes</h3>
              <p className="text-lg font-bold text-gray-900">
                {podcast.listeners || '0600'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed mb-4">
            {podcast.description || 
            'El podcast se centra en técnicas y estrategias para fomentar el crecimiento de comunidades, especialmente en el contexto digital. Se abordan temas como la creación de contenido valioso, la interacción efectiva con miembros, y el uso de plataformas de redes sociales para aumentar el alcance.'}
          </p>
          <p className="text-gray-700 leading-relaxed">
            El podcast destaca que el crecimiento de una comunidad requiere un enfoque multifacético, que combine la creación de contenido de calidad, la interacción efectiva y el análisis constante. Las estrategias discutidas pueden ser aplicadas tanto por comunidades digitales como físicas.
          </p>
        </div>

        {/* Generation Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleGeneration}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            Generación
          </Button>
        </div>
      </div>
    </div>
  );
} 