'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  Cpu, 
  Headphones, 
  Users, 
  BarChart, 
  Building, 
  GraduationCap, 
  Heart,
  FileText,
  Mic,
  Video,
  Image,
  ChevronRight,
  Sparkles
} from 'lucide-react';

// Definir tipos para las preferencias
export interface UserPreferences {
  interestTopics: string[];
  contentFormat: string[];
  tone: string;
  frequency: string;
  targetAudience: string[];
}

interface PreferencesSetupProps {
  onComplete: (preferences: UserPreferences) => void;
  isLoading?: boolean;
}

// Temas de interés disponibles
const INTEREST_TOPICS = [
  {
    id: 'tendencias-redes-sociales',
    name: 'Tendencias en Redes Sociales',
    icon: TrendingUp
  },
  {
    id: 'tendencias-educacion',
    name: 'Tendencias en la Educación',
    icon: GraduationCap
  },
  {
    id: 'sustainability',
    name: 'Sustainability',
    icon: Heart
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: Cpu
  },
  {
    id: 'aprendizaje',
    name: 'Aprendizaje',
    icon: GraduationCap
  },
  {
    id: 'arte',
    name: 'Arte',
    icon: Image
  },
  {
    id: 'creatividad',
    name: 'Creatividad',
    icon: Sparkles
  },
  {
    id: 'tecnologia',
    name: 'Tecnología',
    icon: Cpu
  }
];



// Formatos de contenido disponibles (Preferencias)
const CONTENT_FORMATS = [
  {
    id: 'social-media',
    name: 'Social Media',
    icon: Users
  },
  {
    id: 'reels',
    name: 'Reels',
    icon: Video
  },
  {
    id: 'comunidad-online',
    name: 'Comunidad en línea',
    icon: Users
  },
  {
    id: 'historias-personales',
    name: 'Historias personales',
    icon: Heart
  },
  {
    id: 'justicia',
    name: 'Justicia',
    icon: BarChart
  },
  {
    id: 'crecimiento-personal',
    name: 'Crecimiento personal',
    icon: TrendingUp
  },
  {
    id: 'articulos-informativos',
    name: 'Artículos Informativos',
    icon: FileText
  },
  {
    id: 'publicaciones-interactivas',
    name: 'Publicaciones Interactivas',
    icon: Sparkles
  }
];



// Opciones de tono
const TONE_OPTIONS = [
  { id: 'formal', name: 'Formal', description: 'Profesional y serio', icon: Building },
  { id: 'informal', name: 'Informal', description: 'Casual y cercano', icon: Users },
  { id: 'educativo', name: 'Educativo', description: 'Informativo y didáctico', icon: GraduationCap },
  { id: 'promocional', name: 'Promocional', description: 'Persuasivo y comercial', icon: TrendingUp },
  { id: 'inspirador', name: 'Inspirador', description: 'Motivacional y positivo', icon: Heart }
];

// Opciones de frecuencia
const FREQUENCY_OPTIONS = [
  { id: 'diario', name: 'Diario', description: 'Contenido todos los días', icon: BarChart },
  { id: 'semanal', name: 'Semanal', description: 'Contenido cada semana', icon: TrendingUp },
  { id: 'mensual', name: 'Mensual', description: 'Contenido cada mes', icon: Building },
  { id: 'personalizado', name: 'Personalizado', description: 'Según mi estrategia', icon: Sparkles }
];

// Audiencia objetivo
const TARGET_AUDIENCE = [
  { id: 'profesionales', name: 'Profesionales', description: 'Ejecutivos y empresarios', icon: Building },
  { id: 'jovenes', name: 'Jóvenes', description: '18-30 años', icon: Users },
  { id: 'estudiantes', name: 'Estudiantes', description: 'Universitarios y académicos', icon: GraduationCap },
  { id: 'publico-general', name: 'Público General', description: 'Audiencia amplia', icon: Heart },
  { id: 'empresas', name: 'Empresas', description: 'B2B y corporativo', icon: BarChart }
];

export function PreferencesSetup({ onComplete, isLoading = false }: PreferencesSetupProps) {
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    interestTopics: [],
    contentFormat: [],
    tone: '',
    frequency: '',
    targetAudience: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const handleTopicChange = (topicId: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      interestTopics: checked 
        ? [...prev.interestTopics, topicId]
        : prev.interestTopics.filter(id => id !== topicId)
    }));
  };

  const handleFormatChange = (formatId: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      contentFormat: checked 
        ? [...prev.contentFormat, formatId]
        : prev.contentFormat.filter(id => id !== formatId)
    }));
  };

  const handleAudienceChange = (audienceId: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      targetAudience: checked 
        ? [...prev.targetAudience, audienceId]
        : prev.targetAudience.filter(id => id !== audienceId)
    }));
  };

  const handleToneChange = (toneId: string) => {
    setPreferences(prev => ({ ...prev, tone: toneId }));
  };

  const handleFrequencyChange = (frequencyId: string) => {
    setPreferences(prev => ({ ...prev, frequency: frequencyId }));
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: return preferences.interestTopics.length > 0;
      case 2: return preferences.contentFormat.length > 0;
      case 3: return preferences.tone !== '';
      case 4: return preferences.frequency !== '';
      case 5: return preferences.targetAudience.length > 0;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (preferences.interestTopics.length === 0) {
      toast({
        title: "Selección requerida",
        description: "Por favor selecciona al menos un tema de interés.",
        variant: "destructive",
      });
      return;
    }

    if (preferences.contentFormat.length === 0) {
      toast({
        title: "Selección requerida",
        description: "Por favor selecciona al menos un formato de contenido.",
        variant: "destructive",
      });
      return;
    }

    if (!preferences.tone || !preferences.frequency || preferences.targetAudience.length === 0) {
      toast({
        title: "Configuración incompleta",
        description: "Por favor completa todas las preferencias.",
        variant: "destructive",
      });
      return;
    }

    onComplete(preferences);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Intereses</h3>
              <p className="text-gray-600">Selecciona los temas que te interesan</p>
            </div>
            
            {/* Intereses principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {INTEREST_TOPICS.map((topic) => {
                const IconComponent = topic.icon;
                const isSelected = preferences.interestTopics.includes(topic.id);
                return (
                  <div key={topic.id} className="bg-gray-50 p-4 rounded-lg text-center space-y-3">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{topic.name}</p>
                    <div className="flex justify-center">
                      <Checkbox
                        id={topic.id}
                        checked={isSelected}
                        onCheckedChange={(checked) => handleTopicChange(topic.id, checked as boolean)}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Preferencias</h3>
              <p className="text-gray-600">Selecciona tus formatos de contenido preferidos</p>
            </div>
            
            {/* Preferencias principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CONTENT_FORMATS.map((format) => {
                const IconComponent = format.icon;
                const isSelected = preferences.contentFormat.includes(format.id);
                return (
                  <div key={format.id} className="bg-gray-50 p-4 rounded-lg text-center space-y-3">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{format.name}</p>
                    <div className="flex justify-center">
                      <Checkbox
                        id={format.id}
                        checked={isSelected}
                        onCheckedChange={(checked) => handleFormatChange(format.id, checked as boolean)}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Tono de Contenido</h3>
              <p className="text-gray-600">Selecciona el estilo de comunicación para tu contenido</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TONE_OPTIONS.map((tone) => {
                const IconComponent = tone.icon;
                const isSelected = preferences.tone === tone.id;
                return (
                  <div 
                    key={tone.id} 
                    className={`bg-gray-50 p-4 rounded-lg cursor-pointer border-2 transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-200'
                    }`}
                    onClick={() => handleToneChange(tone.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{tone.name}</p>
                        <p className="text-xs text-gray-600">{tone.description}</p>
                      </div>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={isSelected}
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Frecuencia de Contenido</h3>
              <p className="text-gray-600">Define la periodicidad de tu contenido</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FREQUENCY_OPTIONS.map((frequency) => {
                const IconComponent = frequency.icon;
                const isSelected = preferences.frequency === frequency.id;
                return (
                  <div 
                    key={frequency.id} 
                    className={`bg-gray-50 p-4 rounded-lg cursor-pointer border-2 transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-200'
                    }`}
                    onClick={() => handleFrequencyChange(frequency.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{frequency.name}</p>
                        <p className="text-xs text-gray-600">{frequency.description}</p>
                      </div>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={isSelected}
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Audiencia Objetivo</h3>
              <p className="text-gray-600">Selecciona a quién va dirigido tu contenido</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TARGET_AUDIENCE.map((audience) => {
                const IconComponent = audience.icon;
                const isSelected = preferences.targetAudience.includes(audience.id);
                return (
                  <div 
                    key={audience.id} 
                    className={`bg-gray-50 p-4 rounded-lg cursor-pointer border-2 transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-200'
                    }`}
                    onClick={() => handleAudienceChange(audience.id, !isSelected)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{audience.name}</p>
                        <p className="text-xs text-gray-600">{audience.description}</p>
                      </div>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={isSelected}
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Sparkles className="h-6 w-6 text-blue-500" />
          <CardTitle className="text-2xl">Configura tus Preferencias</CardTitle>
        </div>
        <CardDescription>
          Personaliza tu experiencia para generar contenido que se adapte a tus necesidades
        </CardDescription>
        
        {/* Indicador de progreso */}
        <div className="flex items-center justify-center space-x-2 mt-4">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i + 1 <= currentStep 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Paso {currentStep} de {totalSteps}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {renderStepContent()}
        
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceedToNextStep() || isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Guardando...
              </>
            ) : currentStep === totalSteps ? (
              <>
                Completar Configuración
                <Sparkles className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Siguiente
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}