'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Video,
  Wand2,
  Sparkles,
  Clock,
  Target,
  Palette,
  Volume2,
  Download,
  Printer,
  ArrowLeft,
  Copy,
  CheckCircle
} from 'lucide-react';

// Componente de loader animado
const AILoader = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="relative">
      <Wand2 className="w-5 h-5 text-white animate-pulse" />
      <div className="absolute -top-1 -right-1">
        <Sparkles className="w-3 h-3 text-yellow-300 animate-bounce" />
      </div>
    </div>
    <span>Generando guión</span>
    <div className="flex space-x-1">
      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  </div>
);

export function VideoScriptSection() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [showResult, setShowResult] = useState(false);
  
  const [selectedTone, setSelectedTone] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedFocus, setSelectedFocus] = useState('');
  const [podcastAnalysis, setPodcastAnalysis] = useState('');

  const toneOptions = [
    { value: 'conversacional', label: 'Conversacional', emoji: '💬', description: 'Estilo de podcast natural' },
    { value: 'profesional', label: 'Profesional', emoji: '💼', description: 'Serio y corporativo' },
    { value: 'dinamico', label: 'Dinámico', emoji: '⚡', description: 'Energético y atractivo' },
    { value: 'educativo', label: 'Educativo', emoji: '🎓', description: 'Enfoque didáctico' },
    { value: 'entretenido', label: 'Entretenido', emoji: '🎉', description: 'Divertido y ligero' }
  ];

  const styleOptions = [
    { value: 'resumen', label: 'Resumen', emoji: '📋', description: 'Síntesis de puntos clave' },
    { value: 'storytelling', label: 'Storytelling', emoji: '📖', description: 'Narrativa cautivadora' },
    { value: 'analisis', label: 'Análisis', emoji: '🔍', description: 'Profundización en temas' },
    { value: 'tutorial', label: 'Tutorial', emoji: '🎯', description: 'Enseñanza paso a paso' },
    { value: 'debate', label: 'Debate', emoji: '💭', description: 'Diferentes perspectivas' },
    { value: 'entrevista', label: 'Entrevista', emoji: '🎤', description: 'Formato Q&A' }
  ];

  const focusOptions = [
    { value: 'insights', label: 'Insights Clave', emoji: '💡', description: 'Puntos más importantes' },
    { value: 'quotes', label: 'Mejores Citas', emoji: '💬', description: 'Frases destacadas' },
    { value: 'takeaways', label: 'Takeaways', emoji: '✅', description: 'Lecciones aprendidas' },
    { value: 'behind-scenes', label: 'Behind the Scenes', emoji: '🎬', description: 'Contexto adicional' },
    { value: 'reaction', label: 'Reacciones', emoji: '😮', description: 'Respuestas y opiniones' },
    { value: 'extension', label: 'Extensión', emoji: '🔄', description: 'Continuación del tema' }
  ];

  const handleGenerate = async () => {
    if (!selectedTone || !selectedStyle || !selectedFocus || !podcastAnalysis) {
      return;
    }

    setIsGenerating(true);
    
    // Simular proceso de generación con delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generar contenido mockeado basado en las selecciones
    const mockScript = generateMockScript(selectedTone, selectedStyle, selectedFocus, podcastAnalysis);
    
    setGeneratedScript(mockScript);
    setShowResult(true);
    setIsGenerating(false);
  };

  const generateMockScript = (tone: string, style: string, focus: string, analysis: string) => {
    const introVariations = {
      conversacional: '¡Hola! Acabo de escuchar un podcast increíble y quería compartir contigo',
      profesional: 'En el podcast de hoy hemos analizado',
      dinamico: '¡Esto es lo que NO te puedes perder del último podcast sobre',
      educativo: 'En este video vamos a explorar los conceptos clave del podcast sobre',
      entretenido: '¿Sabías que en el último podcast descubrí algo que me voló la mente?'
    };

    const development = `${analysis}

[DESARROLLO DEL CONTENIDO]
• Contexto del podcast y por qué es relevante
• Puntos principales extraídos del análisis
• Ejemplos específicos y casos mencionados
• Conexiones con tendencias actuales
• Aplicaciones prácticas de los conceptos

[LLAMADA A LA ACCIÓN]
Si te gustó este contenido basado en el podcast, no olvides suscribirte y déjame saber en los comentarios qué otros podcasts te gustaría que analice.`;

    return `[INTRO - 0:00-0:20]
${introVariations[tone as keyof typeof introVariations]} ${analysis.slice(0, 100)}...

${development}

 [DURACIÓN ESTIMADA: 3-5 minutos]`;
  };

  const handleBack = () => {
    setShowResult(false);
    setGeneratedScript('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript);
    // Aquí podrías agregar una notificación de éxito
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedScript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'guion-podcast.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Guión de Podcast</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              .header { border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-bottom: 20px; }
              .content { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Guión Generado</h1>
              <p>Generado el ${new Date().toLocaleDateString('es-ES')}</p>
            </div>
            <div class="content">${generatedScript}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (showResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        {/* Header con botón volver */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center space-x-2 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-medium">Guión generado</span>
          </div>
        </div>

        {/* Resultado generado */}
        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Tu Guión Generado</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {selectedTone}
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {selectedStyle}
                </Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {selectedFocus}
                </Badge>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                {generatedScript}
              </pre>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="flex-1 hover:bg-blue-50 hover:border-blue-300"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Guión
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1 hover:bg-green-50 hover:border-green-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex-1 hover:bg-purple-50 hover:border-purple-300"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl mb-4">
          <Video className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Generador de Guiones
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Convierte el análisis de tu podcast en un guión profesional para video
        </p>
      </div>

      <div className="space-y-6">
        {/* Personalización Section */}
        <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <Palette className="w-5 h-5 mr-2 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Personalización del Guión</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tono */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Volume2 className="w-4 h-4 mr-2 text-blue-500" />
                  Tono
                </label>
                <Select onValueChange={setSelectedTone} value={selectedTone}>
                  <SelectTrigger className="bg-white/80 border-gray-200 focus:border-purple-300 focus:ring-purple-200">
                    <SelectValue placeholder="Selecciona un tono" />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        <div className="flex items-center space-x-2">
                          <span>{tone.emoji}</span>
                          <div>
                            <div className="font-medium">{tone.label}</div>
                            <div className="text-xs text-gray-500">{tone.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Estilo */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Palette className="w-4 h-4 mr-2 text-green-500" />
                  Estilo
                </label>
                <Select onValueChange={setSelectedStyle} value={selectedStyle}>
                  <SelectTrigger className="bg-white/80 border-gray-200 focus:border-purple-300 focus:ring-purple-200">
                    <SelectValue placeholder="Selecciona un estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    {styleOptions.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        <div className="flex items-center space-x-2">
                          <span>{style.emoji}</span>
                          <div>
                            <div className="font-medium">{style.label}</div>
                            <div className="text-xs text-gray-500">{style.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Enfoque */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Target className="w-4 h-4 mr-2 text-orange-500" />
                  Enfoque
                </label>
                <Select onValueChange={setSelectedFocus} value={selectedFocus}>
                  <SelectTrigger className="bg-white/80 border-gray-200 focus:border-purple-300 focus:ring-purple-200">
                    <SelectValue placeholder="Selecciona un enfoque" />
                  </SelectTrigger>
                  <SelectContent>
                    {focusOptions.map((focus) => (
                      <SelectItem key={focus.value} value={focus.value}>
                        <div className="flex items-center space-x-2">
                          <span>{focus.emoji}</span>
                          <div>
                            <div className="font-medium">{focus.label}</div>
                            <div className="text-xs text-gray-500">{focus.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Análisis del Podcast */}
        <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              🎙️ Análisis del Podcast
            </label>
            <Textarea
              placeholder="Pega aquí el análisis extraído del podcast que quieres convertir en guión de video. Incluye los puntos clave, insights principales, citas importantes y cualquier información relevante..."
              value={podcastAnalysis}
              onChange={(e) => setPodcastAnalysis(e.target.value)}
              className="min-h-[150px] bg-white/80 border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-none"
            />
            <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
              <span>Información extraída del podcast para crear el guión</span>
              <span>{podcastAnalysis.length}/2000</span>
            </div>
          </CardContent>
        </Card>

        {/* Selected Options Preview */}
        {(selectedTone || selectedStyle || selectedFocus) && (
          <Card className="shadow-sm border-0 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Tu selección:</span>
                  {selectedTone && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {toneOptions.find(t => t.value === selectedTone)?.emoji} {toneOptions.find(t => t.value === selectedTone)?.label}
                    </Badge>
                  )}
                  {selectedStyle && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {styleOptions.find(s => s.value === selectedStyle)?.emoji} {styleOptions.find(s => s.value === selectedStyle)?.label}
                    </Badge>
                  )}
                  {selectedFocus && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {focusOptions.find(f => f.value === selectedFocus)?.emoji} {focusOptions.find(f => f.value === selectedFocus)?.label}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  ~3-5 min
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generate Button */}
        <div className="pt-6">
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !selectedTone || !selectedStyle || !selectedFocus || !podcastAnalysis}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-70"
          >
            {isGenerating ? (
              <AILoader />
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Video className="w-5 h-5" />
                <span>Generar Guión</span>
                <Sparkles className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 