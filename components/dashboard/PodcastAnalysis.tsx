'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Music, 
  Users, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Heart, 
  Share2, 
  MessageCircle,
  Star,
  Activity,
  Target,
  ThumbsUp,
  Award,
  Zap,
  Globe,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PodcastAnalysisData } from '@/store/podcastanalysis';

interface PodcastAnalysisProps {
  podcast: PodcastAnalysisData;
  onBack: () => void;
}

export function PodcastAnalysis({ podcast, onBack }: PodcastAnalysisProps) {
  const router = useRouter();

  const handleGeneration = () => {
    router.push('/selecciones/podcast/contents');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'marketing': return <Target className="w-8 h-8 text-white" />;
      case 'tecnologia': return <Zap className="w-8 h-8 text-white" />;
      case 'emprendimiento': return <TrendingUp className="w-8 h-8 text-white" />;
      default: return <Music className="w-8 h-8 text-white" />;
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'marketing': return 'from-pink-500 to-rose-500';
      case 'tecnologia': return 'from-blue-500 to-cyan-500';
      case 'emprendimiento': return 'from-green-500 to-emerald-500';
      default: return 'from-purple-500 to-violet-500';
    }
  };

  const getTopicColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Análisis de Podcast
              </h1>
              <p className="text-gray-600 mt-1">Insights detallados y métricas de rendimiento</p>
            </div>
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center space-x-2 hover:bg-gray-50 transition-colors border-gray-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </Button>
          </div>

          {/* Podcast Header Card */}
          <Card className="bg-gradient-to-r from-white to-blue-50 border-2 border-blue-200 shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Podcast Icon */}
                <div className={`w-20 h-20 bg-gradient-to-br ${getCategoryGradient(podcast.podcastId.split('-')[0] || 'default')} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  {getCategoryIcon(podcast.podcastId.split('-')[0] || 'default')}
                </div>

                {/* Podcast Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{podcast.title}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span><strong>Creador:</strong> {podcast.creator}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-green-600" />
                      <span><strong>Red:</strong> {podcast.network}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      <span><strong>Género:</strong> {podcast.genre}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span><strong>Duración:</strong> {podcast.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Overall Score */}
                <div className="text-center lg:text-right">
                  <div className="flex items-center justify-center lg:justify-end space-x-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-600">Score General</span>
                  </div>
                  <div className="text-4xl font-bold text-gray-900">{podcast.overallScore}/100</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métricas Principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Oyentes Totales</p>
                    <p className="text-2xl font-bold text-gray-900">{podcast.metrics.totalListeners.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Engagement</p>
                    <p className="text-2xl font-bold text-gray-900">{podcast.metrics.engagementRate}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Retención</p>
                    <p className="text-2xl font-bold text-gray-900">{podcast.metrics.retentionRate}%</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Descargas</p>
                    <p className="text-2xl font-bold text-gray-900">{podcast.metrics.downloadCount.toLocaleString()}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Análisis de Sentimientos y Temas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Análisis de Sentimientos */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Análisis de Sentimientos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Positivo</span>
                    <span className="text-sm font-medium text-green-600">{podcast.sentimentAnalysis.positive}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${podcast.sentimentAnalysis.positive}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Neutral</span>
                    <span className="text-sm font-medium text-blue-600">{podcast.sentimentAnalysis.neutral}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${podcast.sentimentAnalysis.neutral}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Negativo</span>
                    <span className="text-sm font-medium text-red-600">{podcast.sentimentAnalysis.negative}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${podcast.sentimentAnalysis.negative}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <strong>Confianza:</strong> {podcast.sentimentAnalysis.confidence}%
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Temas Principales */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <span>Temas Principales</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {podcast.topicAnalysis.slice(0, 4).map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <h4 className="font-medium text-gray-900">{topic.name}</h4>
                        <p className="text-sm text-gray-600">Relevancia: {topic.relevance}%</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${getTopicColor(topic.sentiment)}`}>
                        {topic.sentiment}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights Clave */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span>Insights Clave</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {podcast.keyInsights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                    <ThumbsUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recomendaciones */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-green-500" />
                <span>Recomendaciones</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {podcast.contentRecommendations.map((rec) => (
                  <div key={rec.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Impacto esperado: {rec.expectedImpact}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Botón de Generación */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
            <div className="text-center sm:text-left">
              <p className="text-gray-600">¿Listo para generar contenido basado en este análisis?</p>
            </div>
            <Button 
              onClick={handleGeneration}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Generar Contenido
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 