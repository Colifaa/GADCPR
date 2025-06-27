'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    id: 'marketing-digital',
    name: 'Marketing Digital y Estrategias de Contenido',
    description: 'Tendencias, tácticas y mejores prácticas para promocionar marcas y servicios',
    icon: TrendingUp
  },
  {
    id: 'tecnologia-innovacion',
    name: 'Tecnología e Innovación',
    description: 'Nuevas tecnologías, herramientas y soluciones de IA para contenido',
    icon: Cpu
  },
  {
    id: 'podcasts-audio',
    name: 'Podcasts y Audio Digital',
    description: 'Producción, monetización, análisis y tendencias en podcasts',
    icon: Headphones
  },
  {
    id: 'redes-sociales',
    name: 'Redes Sociales y Community Management',
    description: 'Estrategias para aumentar engagement en Instagram, Facebook, TikTok, etc.',
    icon: Users
  },
  {
    id: 'analisis-datos',
    name: 'Análisis de Datos y Métricas',
    description: 'Interpretación de datos de interacción, tendencias y audiencia',
    icon: BarChart
  },
  {
    id: 'empresas-negocios',
    name: 'Empresas y Negocios',
    description: 'Contenido automatizado para objetivos empresariales y comunicación',
    icon: Building
  },
  {
    id: 'educacion-capacitacion',
    name: 'Educación y Capacitación en Marketing',
    description: 'Temas educativos sobre marketing digital y creación de contenido',
    icon: GraduationCap
  },
  {
    id: 'campanas-sociales',
    name: 'Campañas Sociales y Sin Fines de Lucro',
    description: 'Contenido para campañas sociales y mensajes solidarios',
    icon: Heart
  }
];

// Formatos de contenido disponibles
const CONTENT_FORMATS = [
  {
    id: 'texto',
    name: 'Texto',
    description: 'Artículos, guiones, posts',
    icon: FileText
  },
  {
    id: 'audio',
    name: 'Audio',
    description: 'Podcasts, clips cortos',
    icon: Mic
  },
  {
    id: 'video',
    name: 'Video',
    description: 'Guiones y contenido audiovisual',
    icon: Video
  },
  {
    id: 'imagenes',
    name: 'Imágenes',
    description: 'Contenido visual y gráfico',
    icon: Image
  }
];

// Opciones de tono
const TONE_OPTIONS = [
  { id: 'formal', name: 'Formal', description: 'Profesional y serio' },
  { id: 'informal', name: 'Informal', description: 'Casual y cercano' },
  { id: 'educativo', name: 'Educativo', description: 'Informativo y didáctico' },
  { id: 'promocional', name: 'Promocional', description: 'Persuasivo y comercial' },
  { id: 'inspirador', name: 'Inspirador', description: 'Motivacional y positivo' }
];

// Opciones de frecuencia
const FREQUENCY_OPTIONS = [
  { id: 'diario', name: 'Diario', description: 'Contenido todos los días' },
  { id: 'semanal', name: 'Semanal', description: 'Contenido cada semana' },
  { id: 'mensual', name: 'Mensual', description: 'Contenido cada mes' },
  { id: 'personalizado', name: 'Personalizado', description: 'Según mi estrategia' }
];

// Audiencia objetivo
const TARGET_AUDIENCE = [
  { id: 'profesionales', name: 'Profesionales', description: 'Ejecutivos y empresarios' },
  { id: 'jovenes', name: 'Jóvenes', description: '18-30 años' },
  { id: 'estudiantes', name: 'Estudiantes', description: 'Universitarios y académicos' },
  { id: 'publico-general', name: 'Público General', description: 'Audiencia amplia' },
  { id: 'empresas', name: 'Empresas', description: 'B2B y corporativo' }
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
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">¿Qué temas te interesan?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Selecciona los temas sobre los que te gustaría generar contenido
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INTEREST_TOPICS.map((topic) => {
                const IconComponent = topic.icon;
                return (
                  <div key={topic.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Checkbox
                      id={topic.id}
                      checked={preferences.interestTopics.includes(topic.id)}
                      onCheckedChange={(checked) => handleTopicChange(topic.id, checked as boolean)}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-blue-500" />
                        <Label htmlFor={topic.id} className="font-medium cursor-pointer">
                          {topic.name}
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">¿Qué formatos prefieres?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Selecciona los tipos de contenido que quieres crear
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CONTENT_FORMATS.map((format) => {
                const IconComponent = format.icon;
                return (
                  <div key={format.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Checkbox
                      id={format.id}
                      checked={preferences.contentFormat.includes(format.id)}
                      onCheckedChange={(checked) => handleFormatChange(format.id, checked as boolean)}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-purple-500" />
                        <Label htmlFor={format.id} className="font-medium cursor-pointer">
                          {format.name}
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">¿Qué tono prefieres?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Selecciona el estilo de comunicación para tu contenido
              </p>
            </div>
            <RadioGroup
              value={preferences.tone}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, tone: value }))}
              className="space-y-3"
            >
              {TONE_OPTIONS.map((tone) => (
                <div key={tone.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <RadioGroupItem value={tone.id} id={tone.id} />
                  <div className="flex-1">
                    <Label htmlFor={tone.id} className="font-medium cursor-pointer">
                      {tone.name}
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tone.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">¿Con qué frecuencia?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Define la periodicidad de tu contenido
              </p>
            </div>
            <RadioGroup
              value={preferences.frequency}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, frequency: value }))}
              className="space-y-3"
            >
              {FREQUENCY_OPTIONS.map((frequency) => (
                <div key={frequency.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <RadioGroupItem value={frequency.id} id={frequency.id} />
                  <div className="flex-1">
                    <Label htmlFor={frequency.id} className="font-medium cursor-pointer">
                      {frequency.name}
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {frequency.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">¿Cuál es tu audiencia?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Selecciona a quién va dirigido tu contenido
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TARGET_AUDIENCE.map((audience) => (
                <div key={audience.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Checkbox
                    id={audience.id}
                    checked={preferences.targetAudience.includes(audience.id)}
                    onCheckedChange={(checked) => handleAudienceChange(audience.id, checked as boolean)}
                  />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor={audience.id} className="font-medium cursor-pointer">
                      {audience.name}
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {audience.description}
                    </p>
                  </div>
                </div>
              ))}
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