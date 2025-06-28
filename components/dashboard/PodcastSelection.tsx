'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Search, Music, Play, Pause, Volume2, Maximize2, MoreHorizontal, Clock, Users, Star, ChevronLeft, ChevronRight, BarChart3, TrendingUp, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePodcastStore, type Episode, type Review, type PodcastData } from '@/store/podcasts';
import { usePodcastAnalysisStore } from '@/store/podcastanalysis';

export function PodcastSelection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnalysisView, setShowAnalysisView] = useState(false);
  const [showEpisodesView, setShowEpisodesView] = useState(false);
  const [showReviewsView, setShowReviewsView] = useState(false);


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

  // Organizar podcasts por categorías desde la base de datos
  const podcastsByCategory = {
    marketing: podcastDatabase.filter(p => p.category === 'marketing'),
    tecnologia: podcastDatabase.filter(p => p.category === 'tecnologia'),
    emprendimiento: podcastDatabase.filter(p => p.category === 'emprendimiento'),
  };

  const allPodcasts = podcastDatabase;

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
      setTimeout(() => {
        router.push('/selecciones/podcast');
      }, 500); // Pequeña pausa para que se vea que terminó
    }
  }, [currentAnalysis, isAnalyzing, showAnalysisView, selectedPodcast, router]);

  const handleFinalAnalyze = () => {
    router.push('/contents');
  };

  // Reemplazamos el filtrado simple por el helper de la store
  const filteredPodcasts = searchQuery.trim() ? filterPodcasts(searchQuery) : allPodcasts;

  // Reset podcast page when search changes
  React.useEffect(() => {
    setCurrentPodcastPage(1);
  }, [searchQuery]);

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

  // ----- Funciones de búsqueda simplificadas -----
  const handleSearchClick = () => {
    setCurrentPodcastPage(1);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          
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
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center space-x-2 hover:bg-gray-50 transition-colors border-gray-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Dashboard</span>
                </Button>
              </div>

              {/* Search Bar */}
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar podcasts (nombre, tema, episodio, url, etc.)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchClick()}
                    className="pl-12 pr-4 h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                  />
                </div>
                <Button 
                  onClick={handleSearchClick}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Buscar
                </Button>
                {selectedPodcast && (
                  <div className="flex items-center space-x-2 text-sm text-emerald-600 font-medium bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Podcast seleccionado</span>
                  </div>
                )}
              </div>

              {/* URL Processing Message */}
              {/* (Se eliminó la visualización de progreso de URL) */}

              {/* URL Error Message */}
              {/* (Se eliminó la visualización de errores de URL) */}

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
                        <div className={`w-20 h-20 bg-gradient-to-br ${
                          selectedPodcast.category === 'marketing' ? 'from-pink-500 to-rose-500' :
                          selectedPodcast.category === 'tecnologia' ? 'from-blue-500 to-cyan-500' :
                          selectedPodcast.category === 'emprendimiento' ? 'from-green-500 to-emerald-500' :
                          'from-purple-500 to-violet-500'
                        } rounded-2xl flex items-center justify-center shadow-lg`}>
                          <Music className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-lg">Preview del Podcast</p>
                      
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
                            {audioPlayer.isLoading || audioPlayer.isBuffering ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            ) : isPlaying ? (
                              <Pause className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Play className="w-5 h-5 text-blue-600" />
                            )}
                          </Button>
                          
                          {/* Current Time */}
                          <span className="text-xs text-gray-500 font-mono min-w-[40px]">
                            {formatTime(audioPlayer.currentTime)}
                          </span>
                          
                          {/* Progress Bar */}
                          <div 
                            className="flex-1 bg-blue-100 rounded-full h-2 cursor-pointer"
                            onClick={(e) => {
                              if (audioPlayer.duration) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const percentage = x / rect.width;
                                const newTime = percentage * audioPlayer.duration;
                                seekTo(newTime);
                              }
                            }}
                          >
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: audioPlayer.duration 
                                  ? `${(audioPlayer.currentTime / audioPlayer.duration) * 100}%`
                                  : '0%'
                              }}
                            ></div>
                          </div>
                          
                          {/* Duration */}
                          <span className="text-xs text-gray-500 font-mono min-w-[40px]">
                            {formatTime(audioPlayer.duration)}
                          </span>
                          
                          {/* Volume Control */}
                          <div className="flex items-center space-x-2">
                            <Volume2 
                              className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors"
                              onClick={() => {
                                const newVolume = audioPlayer.volume > 0 ? 0 : 1;
                                setVolume(newVolume);
                              }}
                            />
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
                          
                          {/* Playback Speed */}
                          <select
                            value={audioPlayer.playbackRate}
                            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                            className="text-xs bg-transparent border border-gray-300 rounded px-2 py-1 text-gray-600 hover:text-gray-800"
                          >
                            <option value={0.5}>0.5x</option>
                            <option value={0.75}>0.75x</option>
                            <option value={1}>1x</option>
                            <option value={1.25}>1.25x</option>
                            <option value={1.5}>1.5x</option>
                            <option value={2}>2x</option>
                          </select>
                          
                          <Maximize2 className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors" />
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-center space-x-4">
                        <Button 
                          variant="outline"
                          onClick={() => setShowReviewsView(true)}
                          className="px-6 py-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          Calificar
                        </Button>
                        <Button 
                          onClick={handleAnalyzeClick}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Analizar Podcast
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Podcasts Grid */}
              <div className="space-y-6">
                {/* Stats Info */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Mostrando {indexOfFirstPodcast + 1}-{Math.min(indexOfLastPodcast, filteredPodcasts.length)} de {filteredPodcasts.length} podcasts
                  </div>
                  <div className="text-sm text-gray-500">
                    Página {currentPodcastPage} de {totalPodcastPages}
                  </div>
                </div>

                                 {/* Podcasts Grid */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                   {currentPodcasts.map((podcast) => {
                     const isSelected = selectedPodcast?.id === podcast.id;
                     const categoryColors = {
                       marketing: 'from-pink-500 to-rose-500',
                       tecnologia: 'from-blue-500 to-cyan-500', 
                       emprendimiento: 'from-green-500 to-emerald-500',
                       extracted: 'from-purple-500 to-violet-500'
                     };
                     
                     return (
                       <Card 
                         key={podcast.id}
                         className={`group cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
                           isSelected 
                             ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-lg' 
                             : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md'
                         } rounded-2xl overflow-hidden relative`}
                         onClick={() => handlePodcastClick(podcast)}
                       >
                         <CardContent className="p-5 flex flex-col items-center text-center h-56">
                           {/* Selection Indicator */}
                           {isSelected && (
                             <div className="absolute top-3 right-3 z-10">
                               <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                 <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                 </svg>
                               </div>
                             </div>
                           )}
                           
                           {/* Podcast Icon with gradient */}
                           <div className={`w-16 h-16 bg-gradient-to-br ${categoryColors[podcast.category as keyof typeof categoryColors] || categoryColors.tecnologia} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300 flex-shrink-0`}>
                             <Music className="w-8 h-8 text-white" />
                           </div>
                           
                                                        {/* Content Container */}
                             <div className="flex-1 flex flex-col justify-between w-full">
                               {/* Podcast Title */}
                               <div className="mb-3 flex-1 flex items-center justify-center">
                                 <h3 className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-3 text-center w-full">
                                   {podcast.title}
                                 </h3>
                               </div>
                             
                             {/* Category Badge */}
                             <div className="flex items-center justify-center">
                               <span className={`px-3 py-1.5 rounded-full text-white font-medium text-xs shadow-sm ${
                                 podcast.category === 'marketing' ? 'bg-pink-500' :
                                 podcast.category === 'tecnologia' ? 'bg-blue-500' :
                                 podcast.category === 'emprendimiento' ? 'bg-green-500' :
                                 'bg-purple-500'
                               }`}>
                                 {podcast.category === 'marketing' ? 'Marketing' :
                                  podcast.category === 'tecnologia' ? 'Tecnología' :
                                  podcast.category === 'emprendimiento' ? 'Emprendimiento' :
                                  'Extraído'}
                               </span>
                             </div>
                           </div>

                           {/* Hover effect overlay */}
                           <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                         </CardContent>
                       </Card>
                     );
                   })}
                </div>

                {/* Empty State */}
                {currentPodcasts.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron podcasts</h3>
                    <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
                  </div>
                )}

                {/* Paginado */}
                <PaginationComponent
                  currentPage={currentPodcastPage}
                  totalPages={totalPodcastPages}
                  onPageChange={handlePodcastPageChange}
                />
              </div>
            </div>
          )}

          {/* Vista de Episodios */}
          {showEpisodesView && selectedPodcast && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Episodios - {selectedPodcast.title}</h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowEpisodesView(false)}
                    className="text-sm"
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {selectedPodcast.episodes?.map((episode) => (
                    <div
                      key={episode.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedEpisode(episode);
                        setShowEpisodesView(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{episode.title}</h4>
                        <span className="text-sm text-gray-500">{episode.duration}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{episode.description}</p>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-8">No hay episodios disponibles</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Vista de Reseñas y Calificaciones */}
          {showReviewsView && selectedPodcast && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 h-[85vh] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Reseña, me gusta y calificaciones</h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewsView(false)}
                    className="text-sm"
                  >
                    ✕
                  </Button>
                </div>

                {/* Header con Estrategias y Rating - Fijo */}
                <div className="flex-shrink-0 mb-6">
                  <h4 className="text-lg font-medium mb-4">Estrategias</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="text-blue-600 text-xl">★</div>
                      ))}
                    </div>
                    <div className="text-4xl font-bold text-gray-800">
                      {selectedPodcast.rating || 5.0}
                    </div>
                  </div>
                  
                  {/* Rating Bars */}
                  <div className="mt-4 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-3">
                        <span className="text-sm w-2">{rating}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: rating === 5 ? '100%' : rating === 4 ? '80%' : '60%' }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews Grid - Con scroll */}
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[300px]">
                    {currentReviews.length > 0 ? currentReviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-4 h-fit">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {review.userName.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{review.userName}</h5>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span 
                                  key={star} 
                                  className={`text-sm ${star <= review.rating ? 'text-blue-600' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-xs text-gray-500">Fecha de publicación: {review.date}</p>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-center py-8 col-span-2">No hay reseñas disponibles</p>
                    )}
                  </div>
                </div>

                {/* Paginado de reseñas - Fijo en la parte inferior */}
                {totalReviewPages > 1 && (
                  <div className="flex-shrink-0 mt-4">
                    <PaginationComponent
                      currentPage={currentReviewPage}
                      totalPages={totalReviewPages}
                      onPageChange={handleReviewPageChange}
                    />
                  </div>
                )}
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
} 