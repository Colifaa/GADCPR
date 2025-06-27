'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { PreferencesSetup, UserPreferences } from '@/components/auth/PreferencesSetup';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUserPreferences, completeOnboarding } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Si el usuario no está autenticado, redirigir al login
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Si el usuario ya completó el onboarding, redirigir al dashboard
    if (user.hasCompletedOnboarding) {
      router.push('/dashboard');
      return;
    }
  }, [user, router]);

  const handlePreferencesComplete = async (preferences: UserPreferences) => {
    setIsLoading(true);
    
    try {
      // Guardar las preferencias del usuario
      const preferencesSuccess = await updateUserPreferences(preferences);
      
      if (!preferencesSuccess) {
        throw new Error('Error al guardar las preferencias');
      }

      // Marcar el onboarding como completado
      const onboardingSuccess = await completeOnboarding();
      
      if (!onboardingSuccess) {
        throw new Error('Error al completar el onboarding');
      }

      toast({
        title: "¡Configuración completada!",
        description: "Tus preferencias han sido guardadas exitosamente.",
      });

      // Redirigir al dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Error en onboarding:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar tu configuración. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipOnboarding = async () => {
    setIsLoading(true);
    
    try {
      // Marcar el onboarding como completado sin preferencias
      const success = await completeOnboarding();
      
      if (success) {
        toast({
          title: "Onboarding completado",
          description: "Puedes configurar tus preferencias más tarde en la configuración.",
        });
        router.push('/dashboard');
      } else {
        throw new Error('Error al completar el onboarding');
      }
    } catch (error) {
      console.error('Error al saltar onboarding:', error);
      toast({
        title: "Error",
        description: "Hubo un problema. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {showWelcome ? (
          <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-2xl">
              <CardHeader className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ¡Bienvenido/a, {user.name}!
                  </CardTitle>
                </div>
                <CardDescription className="text-lg">
                  Estás a punto de descubrir el poder de la creación de contenido automatizada con IA.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-center">
                    ¿Qué puedes hacer con ContentAI?
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        📝 Contenido para Redes Sociales
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Genera posts atractivos para Instagram, Facebook, TikTok y más
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h4 className="font-medium text-purple-900 dark:text-purple-100">
                        🎙️ Guiones de Podcast
                      </h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                        Crea guiones estructurados para tus episodios de podcast
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-medium text-green-900 dark:text-green-100">
                        📊 Análisis de Tendencias
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Obtén insights sobre tu audiencia y el rendimiento de tu contenido
                      </p>
                    </div>
                    
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <h4 className="font-medium text-orange-900 dark:text-orange-100">
                        🎯 Contenido Personalizado
                      </h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        Adapta el tono y estilo según tu audiencia y objetivos
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Para comenzar, nos gustaría conocer tus preferencias para personalizar tu experiencia.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={() => setShowWelcome(false)}
                      size="lg"
                      className="px-8"
                    >
                      Configurar Preferencias
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleSkipOnboarding}
                      disabled={isLoading}
                      size="lg"
                      className="px-8"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          Omitiendo...
                        </>
                      ) : (
                        'Omitir por ahora'
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Puedes configurar tus preferencias más tarde en la configuración
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <PreferencesSetup 
              onComplete={handlePreferencesComplete}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
} 