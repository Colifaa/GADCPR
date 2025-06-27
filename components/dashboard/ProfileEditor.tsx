'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { Camera, Edit2, Eye, EyeOff, Headphones, ChevronDown, ChevronUp, Calendar, CreditCard, Globe, Crown, Heart, Settings } from 'lucide-react';

interface ProfileData {
  name: string;
  nickname: string;
  email: string;
  avatar: string;
  phone: string;
  document: string;
  country: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ProfileEditor() {
  const { user, updateProfile, changePassword, updateSubscription } = useAuthStore();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    nickname: user?.nickname || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    phone: user?.phone || '',
    document: user?.document || '',
    country: user?.country || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string>(user?.avatar || '');
  const [showInterests, setShowInterests] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userPassword, setUserPassword] = useState<string>('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConstructionModal, setShowConstructionModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Datos de FAQ
  const faqData = [
    {
      id: 1,
      question: "¿Puedo acceder a la plataforma desde dispositivos móviles?",
      answer: "Sí, nuestra plataforma es completamente compatible con dispositivos móviles. Puedes acceder a ella desde cualquier smartphone o tablet a través de tu navegador."
    },
    {
      id: 2,
      question: "¿Existen tarifas o costos ocultos?",
      answer: "No, en nuestra plataforma no existen tarifas o costos ocultos. Nos esforzamos por ser transparentes en nuestra estructura de precios. Al registrarte, podrás ver claramente todos los costos asociados a cada plan, incluidos los servicios que se ofrecen."
    },
    {
      id: 3,
      question: "¿Cómo puedo eliminar mi cuenta?",
      answer: "Para eliminar tu cuenta en nuestra plataforma, debes solo es necesario enviar tu mediante una solicitud."
    },
    {
      id: 4,
      question: "Olvidé mi contraseña, ¿Qué debo hacer?",
      answer: "Para cambiar tu contraseña en nuestra plataforma, debes de realizarlo al iniciar la sesión."
    }
  ];

  // Función para manejar la expansión de FAQ
  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  // Funciones para manejar los modales de pago
  const handlePaymentClick = () => {
    setShowPaymentModal(true);
  };

  const handleProceedPayment = async () => {
    setShowPaymentModal(false);
    
    // Simular procesamiento de pago y actualizar suscripción
    // En este caso, asumimos que están comprando la versión de equipo
    const success = await updateSubscription('equipo');
    if (success) {
      sonnerToast.success('¡Pago procesado! Suscripción actualizada a Versión de Equipo');
    }
    
    setShowConstructionModal(true);
  };

  const handleVersionClick = () => {
    setShowVersionModal(true);
  };

  const handleRegressClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmRegress = async () => {
    const success = await updateSubscription('gratuita');
    if (success) {
      sonnerToast.success('Suscripción cambiada a gratuita exitosamente');
      setShowConfirmModal(false);
      setShowVersionModal(false);
    } else {
      sonnerToast.error('Error al cambiar la suscripción');
    }
  };

  const handleAcquireTeam = () => {
    setShowVersionModal(false);
    setShowPaymentModal(true);
  };

  // Función para obtener la contraseña del usuario desde localStorage
  const getUserPassword = () => {
    try {
      const users = JSON.parse(localStorage.getItem('users-db') || '[]');
      const currentUser = users.find((u: any) => u.id === user?.id);
      return currentUser?.password || '';
    } catch (error) {
      console.error('Error al obtener contraseña:', error);
      return '';
    }
  };

  // Efecto para actualizar los datos cuando el usuario cambie
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        nickname: user.nickname || '',
        email: user.email || '',
        avatar: user.avatar || '',
        phone: user.phone || '',
        document: user.document || '',
        country: user.country || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setProfileImagePreview(user.avatar || '');
      setUserPassword(getUserPassword());
    }
  }, [user]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Por favor selecciona un archivo de imagen válido.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "La imagen debe ser menor a 5MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImagePreview(result);
        handleInputChange('avatar', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    if (!profileData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre es obligatorio.",
        variant: "destructive",
      });
      return false;
    }

    if (!profileData.email.trim()) {
      toast({
        title: "Error",
        description: "El correo electrónico es obligatorio.",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un correo electrónico válido.",
        variant: "destructive",
      });
      return false;
    }

    

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const profileUpdateSuccess = await updateProfile({
        name: profileData.name,
        nickname: profileData.nickname,
        email: profileData.email,
        avatar: profileData.avatar,
        phone: profileData.phone,
        document: profileData.document,
        country: profileData.country,
      });

      if (!profileUpdateSuccess) {
        throw new Error('Error al actualizar el perfil');
      }

      sonnerToast.success("¡Perfil actualizado!", {
        description: "Tu información personal ha sido actualizada correctamente.",
      });
      
    } catch (error) {
      sonnerToast.error("Error al actualizar", {
        description: error instanceof Error ? error.message : "Hubo un problema al actualizar tu perfil. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
        {/* Sidebar con Avatar y Info */}
        <div className="w-full lg:w-72 bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-center">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={profileImagePreview} alt="Foto de perfil" />
                <AvatarFallback className="text-xl">
                  {getInitials(profileData.name || 'Usuario')}
                </AvatarFallback>
              </Avatar>
                             <div className="absolute -bottom-2 -right-2">
                 <Label htmlFor="profile-image" className="cursor-pointer">
                   <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                     <Camera className="w-4 h-4" />
                   </div>
                 </Label>
                 <input
                   id="profile-image"
                   type="file"
                   accept="image/*"
                   onChange={handleImageUpload}
                   className="hidden"
                 />
               </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-4">
              {profileData.name || 'Usuario'}
            </h2>
            <p className="text-gray-600">Administrador</p>
          </div>

          <div className="mt-8 space-y-4">
            <div 
              className={`border-l-4 pl-4 cursor-pointer transition-colors ${
                showInterests ? 'border-blue-600' : 'border-gray-300 hover:border-blue-400'
              }`}
              onClick={() => {
                setShowInterests(!showInterests);
                setShowPreferences(false);
              }}
            >
              <h3 className={`font-medium ${showInterests ? 'text-gray-900' : 'text-gray-700'}`}>
                Intereses
              </h3>
              <p className="text-sm text-gray-600">Temas de interés</p>
            </div>
            
            <div 
              className={`pl-4 cursor-pointer transition-colors ${
                showPreferences ? 'border-l-4 border-blue-600' : 'hover:border-l-4 hover:border-blue-400'
              }`}
              onClick={() => {
                setShowPreferences(!showPreferences);
                setShowInterests(false);
              }}
            >
              <h3 className={`font-medium ${showPreferences ? 'text-gray-900' : 'text-gray-500'}`}>
                Preferencias
              </h3>
              <p className="text-sm text-gray-500">Configuración de contenido</p>
            </div>

            {/* Mostrar Intereses */}
            {showInterests && user?.preferences?.interestTopics && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Tus Temas de Interés:</h4>
                <div className="flex flex-wrap gap-2">
                  {user.preferences.interestTopics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs border border-blue-300 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Mostrar Preferencias */}
            {showPreferences && user?.preferences && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3">Tus Preferencias:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Formato de Contenido */}
                  {user.preferences.contentFormat && user.preferences.contentFormat.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-blue-800 mb-1">Formato:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.preferences.contentFormat.map((format, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs rounded border border-blue-300"
                          >
                            {format}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tono */}
                  {user.preferences.tone && (
                    <div>
                      <p className="text-xs font-medium text-blue-800 mb-1">Tono:</p>
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs rounded border border-blue-300">
                        {user.preferences.tone}
                      </span>
                    </div>
                  )}

                  {/* Frecuencia */}
                  {user.preferences.frequency && (
                    <div>
                      <p className="text-xs font-medium text-blue-800 mb-1">Frecuencia:</p>
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs rounded border border-blue-300">
                        {user.preferences.frequency}
                      </span>
                    </div>
                  )}

                  {/* Audiencia Objetivo */}
                  {user.preferences.targetAudience && user.preferences.targetAudience.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-blue-800 mb-1">Audiencia:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.preferences.targetAudience.map((audience, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs rounded border border-blue-300"
                          >
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mensaje si no hay preferencias */}
            {(showInterests || showPreferences) && !user?.preferences && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  No has completado tu configuración de preferencias aún. 
                  <br />
                  <span className="font-medium">¡Completa tu onboarding para personalizar tu experiencia!</span>
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Contenido Principal con Pestañas */}
        <div className="flex-1">
          <Tabs defaultValue="datos" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="datos" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Datos
              </TabsTrigger>
              <TabsTrigger 
                value="servicio" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Servicio Técnico
              </TabsTrigger>
              <TabsTrigger 
                value="suscripciones" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Suscripciones
              </TabsTrigger>
            </TabsList>

            <TabsContent value="datos" className="mt-6">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Nombres */}
                                          <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Nombres
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={profileData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>

                    {/* Apellido */}
                    <div className="space-y-2">
                      <Label htmlFor="nickname" className="text-sm font-medium text-gray-700">
                        Apellido
                      </Label>
                                              <Input
                          id="nickname"
                          type="text"
                          value={profileData.nickname}
                          onChange={(e) => handleInputChange('nickname', e.target.value)}
                          className="bg-gray-50 border-gray-200"
                        />
                    </div>

                    {/* Usuario */}
                    <div className="space-y-2">
                      <Label htmlFor="user" className="text-sm font-medium text-gray-700">
                        Usuario
                      </Label>
                      <Input
                        id="user"
                        type="text"
                        value={profileData.nickname}
                        className="bg-gray-50 border-gray-200"
                        readOnly
                      />
                    </div>

                    {/* Correo */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Correo
                      </Label>
                                              <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="bg-gray-50 border-gray-200"
                        />
                    </div>

                    {/* Número de teléfono */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Número de teléfono
                      </Label>
                                              <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="bg-gray-50 border-gray-200"
                        />
                    </div>

                    {/* País */}
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                        País
                      </Label>
                                              <Input
                          id="country"
                          type="text"
                          value={profileData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="bg-gray-50 border-gray-200"
                        />
                    </div>

                    {/* Documento de Identificación */}
                    <div className="space-y-2">
                      <Label htmlFor="document" className="text-sm font-medium text-gray-700">
                        Documento de Identificación
                      </Label>
                      <Input
                        id="document"
                        type="text"
                        value={profileData.document}
                        onChange={(e) => handleInputChange('document', e.target.value)}
                        className="bg-gray-50 border-gray-200"
                      />
                    </div>

                    {/* Contraseña */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Contraseña
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={showPassword ? userPassword : "••••••••••"}
                          className="bg-gray-50 border-gray-200"
                          readOnly
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>



                    {/* Botón Actualizar */}
                    <div className="md:col-span-2 flex justify-start">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 px-8"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Actualizando...
                          </>
                        ) : (
                          'Actualizar'
                        )}
                      </Button>
                    </div>
                  </div>


                </form>
              </div>
            </TabsContent>

            <TabsContent value="servicio" className="mt-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                {/* Header con icono */}
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Headphones className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Preguntas frecuentes</h3>
                    <p className="text-gray-600 text-sm">Encuentra respuestas a las dudas más comunes</p>
                  </div>
                </div>

                {/* Lista de FAQ */}
                <div className="space-y-4">
                  {faqData.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <span className="w-6 h-6 bg-blue-600 text-white text-sm font-medium rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            {faq.id}
                          </span>
                          <h4 className="font-medium text-gray-900 text-sm">{faq.question}</h4>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {expandedFAQ === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <div className="px-6 py-4 bg-white border-t border-gray-200">
                          <p className="text-gray-600 text-sm leading-relaxed pl-10">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>



            <TabsContent value="suscripciones" className="mt-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Columna izquierda - Método de pago y Versión paga */}
                  <div className="space-y-6">
                    {/* Método de pago */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Método de pago</h3>
                          <p className="text-sm text-gray-600">Realiza tu pago ahora por tan solo 0.00$</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-center">
                          <Button 
                            onClick={handlePaymentClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg text-sm font-medium"
                          >
                            Pagar
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Versión paga */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Crown className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Versión paga</h3>
                          <p className="text-sm text-gray-600">Accede a todas las funcionalidades premium</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-center">
                          <Button 
                            onClick={handleVersionClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
                          >
                            Ver más
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Columna derecha - Fecha de pago (Calendario) */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Fecha de pago</h3>
                      </div>
                    </div>
                    
                    {/* Calendario */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-center">
                        <div className="flex items-center justify-between mb-4">
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="w-4 h-4 rotate-90" />
                          </Button>
                          <h4 className="font-medium text-gray-900">Septiembre 2021</h4>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="w-4 h-4 -rotate-90" />
                          </Button>
                        </div>
                        
                        {/* Días de la semana */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                            <div key={index} className="text-xs font-medium text-gray-500 p-2 text-center">
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        {/* Días del mes */}
                        <div className="grid grid-cols-7 gap-1">
                          {/* Días vacíos del mes anterior */}
                          {[29, 30, 31].map((day) => (
                            <div key={`prev-${day}`} className="text-xs text-gray-300 p-2 text-center">
                              {day}
                            </div>
                          ))}
                          
                          {/* Días del mes actual */}
                          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                            <div 
                              key={day} 
                              className={`text-xs p-2 text-center cursor-pointer hover:bg-blue-100 rounded ${
                                day === 20 ? 'bg-blue-600 text-white rounded-full' : 'text-gray-700'
                              }`}
                            >
                              {day}
                            </div>
                          ))}
                          
                          {/* Días del mes siguiente */}
                          {[1, 2, 3, 4].map((day) => (
                            <div key={`next-${day}`} className="text-xs text-gray-300 p-2 text-center">
                              {day}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modal de Resumen de Pago */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">Resumen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Lista de ítems */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">Plan Premium Mensual</span>
                  <span className="text-xs text-gray-500">Acceso completo a todas las funciones</span>
                </div>
                <span className="text-sm font-medium text-gray-900">$29.99</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">Generación de Contenido IA</span>
                  <span className="text-xs text-gray-500">500 generaciones adicionales</span>
                </div>
                <span className="text-sm font-medium text-gray-900">$12.99</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">Análisis Avanzado</span>
                  <span className="text-xs text-gray-500">Reportes detallados y métricas</span>
                </div>
                <span className="text-sm font-medium text-gray-900">$8.99</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">Procesamiento y Envío</span>
                  <span className="text-xs text-gray-500">Activación inmediata</span>
                </div>
                <span className="text-sm font-medium text-gray-900">$2.99</span>
              </div>
            </div>

            {/* Subtotal y descuentos */}
            <div className="space-y-2 py-2 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm text-gray-900">$54.96</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Descuento (10%)</span>
                <span className="text-sm text-green-600">-$5.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Impuestos</span>
                <span className="text-sm text-gray-900">$4.95</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-3 border-t-2 border-gray-200">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-blue-600">$54.41</span>
            </div>

            {/* Botón proceder */}
            <Button 
              onClick={handleProceedPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
            >
              Proceder con el pago
            </Button>
          </div>
        </DialogContent>
      </Dialog>

             {/* Modal de Construcción */}
       <Dialog open={showConstructionModal} onOpenChange={setShowConstructionModal}>
         <DialogContent className="sm:max-w-md">
           <DialogHeader>
             <DialogTitle className="text-lg font-semibold text-gray-900 text-center">
               Pasarela de Pagos
             </DialogTitle>
           </DialogHeader>
           <div className="text-center space-y-4">
             <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
               <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
               </svg>
             </div>
             <div>
               <h3 className="text-lg font-medium text-gray-900 mb-2">
                 En Construcción
               </h3>
               <p className="text-sm text-gray-600">
                 La pasarela de pagos se encuentra actualmente en construcción. 
                 Pronto estará disponible para procesar tus pagos de forma segura.
               </p>
             </div>
             <Button 
               onClick={() => setShowConstructionModal(false)}
               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
             >
               Entendido
             </Button>
           </div>
         </DialogContent>
       </Dialog>

       {/* Modal de Versiones */}
       <Dialog open={showVersionModal} onOpenChange={setShowVersionModal}>
         <DialogContent className="sm:max-w-md">
           <div className="space-y-6">
             {/* Versión gratuita */}
             <div className="bg-gray-50 rounded-lg p-4 space-y-3">
               <div>
                 <h3 className="text-lg font-semibold text-gray-900">Versión gratuita</h3>
                 <p className="text-sm text-gray-600">Pagos mensuales</p>
               </div>
               {user?.subscription === 'gratuita' ? (
                 <div className="text-sm text-blue-600 font-medium">
                   Suscripción actual
                 </div>
               ) : (
                 <Button 
                   onClick={handleRegressClick}
                   variant="outline" 
                   className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 px-6 py-2"
                 >
                   Regresar
                 </Button>
               )}
             </div>

             {/* Versión paga */}
             <div className="bg-gray-50 rounded-lg p-4 space-y-3">
               <div>
                 <h3 className="text-lg font-semibold text-gray-900">Versión paga</h3>
                 <p className="text-sm text-gray-600">Pagos mensuales</p>
               </div>
               {user?.subscription === 'paga' ? (
                 <div className="text-sm text-blue-600 font-medium">
                   Suscripción actual
                 </div>
               ) : (
                 <Button 
                   onClick={() => {
                     setShowVersionModal(false);
                     setShowPaymentModal(true);
                   }}
                   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                 >
                   Adquirir
                 </Button>
               )}
             </div>

             {/* Versión de Equipo */}
             <div className="bg-gray-50 rounded-lg p-4 space-y-3">
               <div>
                 <h3 className="text-lg font-semibold text-gray-900">Versión de Equipo</h3>
                 <p className="text-sm text-gray-600">Pagos mensuales</p>
                 <p className="text-xs text-gray-500">Mínimo 3 personas</p>
               </div>
               {user?.subscription === 'equipo' ? (
                 <div className="text-sm text-blue-600 font-medium">
                   Suscripción actual
                 </div>
               ) : (
                 <Button 
                   onClick={handleAcquireTeam}
                   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                 >
                   Adquirir
                 </Button>
               )}
             </div>
           </div>
         </DialogContent>
       </Dialog>

       {/* Modal de Confirmación */}
       <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
         <DialogContent className="sm:max-w-md">
           <DialogHeader>
             <DialogTitle className="text-lg font-semibold text-gray-900 text-center">
               Confirmar cambio de suscripción
             </DialogTitle>
           </DialogHeader>
           <div className="text-center space-y-4">
             <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
               <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
               </svg>
             </div>
             <div>
               <h3 className="text-lg font-medium text-gray-900 mb-2">
                 ¿Estás seguro?
               </h3>
               <p className="text-sm text-gray-600">
                 Vas a cambiar tu suscripción actual a la versión gratuita. 
                 Esto podría limitar algunas funcionalidades premium que tienes actualmente.
               </p>
             </div>
             <div className="flex space-x-3">
               <Button 
                 onClick={() => setShowConfirmModal(false)}
                 variant="outline"
                 className="flex-1"
               >
                 Cancelar
               </Button>
               <Button 
                 onClick={handleConfirmRegress}
                 className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
               >
                 Confirmar
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
    </div>
  );
} 