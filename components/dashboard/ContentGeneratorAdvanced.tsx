'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  Search, 
  Music, 
  Plus,
  Image as ImageIcon,
  Video,
  FileText,
  BarChart3,
  Presentation,
  Sparkles,
  Upload,
  RefreshCw,
  Wand2,
  Play,
  Pause
} from 'lucide-react';
import { TrainingSection } from './TrainingSection';
import { VideoScriptSection } from './VideoScriptSection';
import { useProjectsStore } from '@/store/projects';
import { useGeneratedContentStore } from '@/store/generated-content';
import { useUserImagesStore } from '@/store/user-images';

// Componente de loader animado
const AILoader = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="relative">
      <Wand2 className="w-5 h-5 text-white animate-pulse" />
      <div className="absolute -top-1 -right-1">
        <Sparkles className="w-3 h-3 text-yellow-300 animate-bounce" />
      </div>
    </div>
    <span>Generando con IA</span>
    <div className="flex space-x-1">
      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  </div>
);

// Función para obtener tips específicos según el tipo de contenido
const getImageTipByContentType = (contentType: string): string => {
  const tips: Record<string, string> = {
    imagenes: 'Sube imágenes que quieras usar en tu carousel de Instagram. Se comprimen automáticamente para ahorrar espacio.',
    videos: 'Sube imágenes que servirán como thumbnail o elementos visuales para tu video. Se optimizan automáticamente.',
    infografias: 'Sube imágenes relacionadas que complementen tu infografía. Se comprimen para mejor rendimiento.',
    presentaciones: 'Sube imágenes que quieras incluir en las diapositivas de tu presentación. Se optimizan automáticamente.'
  };
  return tips[contentType] || 'Sube imágenes relacionadas con tu contenido para obtener mejores resultados. Se comprimen automáticamente.';
};

export function ContentGeneratorAdvanced() {
  const router = useRouter();
  const { projects, linkContentToProject } = useProjectsStore();
  const { generateContent } = useGeneratedContentStore();
  const { images: userImages, addImage, removeImage, addSuggestedImages, getSuggestedImages, getUserImages, getStorageInfo, clearUserImages, resetToDefaultImages } = useUserImagesStore();
  const [selectedContentType, setSelectedContentType] = useState('texto');
  const [selectedTone, setSelectedTone] = useState('amigable');
  const [selectedStyle, setSelectedStyle] = useState('educativos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [selectedMusicForGeneration, setSelectedMusicForGeneration] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAddingSuggested, setIsAddingSuggested] = useState(false);

  const backgroundMusic = [
    {
      id: 'upbeat_corporate',
      name: 'Corporate Success',
      url: '/audio/corporate_success.mp3',
      duration: '1:32',
      genre: 'Corporate',
      mood: 'Energético'
    },
    {
      id: 'smooth_jazz',
      name: 'Jazz Cafe Vibes',
      url: '/audio/beepage_jazz.mp3',
      duration: '2:10',
      genre: 'Jazz',
      mood: 'Relajante'
    },
    {
      id: 'electronic_beat',
      name: 'Electronic Dreams',
      url: '/audio/technoscape_electronic.mp3',
      duration: '1:39',
      genre: 'Electronic',
      mood: 'Moderno'
    }
  ];

  const contentTypes = [
    { id: 'texto', name: 'Texto', icon: FileText, active: true, color: 'text-blue-600' },
    { id: 'imagenes', name: 'Imágenes', icon: ImageIcon, active: false, color: 'text-green-600' },
    { id: 'videos', name: 'Videos', icon: Video, active: false, color: 'text-purple-600' },
    { id: 'gif', name: 'GIF', icon: BarChart3, active: false, color: 'text-orange-600' },
    { id: 'infografias', name: 'Infografías', icon: BarChart3, active: false, color: 'text-red-600' },
    { id: 'presentaciones', name: 'Presentaciones', icon: Presentation, active: false, color: 'text-indigo-600' }
  ];

  const tones = [
    { id: 'amigable', name: 'Amigable', emoji: '😊' },
    { id: 'profesional', name: 'Profesional', emoji: '💼' },
    { id: 'casual', name: 'Casual', emoji: '😎' },
    { id: 'energico', name: 'Enérgico', emoji: '⚡' }
  ];

  const styles = [
    { id: 'educativos', name: 'Educativos', emoji: '📚' },
    { id: 'entretenimiento', name: 'Entretenimiento', emoji: '🎉' },
    { id: 'informativo', name: 'Informativo', emoji: '📰' },
    { id: 'inspiracional', name: 'Inspiracional', emoji: '✨' }
  ];

  // Función para comprimir imagen
  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir a base64 con compresión
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  // Función para procesar archivos de imagen con compresión
  const processImageFiles = async (files: FileList | File[]) => {
    setIsUploadingImages(true);

    try {
      const fileArray = Array.from(files);
      let processedCount = 0;
      let errorCount = 0;

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} no es una imagen válida`);
          errorCount++;
          continue;
        }

        // Validar tamaño original (máximo 20MB antes de compresión)
        if (file.size > 20 * 1024 * 1024) {
          alert(`${file.name} es demasiado grande. Máximo 20MB por imagen.`);
          errorCount++;
          continue;
        }

        try {
          // Comprimir imagen
          const compressedDataUrl = await compressImage(file, 800, 0.8);
          
          // Calcular tamaño comprimido (aproximado)
          const compressedSize = Math.round((compressedDataUrl.length * 3) / 4);

          // Intentar agregar la imagen
          try {
            addImage({
              name: file.name,
              url: compressedDataUrl,
              type: 'image/jpeg', // Siempre JPEG después de compresión
              size: compressedSize
            });
            processedCount++;
          } catch (storageError) {
            if (storageError instanceof Error && storageError.message.includes('QuotaExceeded')) {
              alert(`No hay suficiente espacio para agregar "${file.name}". Intenta eliminar algunas imágenes primero o usa imágenes más pequeñas.`);
              break; // Parar el procesamiento
            } else {
              throw storageError;
            }
          }
        } catch (compressionError) {
          console.error('Error al comprimir imagen:', compressionError);
          alert(`Error al procesar "${file.name}". Intenta con otra imagen.`);
          errorCount++;
        }
      }

      // Mostrar resumen
      if (processedCount > 0) {
        console.log(`✅ ${processedCount} imagen(es) agregada(s) exitosamente`);
      }
      if (errorCount > 0) {
        console.log(`⚠️ ${errorCount} imagen(es) no se pudieron procesar`);
      }

    } catch (error) {
      console.error('Error al subir imágenes:', error);
      alert('Error general al subir las imágenes. Inténtalo de nuevo.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  // Función para manejar la subida de imágenes desde input
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    await processImageFiles(files);
    // Limpiar el input
    event.target.value = '';
  };

  // Función para eliminar imagen
  const handleRemoveImage = (imageId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      removeImage(imageId);
    }
  };

  // Función para agregar imágenes sugeridas con feedback
  const handleAddSuggestedImages = () => {
    setIsAddingSuggested(true);
    addSuggestedImages();
    
    // Feedback temporal
    setTimeout(() => {
      setIsAddingSuggested(false);
    }, 1000);
  };

  // Funciones de drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processImageFiles(files);
    }
  };

  const handlePlayPreview = (music: any) => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }

    if (selectedMusic === music.id && isPlayingPreview) {
      setIsPlayingPreview(false);
      setSelectedMusic(null);
      return;
    }

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audio.volume = 0.5;
    
    audio.addEventListener('ended', () => {
      setIsPlayingPreview(false);
      setSelectedMusic(null);
    });

    audio.addEventListener('error', (e) => {
      console.error('Error al cargar audio:', e);
      alert('No se pudo reproducir la música. Puede ser un problema de conexión o el archivo no está disponible.');
      setIsPlayingPreview(false);
      setSelectedMusic(null);
    });

    audio.addEventListener('loadstart', () => {
      console.log('Cargando audio...');
    });

    audio.addEventListener('canplay', () => {
      console.log('Audio listo para reproducir');
    });

    audio.src = music.url;
    
    audio.play().then(() => {
      setAudioElement(audio);
      setSelectedMusic(music.id);
      setIsPlayingPreview(true);
      console.log('Reproduciendo:', music.name);
    }).catch((error) => {
      console.error('Error al reproducir audio:', error);
      alert(`No se pudo reproducir "${music.name}". Intenta con otra canción.`);
      setIsPlayingPreview(false);
      setSelectedMusic(null);
    });
  };

  const handleSearchMusic = () => {
    if (searchQuery.trim()) {
      const filtered = backgroundMusic.filter(music => 
        music.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        music.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        music.mood.toLowerCase().includes(searchQuery.toLowerCase())
      );
      // Aquí podrías filtrar la lista si quisieras
      console.log('Música filtrada:', filtered);
    }
  };

  // Limpiar audio al desmontar el componente
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    };
  }, [audioElement]);

  // Auto-agregar imágenes sugeridas al cambiar tipo de contenido (si no existen)
  useEffect(() => {
    if ((selectedContentType === 'imagenes' || selectedContentType === 'videos' || selectedContentType === 'infografias' || selectedContentType === 'presentaciones')) {
      // Solo agregar si no hay imágenes sugeridas ya
      if (getSuggestedImages().length === 0) {
        addSuggestedImages();
      }
    }
  }, [selectedContentType]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Resetear a imágenes por defecto antes de generar contenido
    if (selectedContentType === 'imagenes' || selectedContentType === 'videos' || selectedContentType === 'infografias' || selectedContentType === 'presentaciones') {
      resetToDefaultImages();
    }
    
    // Generar contenido en el store
    await generateContent(selectedContentType as any, selectedTone, selectedStyle);
    
    // Vincular el contenido generado con el proyecto más reciente (si existe)
    if (projects.length > 0) {
      const latestProject = projects[0];
      const contentParams = {
        type: selectedContentType,
        tone: selectedTone,
        style: selectedStyle,
        music: selectedMusicForGeneration || undefined
      };
      
      console.log('Guardando contenido en proyecto:', latestProject.title);
      console.log('Parámetros de contenido:', contentParams);
      
      linkContentToProject(latestProject.id, contentParams);
    }
    
    // Navegar a la página de contenido generado con parámetros
    const params = new URLSearchParams({
      type: selectedContentType,
      tone: selectedTone,
      style: selectedStyle
    });

    // Agregar música si está seleccionada
    if (selectedMusicForGeneration && (selectedContentType === 'videos' || selectedContentType === 'imagenes')) {
      params.set('music', selectedMusicForGeneration);
    }
    
    router.push(`/generated-content/social?${params.toString()}`);
    
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header mejorado - Sticky */}
      <div className="sticky top-0 z-20 px-4 lg:px-6 py-4 mt-2 mb-2 backdrop-blur-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Generación de contenido
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                Crea contenido increíble con inteligencia artificial
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation - Sticky */}
      <div className="sticky top-[88px] z-10 px-4 lg:px-6 py-4 bg-white/50 backdrop-blur-sm border-b">
        <div className="flex justify-center max-w-7xl mx-auto">
          <Tabs defaultValue="redes-sociales" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-gray-100/80 backdrop-blur-sm p-1 rounded-xl shadow-inner">
              <TabsTrigger 
                value="redes-sociales" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-xs sm:text-sm font-medium transition-all duration-200 rounded-lg"
              >
                🌐 Redes sociales
              </TabsTrigger>
              <TabsTrigger 
                value="guiones-video" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-xs sm:text-sm font-medium transition-all duration-200 rounded-lg"
              >
                🎬 Guiones de video
              </TabsTrigger>
              <TabsTrigger 
                value="capacitaciones" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-xs sm:text-sm font-medium transition-all duration-200 rounded-lg"
              >
                📚 Capacitaciones
              </TabsTrigger>
            </TabsList>

            {/* Tab Content - Redes Sociales */}
            <TabsContent value="redes-sociales" className="mt-6 pb-8">
              {/* Content Type Selection */}
              <div className="px-4 lg:px-6 py-6 bg-white/70 backdrop-blur-sm border rounded-xl mb-6 shadow-sm">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">
                    Tipo de contenido
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:items-center lg:justify-center gap-4 lg:space-x-6 lg:gap-0">
                    {contentTypes.map((type) => {
                      const IconComponent = type.icon;
                      const isSelected = selectedContentType === type.id;
                      return (
                        <Card 
                          key={type.id} 
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            isSelected 
                              ? 'ring-2 ring-blue-500 bg-blue-50 shadow-lg' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedContentType(type.id)}
                        >
                          <CardContent className="p-4 flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-3">
                            <div className={`p-2 rounded-lg bg-gray-100 ${isSelected ? 'bg-blue-100' : ''}`}>
                              <IconComponent className={`w-5 h-5 ${isSelected ? 'text-blue-600' : type.color}`} />
                            </div>
                            <span className={`text-sm font-medium text-center lg:text-left ${
                              isSelected ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                              {type.name}
                            </span>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Main Content Area - Scrolleable */}
              <div className="max-w-4xl mx-auto px-4 lg:px-8">
                <div className="space-y-8 pb-8">
                  {/* Tone Selection */}
                  <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        🎭 Tono de comunicación
                      </label>
                      <div className="grid grid-cols-2 lg:flex lg:space-x-3 gap-3 lg:gap-0">
                        {tones.map((tone) => (
                          <Badge 
                            key={tone.id}
                            variant={selectedTone === tone.id ? 'default' : 'secondary'}
                            className={`cursor-pointer transition-all duration-200 p-3 justify-center text-center ${
                              selectedTone === tone.id 
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg scale-105' 
                                : 'hover:bg-gray-200 hover:scale-105'
                            }`}
                            onClick={() => setSelectedTone(tone.id)}
                          >
                            <span className="mr-2">{tone.emoji}</span>
                            {tone.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Style Selection */}
                  <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        🎨 Estilo de contenido
                      </label>
                      <div className="grid grid-cols-2 lg:flex lg:space-x-3 gap-3 lg:gap-0">
                        {styles.map((style) => (
                          <Badge 
                            key={style.id}
                            variant={selectedStyle === style.id ? 'default' : 'secondary'}
                            className={`cursor-pointer transition-all duration-200 p-3 justify-center text-center ${
                              selectedStyle === style.id 
                                ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg scale-105' 
                                : 'hover:bg-gray-200 hover:scale-105'
                            }`}
                            onClick={() => setSelectedStyle(style.id)}
                          >
                            <span className="mr-2">{style.emoji}</span>
                            {style.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Images Section - Solo para contenido que usa imágenes */}
                  {(selectedContentType === 'imagenes' || selectedContentType === 'videos' || selectedContentType === 'infografias' || selectedContentType === 'presentaciones') && (
                  <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-semibold text-gray-700">
                          🖼️ Imágenes para {selectedContentType === 'imagenes' ? 'carousel' : selectedContentType === 'videos' ? 'video' : selectedContentType === 'infografias' ? 'infografía' : 'presentación'} ({userImages.length})
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            disabled={isUploadingImages}
                          >
                            {isUploadingImages ? (
                              <>
                                <Upload className="w-4 h-4 mr-1 animate-pulse" />
                                Subiendo...
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-1" />
                                Agregar
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hover:bg-green-50 hover:border-green-300 transition-colors"
                            onClick={handleAddSuggestedImages}
                            disabled={isAddingSuggested || getSuggestedImages().length > 0}
                          >
                            {isAddingSuggested ? (
                              <>
                                <ImageIcon className="w-4 h-4 mr-1 animate-pulse" />
                                Agregadas ✓
                              </>
                            ) : getSuggestedImages().length > 0 ? (
                              <>
                                <ImageIcon className="w-4 h-4 mr-1" />
                                Ya agregadas
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-4 h-4 mr-1" />
                                Sugeridas
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div 
                        className={`grid grid-cols-3 gap-3 max-w-sm max-h-60 overflow-y-auto p-3 border-2 border-dashed rounded-lg transition-all duration-200 ${
                          isDragOver 
                            ? 'border-blue-400 bg-blue-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        {userImages.map((image) => (
                          <div 
                            key={image.id} 
                            className="group relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <img 
                              src={image.url} 
                              alt={image.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            {/* Badge para imágenes sugeridas */}
                            {image.isSuggested && (
                              <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                                Sugerida
                              </div>
                            )}
                            
                            {/* Overlay con información */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="text-center text-white">
                                <p className="text-xs font-medium truncate px-2">{image.name}</p>
                                <p className="text-xs opacity-75">
                                  {image.isSuggested ? 'Imagen sugerida' : `${(image.size / 1024).toFixed(1)}KB`}
                                </p>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="mt-2 h-6 text-xs"
                                  onClick={() => handleRemoveImage(image.id)}
                                >
                                  Eliminar
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {userImages.length === 0 && (
                        <div className="col-span-3 text-center py-8 text-gray-500">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm mb-2">Cargando imágenes por defecto...</p>
                          <p className="text-xs text-gray-400">Las 3 imágenes de ejemplo aparecerán automáticamente</p>
                          {isDragOver && (
                            <p className="text-xs text-blue-600 mt-2 font-medium">¡Suelta las imágenes aquí!</p>
                          )}
                        </div>
                      )}
                      
                      {/* Estadísticas de imágenes */}
                      {userImages.length > 0 && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <ImageIcon className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700">
                                {userImages.length} imagen{userImages.length !== 1 ? 'es' : ''} lista{userImages.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="text-xs text-green-600 flex flex-col items-end">
                              <span>{getSuggestedImages().length} sugeridas</span>
                              <span>{getUserImages().length} personales</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-green-600">
                              💾 {(getStorageInfo().totalSize / (1024 * 1024)).toFixed(1)}MB usados
                            </span>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-xs hover:bg-blue-50 hover:border-blue-300"
                                onClick={() => {
                                  if (window.confirm('¿Resetear a las 3 imágenes por defecto? (Se eliminarán todas las demás)')) {
                                    resetToDefaultImages();
                                  }
                                }}
                              >
                                Resetear
                              </Button>
                              {getUserImages().length > 0 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-6 text-xs hover:bg-red-50 hover:border-red-300"
                                  onClick={() => {
                                    if (window.confirm('¿Eliminar todas tus imágenes personales? (Las sugeridas se mantendrán)')) {
                                      clearUserImages();
                                    }
                                  }}
                                >
                                  Limpiar personales
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700 mb-2">
                          💡 <strong>Tip:</strong> {getImageTipByContentType(selectedContentType)} Formatos: JPG, PNG, GIF, WebP (máx. 20MB).
                        </p>
                        <p className="text-xs text-blue-600">
                          🔄 <strong>Comportamiento:</strong> Siempre empiezas con las 3 imágenes por defecto. Puedes eliminarlas, agregar las tuyas, y al generar nuevo contenido vuelven a aparecer las originales.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  )}

                  {/* Music Section - Solo para Videos e Imágenes */}
                  {(selectedContentType === 'videos' || selectedContentType === 'imagenes') && (
                    <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                          🎵 Música de fondo {selectedContentType === 'videos' ? 'para video' : 'para presentación'}
                        </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
                        <Input 
                          placeholder="Buscar por nombre, género o estado de ánimo..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 bg-white/80 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          onClick={handleSearchMusic}
                        >
                          <Search className="w-4 h-4 mr-1" />
                          Buscar
                        </Button>
                      </div>
                      
                      {/* Lista de música disponible */}
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {backgroundMusic.map((music) => (
                          <div 
                            key={music.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                              selectedMusicForGeneration === music.id 
                                ? 'bg-green-50 border-green-300 shadow-sm ring-2 ring-green-200' 
                                : selectedMusic === music.id 
                                ? 'bg-blue-50 border-blue-300 shadow-sm' 
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              handlePlayPreview(music);
                              setSelectedMusicForGeneration(music.id);
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-full"
                                >
                                  {selectedMusic === music.id && isPlayingPreview ? (
                                    <Pause className="w-4 h-4" />
                                  ) : (
                                    <Play className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {music.name}
                                </p>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                  <span>{music.genre}</span>
                                  <span>•</span>
                                  <span>{music.mood}</span>
                                  <span>•</span>
                                  <span>{music.duration}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <Music className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {selectedMusicForGeneration && (
                        <div className="flex items-center space-x-2 mt-3 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                          <Music className="w-4 h-4 text-green-500" />
                          <span>
                            ✅ Música seleccionada para {selectedContentType === 'videos' ? 'video' : 'presentación'}: {backgroundMusic.find(m => m.id === selectedMusicForGeneration)?.name}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  )}

                  {/* Generate Button */}
                  <div className="pt-6">
                    <Button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-70"
                    >
                      {isGenerating ? (
                        <AILoader />
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Wand2 className="w-5 h-5" />
                          <span>Generar con IA</span>
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab Content - Guiones de Video */}
            <TabsContent value="guiones-video" className="mt-6 pb-8">
              <VideoScriptSection />
            </TabsContent>

            {/* Tab Content - Capacitaciones */}
            <TabsContent value="capacitaciones" className="mt-6 pb-8">
              <TrainingSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 