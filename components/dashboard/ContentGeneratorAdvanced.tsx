'use client';

import React, { useState } from 'react';
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
  Wand2
} from 'lucide-react';
import { TrainingSection } from './TrainingSection';
import { VideoScriptSection } from './VideoScriptSection';
import { useProjectsStore } from '@/store/projects';
import { useGeneratedContentStore } from '@/store/generated-content';

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

export function ContentGeneratorAdvanced() {
  const router = useRouter();
  const { projects, linkContentToProject } = useProjectsStore();
  const { generateContent } = useGeneratedContentStore();
  const [selectedContentType, setSelectedContentType] = useState('texto');
  const [selectedTone, setSelectedTone] = useState('amigable');
  const [selectedStyle, setSelectedStyle] = useState('educativos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const images = [
    '/images/landing/landing.png',
    '/images/landing/landing2.png',
    '/images/landing/landing3.png'
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Generar contenido en el store
    await generateContent(selectedContentType as any, selectedTone, selectedStyle);
    
    // Vincular el contenido generado con el proyecto más reciente (si existe)
    if (projects.length > 0) {
      const latestProject = projects[0];
      const contentParams = {
        type: selectedContentType,
        tone: selectedTone,
        style: selectedStyle
      };
      linkContentToProject(latestProject.id, contentParams);
    }
    
    // Navegar a la página de contenido generado con parámetros
    const params = new URLSearchParams({
      type: selectedContentType,
      tone: selectedTone,
      style: selectedStyle
    });
    
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

                  {/* Images Section */}
                  <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-semibold text-gray-700">
                          🖼️ Imágenes de referencia
                        </label>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300 transition-colors">
                            <Plus className="w-4 h-4 mr-1" />
                            Agregar
                          </Button>
                          <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-300 transition-colors">
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Remplazar
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 max-w-sm">
                        {images.map((image, index) => (
                          <div 
                            key={index} 
                            className="group aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                          >
                            <img 
                              src={image} 
                              alt={`Imagen ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Music Section */}
                  <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        🎵 Música de fondo
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <Input 
                          placeholder="Buscar música o pegar enlace..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 bg-white/80 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                        />
                        <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300 transition-colors">
                          <Search className="w-4 h-4 mr-1" />
                          Buscar
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2 mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <Music className="w-4 h-4 text-blue-500" />
                        <span>Enlace de la música aparecerá aquí</span>
                      </div>
                    </CardContent>
                  </Card>

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