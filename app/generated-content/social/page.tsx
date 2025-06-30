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
  Home
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
        GIF Animado
      </h3>
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
        <img 
          src={data.thumbnail} 
          alt="GIF preview"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{data.description}</p>
        <Badge variant="secondary">{data.duration}</Badge>
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
                 let slideNum;
                 if (data.slides.length <= 5) {
                   slideNum = i + 1;
                 } else if (currentSlide < 2) {
                   slideNum = i + 1;
                 } else if (currentSlide >= data.slides.length - 2) {
                   slideNum = data.slides.length - 4 + i;
                 } else {
                   slideNum = currentSlide - 1 + i;
                 }
                 
                 const isActive = slideNum === currentSlide + 1;
                 
                 return (
                   <span 
                     key={i}
                     className={`px-2 py-1 rounded text-sm font-semibold cursor-pointer transition-colors ${
                       isActive 
                         ? 'bg-blue-100 text-blue-700' 
                         : 'text-gray-400 hover:text-gray-600'
                     }`}
                     onClick={() => setCurrentSlide(slideNum - 1)}
                   >
                     {slideNum}
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
    // Lógica de descarga basada en el tipo de contenido
    if (contentType === 'videos' || contentType === 'gif') {
      alert('Descargando archivo multimedia...');
    } else {
      alert('Descargando contenido...');
    }
  };

  const handlePrint = () => {
    // Lógica de impresión basada en el tipo de contenido
    if (contentType === 'videos' || contentType === 'gif') {
      alert('No se puede imprimir contenido multimedia. Puedes descargar el archivo en su lugar.');
      return;
    }
    window.print();
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

  const ContentIcon = getContentTypeIcon(contentType);

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
            onClick={() => alert('Función de publicación próximamente...')}
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
    </DashboardLayout>
  );
}
