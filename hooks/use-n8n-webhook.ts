'use client';

import { useEffect, useCallback, useState } from 'react';
import { useN8nStore } from '@/store/n8n';

interface UseN8nWebhookOptions {
  enablePolling?: boolean;
  pollingInterval?: number;
  autoStart?: boolean;
}

export const useN8nWebhook = (options: UseN8nWebhookOptions = {}) => {
  const {
    enablePolling = false,
    pollingInterval = 5000, // 5 segundos por defecto
    autoStart = true
  } = options;

  const { addData } = useN8nStore();
  const [isConnected, setIsConnected] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Función para probar la conexión del webhook
  const testConnection = useCallback(async () => {
    try {
      const response = await fetch('/api/n8n/webhook', {
        method: 'GET',
      });
      
      if (response.ok) {
        setIsConnected(true);
        setLastError(null);
        return true;
      } else {
        setIsConnected(false);
        setLastError('Error de conexión con el webhook');
        return false;
      }
    } catch (error) {
      setIsConnected(false);
      setLastError(error instanceof Error ? error.message : 'Error desconocido');
      return false;
    }
  }, []);

  // Función para simular recibir datos (para testing)
  const simulateWebhook = useCallback(async (testData?: any) => {
    const mockData = testData || {
      status: 'COMPLETED',
      generatedText: 'Este es un texto de prueba generado por n8n. Contiene información relevante para el análisis de sentimientos.',
      sentimentScore: Math.random() * 2 - 1, // Entre -1 y 1
      sentimentLabel: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'][Math.floor(Math.random() * 3)],
      content: {
        title: "Prueba de Contenido",
        creator: "Simulador n8n",
        genre: "Tecnología",
        duration: 5,
        overallRating: 4,
        mainTopics: ["Webhook", "Testing", "n8n"],
        insights: "Esta es una simulación para probar el webhook de n8n con el formato real de datos.",
        recommendations: "Verificar que todos los campos se procesen correctamente."
      }
    };

    try {
      const response = await fetch('/api/n8n/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Agregar al store local también
          addData(mockData);
        }
        return result;
      } else {
        throw new Error('Error al enviar datos de prueba');
      }
    } catch (error) {
      setLastError(error instanceof Error ? error.message : 'Error al simular webhook');
      throw error;
    }
  }, [addData]);

  // Función para polling manual
  const poll = useCallback(async () => {
    if (isPolling) return;
    
    setIsPolling(true);
    try {
      await testConnection();
      // Aquí podrías agregar lógica adicional de polling si necesitas
      // verificar por datos pendientes en el servidor
    } catch (error) {
      console.error('Error durante polling:', error);
    } finally {
      setIsPolling(false);
    }
  }, [isPolling, testConnection]);

  // Función para enviar datos manualmente al store
  const receiveData = useCallback((data: any) => {
    addData(data);
  }, [addData]);

  // Efecto para polling automático
  useEffect(() => {
    if (!enablePolling) return;

    const interval = setInterval(poll, pollingInterval);
    return () => clearInterval(interval);
  }, [enablePolling, pollingInterval, poll]);

  // Efecto para test inicial de conexión
  useEffect(() => {
    if (autoStart) {
      testConnection();
    }
  }, [autoStart, testConnection]);

  return {
    // Estado
    isConnected,
    isPolling,
    lastError,
    
    // Funciones
    testConnection,
    simulateWebhook,
    poll,
    receiveData,
    
    // Helpers
    clearError: () => setLastError(null),
  };
}; 