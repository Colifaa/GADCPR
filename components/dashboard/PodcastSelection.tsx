'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Search, Music, Play, Pause, Volume2, Maximize2, MoreHorizontal, Clock, Users, Star, ChevronLeft, ChevronRight, BarChart3, TrendingUp, Activity, Filter, SortAsc, SortDesc } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePodcastStore, type Episode, type Review, type PodcastData } from '@/store/podcasts';
import { usePodcastAnalysisStore } from '@/store/podcastanalysis';
import { useHistoryStore } from '@/store/history';
import { useProjectsStore } from '@/store/projects';

export function PodcastSelection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAnalysisView, setShowAnalysisView] = useState(false);
  const [showEpisodesView, setShowEpisodesView] = useState(false);
  const [showReviewsView, setShowReviewsView] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  // Función para formatear tiempo en formato MM:SS
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Zustand stores
  const {
    podcastDatabase,
    selectedPodcast,
    selectedEpisode,
    isPlaying,
    currentPodcastPage,
    currentReviewPage,
    podcastsPerPage,
    reviewsPerPage,
    audioPlayer,
    setSelectedPodcast,
    setSelectedEpisode,
    setCurrentPodcastPage,
    setCurrentReviewPage,
    filterPodcasts,
    togglePlayPause,
    seekTo,
    setVolume,
    setPlaybackRate
  } = usePodcastStore();

  // Store de análisis de podcast
  const {
    currentAnalysis,
    isAnalyzing,
    analysisProgress,
    error: analysisError,
    startAnalysis,
    clearAnalysis,
    getAnalysisByPodcastId
  } = usePodcastAnalysisStore();

  // Store de historial
  const { addEntry } = useHistoryStore();

  // Store de proyectos
  const { addProject } = useProjectsStore();

  // Obtener categorías únicas
  const categories = Array.from(new Set(podcastDatabase.map(p => p.category)));

  // Función para filtrar y ordenar podcasts
  const getFilteredAndSortedPodcasts = () => {
    let filtered = podcastDatabase;

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      filtered = filterPodcasts(searchQuery);
    }

    // Filtrar por categoría
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Ordenar por rating (siempre de mayor a menor)
    filtered = [...filtered].sort((a, b) => {
      const aRating = a.rating || 0;
      const bRating = b.rating || 0;
      return bRating - aRating;
    });

    return filtered;
  };

  const filteredPodcasts = getFilteredAndSortedPodcasts();

  const handlePodcastClick = (podcast: PodcastData) => {
    if (selectedPodcast?.id === podcast.id) {
      // Si el podcast ya está seleccionado, cerrar la preview
      setSelectedPodcast(null);
    } else {
      // Si es un podcast diferente, abrir la preview
      setSelectedPodcast(podcast);
      setCurrentReviewPage(1); // Reset review page when selecting new podcast
    }
  };

  const handlePlayPause = async () => {
    await togglePlayPause();
  };

  const handleAnalyzeClick = async () => {
    if (selectedPodcast) {
      setShowAnalysisView(true);
      await startAnalysis(selectedPodcast.id, selectedPodcast);
    }
  };

  // Efecto para navegar al análisis completo cuando termine
  useEffect(() => {
    if (currentAnalysis && !isAnalyzing && showAnalysisView && selectedPodcast) {
      // Guardar en el historial cuando el análisis se complete
      const historyEntry = {
        title: `Análisis: ${selectedPodcast.title}`,
        podcastTitle: selectedPodcast.title,
        podcastAuthor: selectedPodcast.author || 'Autor desconocido',
        episodeTitle: selectedEpisode?.title,
        type: 'podcast' as const,
        status: 'completed' as const,
        analysisData: {
          summary: `Análisis completo del podcast "${selectedPodcast.title}" realizado con éxito.`,
          keyPoints: [
            'Análisis de contenido',
            'Extracción de insights',
            'Generación de resumen'
          ],
          insights: [
            'Contenido procesado exitosamente',
            'Datos extraídos para análisis posterior'
          ],
          duration: selectedEpisode?.duration || '00:00'
        }
      };

      addEntry(historyEntry);

      // Generar contenido mock basado en el podcast y guardarlo en proyectos
      const generateMockContent = () => {
        const contentTypes = ['text', 'image', 'video', 'gif', 'infografia', 'presentacion'] as const;
        const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
        
        const contentTemplates = {
          text: {
            type: 'text' as const,
            title: `Post para ${selectedPodcast.category === 'tecnologia' ? 'LinkedIn' : 'Instagram'}`,
            content: `🎧 Acabo de analizar "${selectedPodcast.title}" y estos son los insights clave:\n\n✨ Puntos destacados:\n• Contenido de calidad sobre ${selectedPodcast.category}\n• Análisis profundo del tema\n• Aplicación práctica inmediata\n\n💡 Reflexión: Este podcast ofrece una perspectiva única sobre ${selectedPodcast.category}.\n\n#Podcast #${selectedPodcast.category} #Aprendizaje #Insights`,
            description: `Contenido de texto optimizado para redes sociales`
          },
          image: {
            type: 'image' as const,
            title: `Infografía - ${selectedPodcast.title}`,
            content: `/api/generated/image/${selectedPodcast.id}`,
            thumbnail: `/api/generated/thumb/${selectedPodcast.id}`,
            description: `Infografía con los puntos clave del podcast`
          },
          video: {
            type: 'video' as const,
            title: `Video Resumen - ${selectedPodcast.title}`,
            content: `/api/generated/video/${selectedPodcast.id}`,
            thumbnail: `/api/generated/video-thumb/${selectedPodcast.id}`,
            description: `Resumen en video del análisis del podcast`
          },
          gif: {
            type: 'gif' as const,
            title: `GIF Animado - Conceptos Clave`,
            content: `/api/generated/gif/${selectedPodcast.id}`,
            thumbnail: `/api/generated/gif-thumb/${selectedPodcast.id}`,
            description: `Animación con los conceptos principales del podcast`
          },
          infografia: {
            type: 'infografia' as const,
            title: `Infografía - ${selectedPodcast.title}`,
            content: `/api/generated/infografia/${selectedPodcast.id}.pdf`,
            thumbnail: `/api/generated/infografia-thumb/${selectedPodcast.id}`,
            description: `Infografía detallada con insights del podcast`,
            format: 'PDF'
          },
          presentacion: {
            type: 'presentacion' as const,
            title: `Presentación - ${selectedPodcast.title}`,
            content: `/api/generated/presentacion/${selectedPodcast.id}.pptx`,
            thumbnail: `/api/generated/presentacion-thumb/${selectedPodcast.id}`,
            description: `Deck ejecutivo con puntos clave del análisis`,
            slides: Math.floor(Math.random() * 10) + 8, // Entre 8 y 17 slides
            format: 'PPTX'
          }
        };

        return [contentTemplates[randomType]];
      };

      // Crear proyecto con el contenido generado
      const projectData = {
        title: selectedPodcast.title,
        episodes: selectedPodcast.episodes?.length || 1,
        subtitle: `Análisis: Contenido analizado sobre ${selectedPodcast.category}`,
        duration: selectedEpisode?.duration || '00:00',
        listeners: Math.floor(Math.random() * 1000) + 100, // Mock listeners
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }),
        podcastTitle: selectedPodcast.title,
        podcastAuthor: selectedPodcast.author || 'Autor desconocido',
        episodeTitle: selectedEpisode?.title,
        generatedContent: generateMockContent()
      };

      addProject(projectData);

      setTimeout(() => {
        router.push('/selecciones/podcast');
      }, 500); // Pequeña pausa para que se vea que terminó
    }
  }, [currentAnalysis, isAnalyzing, showAnalysisView, selectedPodcast, selectedEpisode, router, addEntry, addProject]);

  const handleFinalAnalyze = () => {
    router.push('/contents');
  };

  // Reset podcast page when filters change
  React.useEffect(() => {
    setCurrentPodcastPage(1);
  }, [searchQuery, categoryFilter]);

  // Funciones de paginado para podcasts
  const totalPodcastPages = Math.ceil(filteredPodcasts.length / podcastsPerPage);
  const indexOfLastPodcast = currentPodcastPage * podcastsPerPage;
  const indexOfFirstPodcast = indexOfLastPodcast - podcastsPerPage;
  const currentPodcasts = filteredPodcasts.slice(indexOfFirstPodcast, indexOfLastPodcast);

  const handlePodcastPageChange = (pageNumber: number) => {
    setCurrentPodcastPage(pageNumber);
  };

  // Funciones de paginado para reseñas
  const totalReviewPages = selectedPodcast ? Math.ceil((selectedPodcast.reviews?.length || 0) / reviewsPerPage) : 1;
  const indexOfLastReview = currentReviewPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = selectedPodcast?.reviews?.slice(indexOfFirstReview, indexOfLastReview) || [];

  const handleReviewPageChange = (pageNumber: number) => {
    setCurrentReviewPage(pageNumber);
  };

  // Componente de paginado mejorado
  const PaginationComponent = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
  }: { 
    currentPage: number; 
    totalPages: number; 
    onPageChange: (page: number) => void;
  }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const showPages = 5; // Mostrar máximo 5 números de página
      
      if (totalPages <= showPages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...', totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1, '...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>
        
        <div className="flex space-x-1">
          {getPageNumbers().map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`px-3 py-2 text-sm font-medium border transition-all duration-200 hover:shadow-sm ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm'
                  : typeof page === 'number'
                  ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                  : 'bg-white text-gray-400 border-gray-300 cursor-default'
              }`}
              disabled={typeof page !== 'number'}
            >
              {page}
            </Button>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  // Función para obtener el color de la categoría
  const getCategoryColor = (category: string) => {
    const colors = {
      marketing: 'from-pink-500 to-rose-500',
      tecnologia: 'from-blue-500 to-cyan-500',
      emprendimiento: 'from-green-500 to-emerald-500',
      productividad: 'from-purple-500 to-violet-500',
      bienestar: 'from-green-400 to-teal-500',
      finanzas: 'from-yellow-500 to-orange-500',
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  // Función para obtener el color de la categoría actualizada
  const getCategoryColorUpdated = (category: string) => {
    const colors = {
      tecnologia: 'from-blue-500 to-cyan-500',
      entretenimiento: 'from-purple-500 to-pink-500', 
      educacion: 'from-green-500 to-emerald-500',
      noticias: 'from-red-500 to-orange-500',
      otro: 'from-gray-500 to-gray-600',
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 min-h-full flex flex-col">
          
          {/* Vista de Análisis Detallado */}
          {showAnalysisView && selectedPodcast ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAnalysisView(false);
                      clearAnalysis();
                    }}
                    className="text-sm hover:bg-gray-50 transition-colors"
                  >
                    ← Volver
                  </Button>
                </div>
              </div>

              {/* Análisis en progreso */}
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
                
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {selectedPodcast.title}
                </h2>
                
                <div className="space-y-4">
                  <p className="text-gray-600">Analizando podcast...</p>
                  <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">{analysisProgress}% completado</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                    Selección de Podcast
                  </h1>
                  <p className="text-gray-600 mt-1">Encuentra y analiza podcasts de tu interés</p>
                </div>
                {selectedPodcast && (
                  <div className="flex items-center space-x-2 text-sm text-emerald-600 font-medium bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Podcast seleccionado</span>
                  </div>
                )}
              </div>

              {/* Search and Filter Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
                {/* Search Input */}
                <div className="lg:col-span-8 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar podcasts (nombre, tema, autor, etc.)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                  />
                </div>

                {/* Filter Button */}
                <div className="lg:col-span-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                    className="flex items-center space-x-2 h-12 w-full border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filtrar por Categoría</span>
                    {categoryFilter !== 'all' && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {categoryFilter === 'tecnologia' ? 'Tecnología' : 
                         categoryFilter === 'entretenimiento' ? 'Entretenimiento' : 
                         categoryFilter === 'educacion' ? 'Educación' : 
                         categoryFilter === 'noticias' ? 'Noticias' : 
                         'Otro'}
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Category Filter Dropdown */}
              {showCategoryFilter && (
                <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <Button
                      variant={categoryFilter === 'all' ? 'default' : 'outline'}
                      onClick={() => {
                        setCategoryFilter('all');
                        setShowCategoryFilter(false);
                      }}
                      className="h-10"
                    >
                      Todos
                    </Button>
                    <Button
                      variant={categoryFilter === 'tecnologia' ? 'default' : 'outline'}
                      onClick={() => {
                        setCategoryFilter('tecnologia');
                        setShowCategoryFilter(false);
                      }}
                      className="h-10"
                    >
                      Tecnología
                    </Button>
                    <Button
                      variant={categoryFilter === 'entretenimiento' ? 'default' : 'outline'}
                      onClick={() => {
                        setCategoryFilter('entretenimiento');
                        setShowCategoryFilter(false);
                      }}
                      className="h-10"
                    >
                      Entretenimiento
                    </Button>
                    <Button
                      variant={categoryFilter === 'educacion' ? 'default' : 'outline'}
                      onClick={() => {
                        setCategoryFilter('educacion');
                        setShowCategoryFilter(false);
                      }}
                      className="h-10"
                    >
                      Educación
                    </Button>
                    <Button
                      variant={categoryFilter === 'noticias' ? 'default' : 'outline'}
                      onClick={() => {
                        setCategoryFilter('noticias');
                        setShowCategoryFilter(false);
                      }}
                      className="h-10"
                    >
                      Noticias
                    </Button>
                    <Button
                      variant={categoryFilter === 'otro' ? 'default' : 'outline'}
                      onClick={() => {
                        setCategoryFilter('otro');
                        setShowCategoryFilter(false);
                      }}
                      className="h-10"
                    >
                      Otro
                    </Button>
                  </div>
                </div>
              )}

              {/* Results Summary */}
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  Mostrando {currentPodcasts.length} de {filteredPodcasts.length} podcasts
                  {categoryFilter !== 'all' && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {categoryFilter}
                    </span>
                  )}
                </p>
                {filteredPodcasts.length > podcastsPerPage && (
                  <p className="text-sm text-gray-500">
                    Página {currentPodcastPage} de {totalPodcastPages}
                  </p>
                )}
              </div>

              {/* Unified Selected Podcast Preview */}
              {selectedPodcast && (
                <Card className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 shadow-xl rounded-2xl">
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      {/* Header with close button */}
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-900">
                          {selectedPodcast.title}
                        </h2>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPodcast(null)}
                          className="text-gray-500 hover:text-gray-700 rounded-full w-8 h-8 p-0"
                        >
                          ✕
                        </Button>
                      </div>
                      
                      {/* Podcast Icon */}
                      <div className="flex justify-center">
                        <div className={`w-20 h-20 bg-gradient-to-br ${getCategoryColorUpdated(selectedPodcast.category)} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <Music className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-gray-600 text-lg">Preview del Podcast</p>
                        <p className="text-sm text-gray-500">
                          por <span className="font-medium">{selectedPodcast.author}</span> • 
                          <span className="ml-1 capitalize">{selectedPodcast.category}</span>
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{selectedPodcast.rating?.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{selectedPodcast.totalReviews} reseñas</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Episode Selection */}
                      <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 font-medium">
                            {selectedEpisode ? selectedEpisode.title : (selectedPodcast.episodes && selectedPodcast.episodes.length > 0 ? selectedPodcast.episodes[0].title : 'Episodio 1')}
                          </span>
                          <Select 
                            defaultValue={selectedEpisode?.id || (selectedPodcast.episodes && selectedPodcast.episodes.length > 0 ? selectedPodcast.episodes[0].id : 'episodio-1')}
                            onValueChange={(value) => {
                              const episode = selectedPodcast.episodes?.find(ep => ep.id === value);
                              if (episode) {
                                setSelectedEpisode(episode);
                              }
                            }}
                          >
                            <SelectTrigger className="w-40 border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedPodcast.episodes?.map((episode, index) => (
                                <SelectItem key={episode.id} value={episode.id}>
                                  Episodio {index + 1}
                                </SelectItem>
                              )) || (
                                <SelectItem value="episodio-1">Episodio 1</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Audio Player */}
                        <div className="flex items-center space-x-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handlePlayPause}
                            disabled={!selectedEpisode?.audioUrl || audioPlayer.isLoading}
                            className="w-10 h-10 p-0 rounded-full border-blue-300 hover:bg-blue-50 disabled:opacity-50"
                          >
                            {audioPlayer.isLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            ) : isPlaying ? (
                              <Pause className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Play className="w-4 h-4 text-blue-600" />
                            )}
                          </Button>
                          
                          <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(audioPlayer.currentTime / audioPlayer.duration) * 100 || 0}%` }}
                            ></div>
                          </div>
                          
                          <span className="text-xs text-gray-500 min-w-[40px]">
                            {formatTime(audioPlayer.currentTime)} / {formatTime(audioPlayer.duration)}
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            <Volume2 className="w-4 h-4 text-gray-400" />
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={audioPlayer.volume}
                              onChange={(e) => setVolume(parseFloat(e.target.value))}
                              className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>
                        
                        {selectedEpisode?.description && (
                          <p className="text-xs text-gray-600 mt-2">
                            {selectedEpisode.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex justify-center space-x-4">
                        <Button
                          onClick={handleAnalyzeClick}
                          disabled={isAnalyzing}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                        >
                          {isAnalyzing ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Analizando...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <BarChart3 className="w-5 h-5" />
                              <span>Analizar Podcast</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Podcasts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentPodcasts.map((podcast) => (
                    <Card 
                      key={podcast.id} 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 ${
                        selectedPodcast?.id === podcast.id 
                          ? 'border-blue-500 bg-blue-50 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handlePodcastClick(podcast)}
                    >
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Category Badge */}
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${getCategoryColorUpdated(podcast.category)} text-white`}>
                              {podcast.category === 'tecnologia' ? 'Tecnología' : 
                               podcast.category === 'entretenimiento' ? 'Entretenimiento' : 
                               podcast.category === 'educacion' ? 'Educación' : 
                               podcast.category === 'noticias' ? 'Noticias' : 
                               'Otro'}
                            </span>
                            {selectedPodcast?.id === podcast.id && (
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            )}
                          </div>

                          {/* Podcast Icon */}
                          <div className="flex justify-center">
                            <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColorUpdated(podcast.category)} rounded-xl flex items-center justify-center shadow-md`}>
                              <Music className="w-8 h-8 text-white" />
                            </div>
                          </div>

                          {/* Podcast Info */}
                          <div className="text-center space-y-2">
                            <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                              {podcast.title}
                            </h3>
                            <p className="text-xs text-gray-600">
                              por {podcast.author}
                            </p>
                            
                            {/* Rating and Reviews */}
                            <div className="flex items-center justify-center space-x-3 text-sm">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="font-medium">{podcast.rating?.toFixed(1)}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-gray-500">
                                <Users className="w-4 h-4" />
                                <span>{podcast.totalReviews}</span>
                              </div>
                            </div>

                            {/* Episodes Count */}
                            <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{podcast.episodes?.length || 1} episodios</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                              {/* Empty State */}
              {filteredPodcasts.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron podcasts</h3>
                  <p className="text-gray-600 mb-4">
                    Intenta ajustar tus filtros o términos de búsqueda
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                    }}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    Limpiar filtros
                  </Button>
                </div>
              )}

              {/* Fixed Pagination at Bottom */}
              <div className="mt-8 pt-6 border-t border-gray-200 bg-white rounded-lg shadow-sm">
                <PaginationComponent
                  currentPage={currentPodcastPage}
                  totalPages={totalPodcastPages}
                  onPageChange={handlePodcastPageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 