'use client';

import React, { useEffect } from 'react';
import { PodcastAnalysis } from '@/components/dashboard/PodcastAnalysis';
import { usePodcastAnalysisStore } from '@/store/podcastanalysis';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function PodcastPage() {
  const router = useRouter();
  const { currentAnalysis } = usePodcastAnalysisStore();

  // Si no hay un análisis activo, regresar a la pantalla de selecciones
  useEffect(() => {
    if (!currentAnalysis) {
      router.push('/selecciones');
    }
  }, [currentAnalysis, router]);

  // Mostrar estado de carga mientras redirige o espera datos
  if (!currentAnalysis) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando análisis...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Renderizar el análisis existente
  return (
      <PodcastAnalysis
        podcast={currentAnalysis}
        onBack={() => router.push('/selecciones')}
      />

  );
} 