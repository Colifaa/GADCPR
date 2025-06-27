'use client';

import React, { useState } from 'react';
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
  Presentation
} from 'lucide-react';

export function ContentGeneratorAdvanced() {
  const [selectedContentType, setSelectedContentType] = useState('texto');
  const [selectedTone, setSelectedTone] = useState('amigable');
  const [selectedStyle, setSelectedStyle] = useState('educativos');
  const [searchQuery, setSearchQuery] = useState('');

  const contentTypes = [
    { id: 'texto', name: 'Texto', icon: FileText, active: true },
    { id: 'imagenes', name: 'Imágenes', icon: ImageIcon, active: false },
    { id: 'videos', name: 'Videos', icon: Video, active: false },
    { id: 'gif', name: 'GIF', icon: BarChart3, active: false },
    { id: 'infografias', name: 'Infografías', icon: BarChart3, active: false },
    { id: 'presentaciones', name: 'Presentaciones', icon: Presentation, active: false }
  ];

  const images = [
    '/images/landing/landing.png',
    '/images/landing/landing2.png',
    '/images/landing/landing3.png'
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b bg-white">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-semibold text-gray-900">Generación de contenido</h1>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="flex-1 flex flex-col">
        <div className="flex-shrink-0 px-6 py-4 bg-white border-b">
          <div className="flex justify-center max-w-7xl mx-auto">
            <Tabs defaultValue="redes-sociales" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="redes-sociales" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Redes sociales
              </TabsTrigger>
              <TabsTrigger 
                value="guiones-video" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Guiones de video
              </TabsTrigger>
              <TabsTrigger 
                value="capacitaciones" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Capacitaciones
              </TabsTrigger>
            </TabsList>

              <TabsContent value="redes-sociales" className="flex-1 flex flex-col h-full">
                {/* Content Type Selection */}
                <div className="flex-shrink-0 px-6 py-4 bg-white border-b">
                  <div className="flex items-center justify-center space-x-6 max-w-7xl mx-auto">
                    {contentTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <div key={type.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={type.id}
                            checked={selectedContentType === type.id}
                            onCheckedChange={() => setSelectedContentType(type.id)}
                            className="rounded-full"
                          />
                          <IconComponent className="w-4 h-4 text-gray-600" />
                          <label 
                            htmlFor={type.id}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {type.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                                                  {/* Main Content Area - Full Width */}
                 <div className="flex-1 bg-white">
                   <div className="max-w-4xl mx-auto p-8 h-full flex flex-col">
                     <div className="flex-1 overflow-y-auto">
                       <div className="space-y-8">
                         {/* Tone Selection */}
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-3">
                             Tono
                           </label>
                           <div className="flex space-x-2">
                             <Badge 
                               variant={selectedTone === 'amigable' ? 'default' : 'secondary'}
                               className="cursor-pointer"
                               onClick={() => setSelectedTone('amigable')}
                             >
                               Amigable
                             </Badge>
                           </div>
                         </div>

                         {/* Style Selection */}
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-3">
                             Estilo
                           </label>
                           <div className="flex space-x-2">
                             <Badge 
                               variant={selectedStyle === 'educativos' ? 'default' : 'secondary'}
                               className="cursor-pointer"
                               onClick={() => setSelectedStyle('educativos')}
                             >
                               Educativos
                             </Badge>
                           </div>
                         </div>

                         {/* Images Section */}
                         <div>
                           <div className="flex items-center justify-between mb-4">
                             <label className="block text-sm font-medium text-gray-700">
                               Imágenes
                             </label>
                             <div className="flex space-x-2">
                               <Button variant="outline" size="sm">
                                 <Plus className="w-4 h-4 mr-1" />
                                 Agregar
                               </Button>
                               <Button variant="outline" size="sm">
                                 Remplazar
                               </Button>
                             </div>
                           </div>
                           
                           <div className="grid grid-cols-3 gap-2 max-w-xs">
                             {images.map((image, index) => (
                               <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                 <img 
                                   src={image} 
                                   alt={`Imagen ${index + 1}`}
                                   className="w-full h-full object-cover"
                                 />
                               </div>
                             ))}
                           </div>
                         </div>

                         {/* Music Section */}
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-3">
                             Música
                           </label>
                           <div className="flex items-center space-x-2">
                             <Input 
                               placeholder="Search" 
                               value={searchQuery}
                               onChange={(e) => setSearchQuery(e.target.value)}
                               className="flex-1"
                             />
                             <Button variant="outline" size="sm">
                               <Search className="w-4 h-4" />
                               Buscar
                             </Button>
                           </div>
                           <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                             <Music className="w-4 h-4" />
                             <span>Enlace de la música</span>
                           </div>
                         </div>
                       </div>
                     </div>
                     
                     {/* Generate Button - Fixed at bottom */}
                     <div className="flex-shrink-0 pt-8">
                       <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                         Generar con AI
                       </Button>
                     </div>
                   </div>
                 </div>
              </TabsContent>

              <TabsContent value="guiones-video" className="flex-1 flex items-center justify-center h-full">
                <div className="text-center py-12">
                  <p className="text-gray-500">Contenido para Guiones de video próximamente...</p>
                </div>
              </TabsContent>

              <TabsContent value="capacitaciones" className="flex-1 flex items-center justify-center h-full">
                <div className="text-center py-12">
                  <p className="text-gray-500">Contenido para Capacitaciones próximamente...</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 