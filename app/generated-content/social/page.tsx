'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  ArrowLeft, 
  Share, 
  Download, 
  Printer,
  FileText,
  Image as ImageIcon,
  Video,
  BarChart3,
  Presentation,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Home,
  Check,
  X,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  MessageCircle,
  Repeat2,
  Heart,
  Send,
  Bookmark
} from 'lucide-react';
import { useGeneratedContentStore, ContentType } from '@/store/generated-content';

// Componente para mostrar texto
const TextContent = ({ data }: { data: any }) => (
  <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
    <CardContent className="p-8">
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-xl mb-6">
        <h3 className="text-lg font-bold mb-2">📱 Vista previa de Instagram</h3>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {data.content}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.hashtags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="bg-white/30 text-white">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Componente para mostrar imágenes
const ImageContent = ({ data, musicUrl }: { data: any; musicUrl?: string }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    if (!musicUrl) return;

    if (isPlaying) {
      if (audioElement) {
        audioElement.pause();
      }
      setIsPlaying(false);
    } else {
      if (audioElement) {
        audioElement.play();
      } else {
        const audio = new Audio(musicUrl);
        audio.volume = 0.6;
        audio.loop = true;
        
        audio.play().then(() => {
          setAudioElement(audio);
          setIsPlaying(true);
        }).catch((error) => {
          console.error('Error al reproducir música:', error);
        });
      }
      setIsPlaying(true);
    }
  };

  // Limpiar audio al desmontar
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    };
  }, [audioElement]);
  
  return (
    <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-green-600" />
            Carousel de Imágenes
            {musicUrl && (
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                🎵 Con música
              </Badge>
            )}
          </h3>
          {musicUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayPause}
              className="flex items-center space-x-1"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
            </Button>
          )}
        </div>
        <div className="relative">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
            <img 
              src={data.images[currentImage]} 
              alt={`Slide ${currentImage + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentImage(Math.max(0, currentImage - 1))}
              disabled={currentImage === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600">
              {currentImage + 1} / {data.images.length}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentImage(Math.min(data.images.length - 1, currentImage + 1))}
              disabled={currentImage === data.images.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 text-center">
            {data.captions[currentImage]}
          </p>
        </div>
        {musicUrl && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              💡 <strong>Tip:</strong> Usa el botón de reproducir para escuchar la música de fondo que acompañaría tu presentación.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Componente para mostrar videos
const VideoContent = ({ data, musicUrl }: { data: any; musicUrl?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    if (!musicUrl) {
      setIsPlaying(!isPlaying);
      return;
    }

    if (isPlaying) {
      // Pausar
      if (audioElement) {
        audioElement.pause();
      }
      setIsPlaying(false);
    } else {
      // Reproducir
      if (audioElement) {
        audioElement.play();
      } else {
        const audio = new Audio(musicUrl);
        audio.volume = 0.7;
        audio.loop = true;
        
        audio.addEventListener('ended', () => {
          setIsPlaying(false);
        });

        audio.play().then(() => {
          setAudioElement(audio);
          setIsPlaying(true);
        }).catch((error) => {
          console.error('Error al reproducir música:', error);
        });
      }
      setIsPlaying(true);
    }
  };

  // Limpiar audio al desmontar
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    };
  }, [audioElement]);
  
  return (
    <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
      <CardContent className="p-8">
        <h3 className="text-lg font-bold mb-6 flex items-center">
          <Video className="w-5 h-5 mr-2 text-purple-600" />
          Video Generado
          {musicUrl && (
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
              🎵 Con música
            </Badge>
          )}
        </h3>
        <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4">
          <img 
            src={data.thumbnail} 
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              size="lg"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
          </div>
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {data.duration}
          </div>
          {musicUrl && isPlaying && (
            <div className="absolute top-4 right-4 bg-green-500/80 text-white px-2 py-1 rounded text-xs flex items-center">
              🎵 Reproduciendo música
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600">{data.description}</p>
        {musicUrl && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              💡 <strong>Tip:</strong> Haz clic en ▶️ para escuchar cómo sonaría tu video con la música de fondo seleccionada.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Componente para mostrar GIFs
const GifContent = ({ data }: { data: any }) => (
  <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
    <CardContent className="p-8">
      <h3 className="text-lg font-bold mb-6 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
        GIF Animado - {data.title || 'Contenido Generado'}
        {data.tone && data.style && (
          <div className="ml-auto flex gap-2">
            <Badge variant="outline" className="text-xs">
              {data.tone}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {data.style}
            </Badge>
          </div>
        )}
      </h3>
      
      <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-4 flex items-center justify-center" style={{ minHeight: '300px' }}>
        <img 
          src={data.gifUrl} 
          alt={data.description || "GIF animado generado"}
          className="max-w-full max-h-full object-contain rounded-lg"
          style={{ 
            width: data.width ? `${data.width}px` : 'auto',
            height: data.height ? `${data.height}px` : 'auto'
          }}
        />
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          {data.duration}
          {data.loop && <span className="text-xs">🔄</span>}
        </div>
      </div>
      
      <div className="space-y-3">
        <p className="text-gray-700 font-medium">{data.description}</p>
        
        {/* Información adicional del GIF */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-orange-50 p-3 rounded-lg">
            <span className="font-medium text-orange-800">Dimensiones:</span>
            <p className="text-orange-700">{data.width || 480} x {data.height || 270} px</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <span className="font-medium text-blue-800">Duración:</span>
            <p className="text-blue-700">{data.duration} {data.loop ? '(Loop infinito)' : '(Una vez)'}</p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            ✨ <strong>GIF Generado:</strong> Este GIF fue creado automáticamente basado en tu selección de tono 
            <strong> {data.tone}</strong> y estilo <strong>{data.style}</strong>. 
            Perfecto para compartir en redes sociales.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Componente para mostrar infografías
const InfografiaContent = ({ data }: { data: any }) => (
  <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
    <CardContent className="p-8">
      <h3 className="text-lg font-bold mb-6 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-red-600" />
        {data.title}
        {data.imageUrl && (
          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
            🖼️ Con imagen personalizada
          </Badge>
        )}
      </h3>
      
      {/* Imagen personalizada si existe */}
      {data.imageUrl && (
        <div className="mb-6">
          <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
            <img 
              src={data.imageUrl} 
              alt="Imagen de referencia para infografía"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <p className="text-sm font-medium text-gray-800">Imagen base para tu infografía</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {data.sections.map((section: any, index: number) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
            <h4 className="font-semibold text-gray-800">{index + 1}. {section.title}</h4>
            <p className="text-sm text-gray-600">{section.description}</p>
          </div>
        ))}
      </div>
      
      {data.imageUrl && (
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 <strong>Tip:</strong> Esta imagen se usará como referencia visual para crear tu infografía final.
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);

// Componente para mostrar presentaciones
const PresentacionContent = ({ data }: { data: any }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  return (
    <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
      <CardContent className="p-8">
        <h3 className="text-lg font-bold mb-6 flex items-center">
          <Presentation className="w-5 h-5 mr-2 text-indigo-600" />
          {data.title}
        </h3>
        
                 {/* Visualización estilo carrusel de slides */}
         <div className="relative mb-6">
           <div className="flex items-center justify-center space-x-2 lg:space-x-4 mb-4 overflow-hidden">
             {/* Slides laterales - ocultos en móvil */}
             <div className="hidden lg:flex space-x-2">
               {[-2, -1].map((offset) => {
                 const slideIndex = currentSlide + offset;
                 if (slideIndex >= 0 && slideIndex < data.slides.length) {
                   return (
                     <div key={slideIndex} className="w-16 h-12 bg-gray-200 rounded transform scale-75 opacity-50 border border-gray-300"></div>
                   );
                 }
                 return <div key={offset} className="w-16 h-12"></div>;
               })}
             </div>
             
             {/* Slide central - responsive */}
             <div className="relative flex-shrink-0">
               <div className="w-72 sm:w-80 lg:w-96 h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 shadow-lg p-4 sm:p-6 flex flex-col justify-center relative overflow-hidden">
                 {/* Imagen de fondo si existe */}
                 {data.slides[currentSlide]?.image && (
                   <div className="absolute inset-0 opacity-20">
                     <img 
                       src={data.slides[currentSlide].image} 
                       alt="Slide background"
                       className="w-full h-full object-cover"
                     />
                   </div>
                 )}
                 <div className="relative z-10">
                   <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3 text-center">
                     {data.slides[currentSlide]?.title}
                   </h4>
                   <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                     {data.slides[currentSlide]?.content}
                   </p>
                   {data.slides[currentSlide]?.image && (
                     <div className="mt-2 text-center">
                       <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                         🖼️ Con imagen personalizada
                       </Badge>
                     </div>
                   )}
                 </div>
               </div>
             </div>
             
             {/* Slides laterales derechas - ocultos en móvil */}
             <div className="hidden lg:flex space-x-2">
               {[1, 2].map((offset) => {
                 const slideIndex = currentSlide + offset;
                 if (slideIndex < data.slides.length) {
                   return (
                     <div key={slideIndex} className="w-16 h-12 bg-gray-200 rounded transform scale-75 opacity-50 border border-gray-300"></div>
                   );
                 }
                 return <div key={offset} className="w-16 h-12"></div>;
               })}
             </div>
           </div>
          
                     {/* Navegación */}
           <div className="flex items-center justify-center space-x-4">
             <Button 
               variant="outline" 
               size="sm"
               onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
               disabled={currentSlide === 0}
               className="hover:bg-blue-50"
             >
               <ChevronLeft className="w-4 h-4" />
             </Button>
             <div className="flex items-center space-x-2">
               <span className="text-sm font-medium text-gray-600">
                 &lt;&lt; &lt;
               </span>
               {/* Paginado corregido */}
               {Array.from({ length: Math.min(5, data.slides.length) }, (_, i) => {
                 let slideNumber: number;
                 if (data.slides.length <= 5) {
                   slideNumber = i + 1;
                 } else if (currentSlide < 2) {
                   slideNumber = i + 1;
                 } else if (currentSlide >= data.slides.length - 2) {
                   slideNumber = data.slides.length - 4 + i;
                 } else {
                   slideNumber = currentSlide - 1 + i;
                 }
                 
                 const isActive = slideNumber === currentSlide + 1;
                 
                 return (
                   <span 
                     key={i}
                     className={`px-2 py-1 rounded text-sm font-semibold cursor-pointer transition-colors ${
                       isActive 
                         ? 'bg-blue-100 text-blue-700' 
                         : 'text-gray-400 hover:text-gray-600'
                     }`}
                     onClick={() => setCurrentSlide(slideNumber - 1)}
                   >
                     {slideNumber}
                   </span>
                 );
               })}
               {data.slides.length > 5 && currentSlide < data.slides.length - 3 && (
                 <span className="text-sm text-gray-400">...</span>
               )}
               {data.slides.length > 5 && currentSlide < data.slides.length - 2 && (
                 <span 
                   className="px-2 py-1 rounded text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
                   onClick={() => setCurrentSlide(data.slides.length - 1)}
                 >
                   {data.slides.length}
                 </span>
               )}
               <span className="text-sm font-medium text-gray-600">
                 &gt; &gt;&gt;
               </span>
             </div>
             <Button 
               variant="outline" 
               size="sm"
               onClick={() => setCurrentSlide(Math.min(data.slides.length - 1, currentSlide + 1))}
               disabled={currentSlide === data.slides.length - 1}
               className="hover:bg-blue-50"
             >
               <ChevronRight className="w-4 h-4" />
             </Button>
           </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function GeneratedContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentContent, generateContent } = useGeneratedContentStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [showConstructionModal, setShowConstructionModal] = useState(false);

  const contentType = (searchParams.get('type') as ContentType) || 'texto';
  const tone = searchParams.get('tone') || 'amigable';
  const style = searchParams.get('style') || 'educativos';
  const musicId = searchParams.get('music');

  // Música disponible (debe coincidir con ContentGeneratorAdvanced)
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

  const selectedMusic = musicId ? backgroundMusic.find(m => m.id === musicId) : null;

  useEffect(() => {
    const loadContent = async () => {
      if (!currentContent || currentContent.type !== contentType) {
        await generateContent(contentType, tone, style);
      }
      setIsLoading(false);
    };
    
    loadContent();
  }, [contentType, tone, style]);

  const handleDownload = () => {
    setShowDownloadModal(true);
  };

  const handleActualDownload = async (format: string) => {
    setIsDownloading(true);
    setDownloadProgress(0);

    // Simular progreso de descarga
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsDownloading(false);
            setShowDownloadModal(false);
            setDownloadProgress(0);
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handlePublish = () => {
    setShowPublishModal(true);
  };

  const handlePlatformSelect = (platform: string) => {
    if (platform === 'twitter' || platform === 'instagram') {
      setSelectedPlatform(platform);
      setShowPublishModal(false);
      setShowPreviewModal(true);
    } else {
      // Para otras plataformas, mostrar modal de construcción
      setShowPublishModal(false);
      setShowConstructionModal(true);
    }
  };

  const handleActualPublish = async () => {
    if (selectedPlatforms.length === 1) {
      handlePlatformSelect(selectedPlatforms[0]);
    } else {
      // Si hay múltiples plataformas, usar la primera disponible
      const availablePlatform = selectedPlatforms.find(p => p === 'twitter' || p === 'instagram');
      if (availablePlatform) {
        handlePlatformSelect(availablePlatform);
      } else {
        alert('Por favor selecciona Twitter o Instagram para ver la vista previa.');
      }
    }
  };

  const handlePrint = () => {
    // Lógica de impresión basada en el tipo de contenido
    if (contentType === 'videos' || contentType === 'gif') {
      setShowDownloadModal(true); // Abrir modal de descarga en su lugar
      return;
    }
    window.print();
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const getContentTypeIcon = (type: ContentType) => {
    const icons = {
      texto: FileText,
      imagenes: ImageIcon,
      videos: Video,
      gif: BarChart3,
      infografias: BarChart3,
      presentaciones: Presentation
    };
    return icons[type];
  };

  const renderContent = () => {
    if (!currentContent) return null;

    const musicUrl = selectedMusic?.url;

    switch (currentContent.type) {
      case 'texto':
        return <TextContent data={currentContent.data} />;
      case 'imagenes':
        return <ImageContent data={currentContent.data} musicUrl={musicUrl} />;
      case 'videos':
        return <VideoContent data={currentContent.data} musicUrl={musicUrl} />;
      case 'gif':
        return <GifContent data={currentContent.data} />;
      case 'infografias':
        return <InfografiaContent data={currentContent.data} />;
      case 'presentaciones':
        return <PresentacionContent data={currentContent.data} />;
      default:
        return <TextContent data={currentContent.data} />;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generando contenido increíble...</p>
          </div>
        </div>
          </DashboardLayout>
  );
}

  return (
    <DashboardLayout>
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            {currentContent?.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <Badge variant="outline" className="border-blue-200 text-blue-700">
              Tono: {tone}
            </Badge>
            <Badge variant="outline" className="border-purple-200 text-purple-700">
              Estilo: {style}
            </Badge>
            {selectedMusic && (contentType === 'videos' || contentType === 'imagenes') && (
              <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                🎵 Música: {selectedMusic.name}
              </Badge>
            )}
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Generado {currentContent?.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Generated Content */}
        <div className="mb-8">
          {renderContent()}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            onClick={handlePublish}
          >
            <Share className="w-4 h-4 mr-2" />
            Publicar
          </Button>
          <Button 
            variant="outline" 
            className="px-8 py-3 border-blue-300 text-blue-700 hover:bg-blue-50"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar
          </Button>
          <Button 
            variant="outline" 
            className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={handlePrint}
            disabled={contentType === 'videos' || contentType === 'gif'}
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Modal de Descarga */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Download className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Descargar Contenido</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDownloadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {!isDownloading ? (
                <>
                  <p className="text-gray-600 mb-6">
                    Selecciona el formato en el que deseas descargar tu contenido:
                  </p>

                  <div className="space-y-3 mb-6">
                    {contentType === 'texto' && (
                      <>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-3"
                          onClick={() => handleActualDownload('txt')}
                        >
                          <FileText className="w-4 h-4 mr-3" />
                          <div>
                            <div className="font-medium">Archivo de Texto (.txt)</div>
                            <div className="text-sm text-gray-500">Formato simple para edición</div>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-3"
                          onClick={() => handleActualDownload('docx')}
                        >
                          <FileText className="w-4 h-4 mr-3" />
                          <div>
                            <div className="font-medium">Documento Word (.docx)</div>
                            <div className="text-sm text-gray-500">Con formato y estilo</div>
                          </div>
                        </Button>
                      </>
                    )}

                    {contentType === 'imagenes' && (
                      <>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-3"
                          onClick={() => handleActualDownload('jpg')}
                        >
                          <ImageIcon className="w-4 h-4 mr-3" />
                          <div>
                            <div className="font-medium">Imágenes JPG (.jpg)</div>
                            <div className="text-sm text-gray-500">Calidad optimizada para redes</div>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-3"
                          onClick={() => handleActualDownload('png')}
                        >
                          <ImageIcon className="w-4 h-4 mr-3" />
                          <div>
                            <div className="font-medium">Imágenes PNG (.png)</div>
                            <div className="text-sm text-gray-500">Máxima calidad</div>
                          </div>
                        </Button>
                      </>
                    )}

                    {contentType === 'videos' && (
                      <>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-3"
                          onClick={() => handleActualDownload('mp4')}
                        >
                          <Video className="w-4 h-4 mr-3" />
                          <div>
                            <div className="font-medium">Video MP4 (.mp4)</div>
                            <div className="text-sm text-gray-500">Compatible con todas las plataformas</div>
                          </div>
                        </Button>
                      </>
                    )}

                    {contentType === 'gif' && (
                      <>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-3"
                          onClick={() => handleActualDownload('gif')}
                        >
                          <BarChart3 className="w-4 h-4 mr-3" />
                          <div>
                            <div className="font-medium">GIF Animado (.gif)</div>
                            <div className="text-sm text-gray-500">Listo para redes sociales</div>
                          </div>
                        </Button>
                      </>
                    )}

                    {(contentType === 'infografias' || contentType === 'presentaciones') && (
                      <>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-3"
                          onClick={() => handleActualDownload('pdf')}
                        >
                          <FileText className="w-4 h-4 mr-3" />
                          <div>
                            <div className="font-medium">Documento PDF (.pdf)</div>
                            <div className="text-sm text-gray-500">Formato profesional</div>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-3"
                          onClick={() => handleActualDownload('pptx')}
                        >
                          <Presentation className="w-4 h-4 mr-3" />
                          <div>
                            <div className="font-medium">PowerPoint (.pptx)</div>
                            <div className="text-sm text-gray-500">Editable y personalizable</div>
                          </div>
                        </Button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {downloadProgress === 100 ? '¡Descarga Completada!' : 'Descargando...'}
                  </h4>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {downloadProgress === 100 ? 'Tu archivo se ha descargado exitosamente' : `${downloadProgress}% completado`}
                  </p>
                  {downloadProgress === 100 && (
                    <div className="mt-4">
                      <Check className="w-8 h-8 text-green-500 mx-auto" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Publicación */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <Share className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Publicar Contenido</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPublishModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <p className="text-gray-600 mb-6">
                Selecciona las plataformas donde quieres publicar tu contenido:
              </p>

              <div className="space-y-3 mb-6">
                {[
                  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500', description: 'Stories, Posts y Reels' },
                  { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'bg-black', description: 'Tweets y hilos' },
                  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-600', description: 'Posts profesionales' },
                  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-700', description: 'Posts y páginas' }
                ].map((platform) => {
                  const IconComponent = platform.icon;
                  const isSelected = selectedPlatforms.includes(platform.id);
                  
                  return (
                    <Button
                      key={platform.id}
                      variant="outline"
                      className={`w-full justify-start text-left h-auto py-3 transition-all ${
                        isSelected 
                          ? 'border-purple-300 bg-purple-50 ring-2 ring-purple-200' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      <div className={`w-8 h-8 ${platform.color} rounded-full flex items-center justify-center mr-3`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium flex items-center">
                          {platform.name}
                          {isSelected && <Check className="w-4 h-4 ml-2 text-purple-600" />}
                        </div>
                        <div className="text-sm text-gray-500">{platform.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleActualPublish}
                  disabled={selectedPlatforms.length === 0}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Publicar en {selectedPlatforms.length} plataforma{selectedPlatforms.length !== 1 ? 's' : ''}
                </Button>
              </div>

              {selectedPlatforms.length > 0 && (
                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-700">
                    ✨ <strong>Próximamente:</strong> Publicación automática programada y análisis de engagement en tiempo real.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Vista Previa de Redes Sociales */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`w-10 h-10 ${selectedPlatform === 'twitter' ? 'bg-black' : 'bg-pink-500'} rounded-full flex items-center justify-center mr-3`}>
                    {selectedPlatform === 'twitter' ? (
                      <Twitter className="w-5 h-5 text-white" />
                    ) : (
                      <Instagram className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Vista Previa - {selectedPlatform === 'twitter' ? 'Twitter/X' : 'Instagram'}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Vista Previa de Twitter */}
              {selectedPlatform === 'twitter' && (
                <div className="border border-gray-200 rounded-xl p-4 bg-white">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">TU</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-bold text-gray-900">Tu Cuenta</span>
                        <span className="text-gray-500">@tucuenta</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">ahora</span>
                      </div>
                                             <div className="text-gray-900 mb-3">
                         {currentContent?.type === 'texto' && (
                           <p className="whitespace-pre-wrap">{currentContent.data.content}</p>
                         )}
                         {currentContent?.type === 'imagenes' && (
                           <p>🖼️ Nuevo carousel de imágenes generado con IA sobre: {currentContent?.title}</p>
                         )}
                         {currentContent?.type === 'videos' && (
                           <p>🎥 Nuevo video script generado: {currentContent?.title}</p>
                         )}
                         {currentContent?.type === 'gif' && (
                           <p>🎯 Nuevo GIF animado generado: {currentContent?.title}</p>
                         )}
                         {currentContent?.type === 'infografias' && (
                           <p>📊 Nueva infografía generada: {currentContent?.title}</p>
                         )}
                         {currentContent?.type === 'presentaciones' && (
                           <p>📋 Nueva presentación generada: {currentContent?.title}</p>
                         )}
                       </div>
                       
                       {/* Mostrar contenido visual según el tipo */}
                       {currentContent?.type === 'imagenes' && currentContent.data.images && (
                         <div className="border border-gray-200 rounded-2xl overflow-hidden mb-3">
                           <img 
                             src={currentContent.data.images[0]} 
                             alt="Contenido generado"
                             className="w-full h-64 object-cover"
                           />
                         </div>
                       )}
                       
                       {currentContent?.type === 'gif' && currentContent.data.gifUrl && (
                         <div className="border border-gray-200 rounded-2xl overflow-hidden mb-3">
                           <img 
                             src={currentContent.data.gifUrl} 
                             alt="GIF generado"
                             className="w-full h-64 object-cover"
                           />
                         </div>
                       )}
                       
                       {currentContent?.type === 'videos' && currentContent.data.thumbnail && (
                         <div className="border border-gray-200 rounded-2xl overflow-hidden mb-3 relative">
                           <img 
                             src={currentContent.data.thumbnail} 
                             alt="Video thumbnail"
                             className="w-full h-64 object-cover"
                           />
                           <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                             <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                               <Play className="w-8 h-8 text-gray-800 ml-1" />
                             </div>
                           </div>
                         </div>
                       )}
                       
                       {currentContent?.type === 'infografias' && currentContent.data.chartImage && (
                         <div className="border border-gray-200 rounded-2xl overflow-hidden mb-3">
                           <img 
                             src={currentContent.data.chartImage} 
                             alt="Infografía generada"
                             className="w-full h-64 object-cover"
                           />
                         </div>
                       )}
                       
                       {currentContent?.type === 'presentaciones' && currentContent.data.slides && (
                         <div className="border border-gray-200 rounded-2xl overflow-hidden mb-3">
                           <img 
                             src={currentContent.data.slides[0].image} 
                             alt="Presentación generada"
                             className="w-full h-64 object-cover"
                           />
                         </div>
                       )}
                      <div className="flex items-center justify-between text-gray-500 max-w-md">
                        <div className="flex items-center space-x-2 hover:text-blue-500 cursor-pointer">
                          <MessageCircle className="w-5 h-5" />
                          <span>24</span>
                        </div>
                        <div className="flex items-center space-x-2 hover:text-green-500 cursor-pointer">
                          <Repeat2 className="w-5 h-5" />
                          <span>12</span>
                        </div>
                        <div className="flex items-center space-x-2 hover:text-red-500 cursor-pointer">
                          <Heart className="w-5 h-5" />
                          <span>156</span>
                        </div>
                        <div className="flex items-center space-x-2 hover:text-blue-500 cursor-pointer">
                          <Share className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Vista Previa de Instagram */}
              {selectedPlatform === 'instagram' && (
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">TU</span>
                      </div>
                      <span className="font-semibold text-gray-900">tu_cuenta</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="text-2xl">⋯</span>
                    </div>
                  </div>
                  
                                     {/* Mostrar contenido visual según el tipo */}
                   {currentContent?.type === 'imagenes' && currentContent.data.images ? (
                     <div className="aspect-square bg-gray-100">
                       <img 
                         src={currentContent.data.images[0]} 
                         alt="Contenido generado"
                         className="w-full h-full object-cover"
                       />
                     </div>
                   ) : currentContent?.type === 'gif' && currentContent.data.gifUrl ? (
                     <div className="aspect-square bg-gray-100">
                       <img 
                         src={currentContent.data.gifUrl} 
                         alt="GIF generado"
                         className="w-full h-full object-cover"
                       />
                     </div>
                   ) : currentContent?.type === 'videos' && currentContent.data.thumbnail ? (
                     <div className="aspect-square bg-gray-100 relative">
                       <img 
                         src={currentContent.data.thumbnail} 
                         alt="Video thumbnail"
                         className="w-full h-full object-cover"
                       />
                       <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                         <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                           <Play className="w-8 h-8 text-gray-800 ml-1" />
                         </div>
                       </div>
                     </div>
                   ) : currentContent?.type === 'infografias' && currentContent.data.chartImage ? (
                     <div className="aspect-square bg-gray-100">
                       <img 
                         src={currentContent.data.chartImage} 
                         alt="Infografía generada"
                         className="w-full h-full object-cover"
                       />
                     </div>
                   ) : currentContent?.type === 'presentaciones' && currentContent.data.slides ? (
                     <div className="aspect-square bg-gray-100">
                       <img 
                         src={currentContent.data.slides[0].image} 
                         alt="Presentación generada"
                         className="w-full h-full object-cover"
                       />
                     </div>
                   ) : (
                     <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-8">
                       <div className="text-center">
                         <div className="text-4xl mb-4">
                           {currentContent?.type === 'texto' ? '📝' : 
                            currentContent?.type === 'videos' ? '🎥' : 
                            currentContent?.type === 'gif' ? '🎯' : 
                            currentContent?.type === 'infografias' ? '📊' : 
                            currentContent?.type === 'presentaciones' ? '📋' : '🎯'}
                         </div>
                         <p className="text-gray-800 font-medium text-lg">
                           {currentContent?.title}
                         </p>
                       </div>
                     </div>
                   )}
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <Heart className="w-6 h-6 text-gray-800 cursor-pointer hover:text-red-500" />
                        <MessageCircle className="w-6 h-6 text-gray-800 cursor-pointer" />
                        <Send className="w-6 h-6 text-gray-800 cursor-pointer" />
                      </div>
                      <Bookmark className="w-6 h-6 text-gray-800 cursor-pointer" />
                    </div>
                    <div className="text-sm text-gray-900 mb-2">
                      <span className="font-semibold">234 Me gusta</span>
                    </div>
                                         <div className="text-sm text-gray-900">
                       <span className="font-semibold">tu_cuenta</span>{' '}
                       {currentContent?.type === 'texto' ? (
                         currentContent.data.content.substring(0, 100) + '...'
                       ) : currentContent?.type === 'imagenes' ? (
                         `🖼️ Nuevo carousel de imágenes sobre: ${currentContent?.title} #IA #Marketing #Contenido #Imagenes`
                       ) : currentContent?.type === 'videos' ? (
                         `🎥 Nuevo video script: ${currentContent?.title} #Video #IA #Marketing #Contenido`
                       ) : currentContent?.type === 'gif' ? (
                         `🎯 Nuevo GIF animado: ${currentContent?.title} #GIF #IA #Marketing #Contenido`
                       ) : currentContent?.type === 'infografias' ? (
                         `📊 Nueva infografía: ${currentContent?.title} #Infografia #IA #Marketing #Datos`
                       ) : currentContent?.type === 'presentaciones' ? (
                         `📋 Nueva presentación: ${currentContent?.title} #Presentacion #IA #Marketing #Contenido`
                       ) : (
                         `🚀 Nuevo contenido: ${currentContent?.title} #IA #Marketing #Contenido`
                       )}
                     </div>
                    <div className="text-sm text-gray-500 mt-2">
                      hace 2 minutos
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-semibold text-green-800">¡Publicado Exitosamente!</span>
                </div>
                <p className="text-sm text-green-700">
                  Tu contenido se ha publicado en {selectedPlatform === 'twitter' ? 'Twitter/X' : 'Instagram'} y está siendo visto por tu audiencia.
                </p>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowPreviewModal(false)}
                  className="flex-1"
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setSelectedPlatforms([]);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Publicar en Otra Red
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Construcción para Otras Plataformas */}
      {showConstructionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <div className="text-orange-600 font-bold text-lg">🚧</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">En Construcción</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConstructionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="text-center py-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-3xl">⚡</div>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  ¡Próximamente Disponible!
                </h4>
                <p className="text-gray-600 mb-6">
                  Esta plataforma estará disponible muy pronto. Por ahora puedes usar <strong>Twitter</strong> o <strong>Instagram</strong> para ver la vista previa de tu contenido.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <div className="text-blue-600 mr-2 mt-1">💡</div>
                    <div className="text-left">
                      <p className="text-sm text-blue-800 font-medium mb-1">¿Sabías que?</p>
                      <p className="text-sm text-blue-700">
                        Estamos trabajando en integrar LinkedIn, Facebook y TikTok con funciones avanzadas como programación automática y análisis de engagement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConstructionModal(false)}
                  className="flex-1"
                >
                  Entendido
                </Button>
                <Button
                  onClick={() => {
                    setShowConstructionModal(false);
                    setShowPublishModal(true);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Elegir Otra Plataforma
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
