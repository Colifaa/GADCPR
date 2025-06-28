'use client';

import React, { useEffect, useState } from 'react';
import { DashboardAdminLayout } from '@/components/layout/DashboardAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useN8nStore, N8nData } from '@/store/n8n';
import { useN8nWebhook } from '@/hooks/use-n8n-webhook';
import { 
  Trash2, 
  RefreshCw, 
  Database, 
  Activity,
  Clock,
  BarChart3,
  MessageSquare,
  TrendingUp,
  Play,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function N8nDataPage() {
  const { data, lastReceived, clearData, getDataByStatus } = useN8nStore();
  const { 
    isConnected, 
    isPolling, 
    lastError, 
    testConnection, 
    simulateWebhook, 
    poll, 
    clearError 
  } = useN8nWebhook();

  // Stats básicas
  const totalRecords = data.length;
  const successRecords = getDataByStatus('success').length;
  const errorRecords = getDataByStatus('error').length;
  const processingRecords = getDataByStatus('processing').length;

  const handleRefresh = async () => {
    await poll();
  };

  const handleSimulateWebhook = async () => {
    try {
      await simulateWebhook();
    } catch (error) {
      console.error('Error simulando webhook:', error);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.1) return 'text-green-600';
    if (score < -0.1) return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <DashboardAdminLayout>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Database className="w-6 h-6 mr-2 text-purple-600" />
              Datos de n8n
            </h1>
            <p className="text-gray-600 mt-1">
              Gestión y visualización de datos recibidos desde n8n
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Indicador de conexión */}
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-600" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>

            <Button 
              onClick={handleSimulateWebhook}
              variant="default"
              className="flex items-center bg-purple-600 hover:bg-purple-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Simular webhook
            </Button>
            
            <Button 
              onClick={handleRefresh}
              variant="outline"
              disabled={isPolling}
              className="flex items-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isPolling ? 'animate-spin' : ''}`} />
              {isPolling ? 'Sincronizando...' : 'Actualizar'}
            </Button>
            
            <Button 
              onClick={clearData}
              variant="destructive"
              className="flex items-center"
              disabled={totalRecords === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar datos
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {lastError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <span className="text-red-800 text-sm font-medium">Error: {lastError}</span>
            </div>
            <Button 
              onClick={clearError}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-800"
            >
              Cerrar
            </Button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Registros</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Exitosos</p>
                  <p className="text-2xl font-bold text-gray-900">{successRecords}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Errores</p>
                  <p className="text-2xl font-bold text-gray-900">{errorRecords}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Procesando</p>
                  <p className="text-2xl font-bold text-gray-900">{processingRecords}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Último registro recibido */}
        {lastReceived && (
          <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                Último Registro Recibido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estado</p>
                  <Badge className={getStatusColor(lastReceived.status)}>
                    {lastReceived.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Sentimiento</p>
                  <span className={`font-semibold ${getSentimentColor(lastReceived.sentimentScore)}`}>
                    {lastReceived.sentimentLabel} ({lastReceived.sentimentScore})
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Timestamp</p>
                  <p className="text-sm text-gray-800">{formatTimestamp(lastReceived.timestamp)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de datos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Historial de Datos ({totalRecords} registros)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.length === 0 ? (
              <div className="text-center py-12">
                <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay datos disponibles
                </h3>
                <p className="text-gray-600 mb-4">
                  Los datos de n8n aparecerán aquí cuando se reciban webhooks
                </p>
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Verificar ahora
                </Button>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {data.map((item: N8nData) => (
                  <div 
                    key={item.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          ID: {item.id}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Texto Generado:</p>
                        <p className="text-gray-600 truncate">
                          {JSON.stringify(item.generatedText).substring(0, 100)}...
                        </p>
                      </div>
                      {item.explanation && (
                        <div>
                          <p className="font-medium text-gray-700">Explicación:</p>
                          <p className="text-gray-600 truncate">
                            {JSON.stringify(item.explanation).substring(0, 100)}...
                          </p>
                        </div>
                      )}
                      {item.content && (
                        <div>
                          <p className="font-medium text-gray-700">Contenido:</p>
                          <p className="text-gray-600 truncate">
                            {JSON.stringify(item.content).substring(0, 100)}...
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-700">Puntuación de Sentimiento:</p>
                        <span className={getSentimentColor(item.sentimentScore)}>
                          {item.sentimentScore}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Etiqueta de Sentimiento:</p>
                        <p className="text-gray-600">{item.sentimentLabel}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardAdminLayout>
  );
} 