import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  createdAt: Date;
  userId?: string;
  actionUrl?: string;
  data?: any;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
  removeDuplicates: () => void;
  resetNotifications: () => void;
  
  // Notification triggers for specific events
  notifyContentGenerated: (contentType: string, title: string) => void;
  notifyAnalysisCompleted: (podcastTitle: string) => void;
  notifyProjectCreated: (projectTitle: string) => void;
  notifySystemUpdate: (version: string) => void;
  notifyPaymentProcessed: (amount: number, plan: string) => void;
  notifyAccountIssue: (issue: string) => void;
  notifySupportResponse: (ticketId: string) => void;
  notifyCreditsLow: (remaining: number) => void;
  notifySubscriptionExpiring: (daysLeft: number) => void;
  notifyNewFeature: (feature: string) => void;
}

// Función helper para formatear tiempo relativo
const getRelativeTime = (date: Date | string): string => {
  const now = new Date();
  
  // Asegurar que date sea un objeto Date válido
  let targetDate: Date;
  
  if (typeof date === 'string') {
    targetDate = new Date(date);
  } else if (date instanceof Date) {
    targetDate = date;
  } else {
    // Si no es una fecha válida, usar la fecha actual
    targetDate = now;
  }
  
  // Verificar si la fecha es válida
  if (isNaN(targetDate.getTime())) {
    return 'Ahora mismo';
  }
  
  const diffInMinutes = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Ahora mismo';
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  
  return targetDate.toLocaleDateString('es-ES');
};

// Función para generar ID único
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notificationData) => {
        // Verificar si ya existe una notificación similar reciente (última hora)
        const existingNotifications = get().notifications;
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        const isDuplicate = existingNotifications.some(n => {
          // Asegurar que createdAt sea un objeto Date
          const notificationDate = typeof n.createdAt === 'string' ? new Date(n.createdAt) : n.createdAt;
          
          return n.title === notificationData.title && 
                 n.message === notificationData.message &&
                 notificationDate > oneHourAgo;
        });
        
        if (isDuplicate) {
          console.log('🚫 Notificación duplicada ignorada:', notificationData.title);
          return;
        }

        const notification: Notification = {
          ...notificationData,
          id: generateId(),
          time: getRelativeTime(new Date()),
          read: false,
          createdAt: new Date()
        };

        set((state) => {
          const newNotifications = [notification, ...state.notifications];
          // Mantener solo las últimas 50 notificaciones
          const trimmedNotifications = newNotifications.slice(0, 50);
          
          return {
            notifications: trimmedNotifications,
            unreadCount: trimmedNotifications.filter(n => !n.read).length
          };
        });

        // Simular sonido de notificación (opcional)
        if (typeof window !== 'undefined' && 'Audio' in window) {
          try {
            const audio = new Audio('/audio/notification.mp3');
            audio.volume = 0.3;
            audio.play().catch(() => {
              // Ignorar errores de audio
            });
          } catch (error) {
            // Ignorar errores de audio
          }
        }

        // Simular notificación del navegador (si están habilitadas)
        if (typeof window !== 'undefined' && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/logo_scrito.svg',
              tag: notification.id
            });
          }
        }
      },

      markAsRead: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          );
          return {
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter(n => !n.read).length
          };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0
        }));
      },

      removeNotification: (id) => {
        set((state) => {
          const filteredNotifications = state.notifications.filter(n => n.id !== id);
          return {
            notifications: filteredNotifications,
            unreadCount: filteredNotifications.filter(n => !n.read).length
          };
        });
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length;
      },

      // Notification triggers específicos
      notifyContentGenerated: (contentType, title) => {
        const { addNotification } = get();
        const contentTypeNames: Record<string, string> = {
          'texto': 'Texto',
          'imagenes': 'Carousel de Imágenes',
          'videos': 'Video',
          'gif': 'GIF Animado',
          'infografias': 'Infografía',
          'presentaciones': 'Presentación'
        };

        addNotification({
          type: 'success',
          title: 'Contenido generado exitosamente',
          message: `Tu ${contentTypeNames[contentType] || contentType} "${title}" ha sido creado con IA y está listo para usar.`,
          actionUrl: '/generated-content/social'
        });
      },

      notifyAnalysisCompleted: (podcastTitle) => {
        const { addNotification } = get();
        addNotification({
          type: 'success',
          title: 'Análisis de podcast completado',
          message: `El análisis del podcast "${podcastTitle}" ha finalizado. Ya puedes ver los insights y generar contenido.`,
          actionUrl: '/historial'
        });
      },

      notifyProjectCreated: (projectTitle) => {
        const { addNotification } = get();
        addNotification({
          type: 'info',
          title: 'Nuevo proyecto creado',
          message: `El proyecto "${projectTitle}" ha sido creado y agregado a tu lista de proyectos.`,
          actionUrl: '/proyectos'
        });
      },

      notifySystemUpdate: (version) => {
        const { addNotification } = get();
        addNotification({
          type: 'info',
          title: 'Sistema actualizado',
          message: `Scrito se ha actualizado a la versión ${version}. Nuevas funcionalidades disponibles.`,
          actionUrl: '/dashboard'
        });
      },

      notifyPaymentProcessed: (amount, plan) => {
        const { addNotification } = get();
        addNotification({
          type: 'success',
          title: 'Pago procesado correctamente',
          message: `Tu pago de €${amount.toFixed(2)} para el plan ${plan} ha sido procesado exitosamente.`,
          actionUrl: '/billing'
        });
      },

      notifyAccountIssue: (issue) => {
        const { addNotification } = get();
        addNotification({
          type: 'warning',
          title: 'Atención requerida en tu cuenta',
          message: issue,
          actionUrl: '/settings'
        });
      },

      notifySupportResponse: (ticketId) => {
        const { addNotification } = get();
        addNotification({
          type: 'info',
          title: 'Respuesta de soporte técnico',
          message: `Hemos respondido a tu solicitud de soporte #${ticketId}. Revisa la respuesta en tu panel.`,
          data: { ticketId }
        });
      },

      notifyCreditsLow: (remaining) => {
        const { addNotification } = get();
        addNotification({
          type: 'warning',
          title: 'Créditos bajos',
          message: `Te quedan ${remaining} créditos. Considera comprar más para continuar generando contenido.`,
          actionUrl: '/billing'
        });
      },

      notifySubscriptionExpiring: (daysLeft) => {
        const { addNotification } = get();
        addNotification({
          type: 'warning',
          title: 'Suscripción por vencer',
          message: `Tu suscripción vence en ${daysLeft} día${daysLeft > 1 ? 's' : ''}. Renueva para continuar con todas las funcionalidades.`,
          actionUrl: '/billing'
        });
      },

      notifyNewFeature: (feature) => {
        const { addNotification } = get();
        addNotification({
          type: 'info',
          title: 'Nueva funcionalidad disponible',
          message: `¡Descubre la nueva función: ${feature}! Ya está disponible en tu dashboard.`,
          actionUrl: '/dashboard'
        });
      },

      removeDuplicates: () => {
        set((state) => {
          // Agrupar notificaciones por título y mensaje
          const uniqueNotifications = state.notifications.reduce((acc, current) => {
            const key = `${current.title}-${current.message}`;
            const existing = acc.find(item => `${item.title}-${item.message}` === key);
            
            if (!existing) {
              acc.push(current);
            } else {
              // Mantener la más reciente
              const currentDate = typeof current.createdAt === 'string' ? new Date(current.createdAt) : current.createdAt;
              const existingDate = typeof existing.createdAt === 'string' ? new Date(existing.createdAt) : existing.createdAt;
              
              if (currentDate > existingDate) {
                const index = acc.findIndex(item => `${item.title}-${item.message}` === key);
                acc[index] = current;
              }
            }
            
            return acc;
          }, [] as Notification[]);
          
          console.log(`🧹 Limpieza de notificaciones: ${state.notifications.length} → ${uniqueNotifications.length}`);
          
          return {
            notifications: uniqueNotifications,
            unreadCount: uniqueNotifications.filter(n => !n.read).length
          };
        });
      },

      resetNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
        // También limpiar el localStorage
        localStorage.removeItem('notifications-storage');
        console.log('🧹 Notificaciones completamente reiniciadas');
      }
    }),
    {
      name: 'notifications-storage',
      // Solo persistir las notificaciones, no las funciones
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount
      }),
      // Configurar la hidratación para convertir strings a fechas
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convertir strings de fecha a objetos Date
          state.notifications = state.notifications.map(notification => ({
            ...notification,
            createdAt: typeof notification.createdAt === 'string' 
              ? new Date(notification.createdAt) 
              : notification.createdAt,
            time: getRelativeTime(notification.createdAt)
          }));
          
          // Recalcular el contador de no leídas
          state.unreadCount = state.notifications.filter(n => !n.read).length;
        }
      }
    }
  )
);

// Hook para simular websocket y actualizar tiempos relativos
export const useNotificationWebSocket = () => {
  const { notifications } = useNotificationStore();

  // Actualizar tiempos relativos cada minuto
  React.useEffect(() => {
    const interval = setInterval(() => {
      useNotificationStore.setState((state) => ({
        notifications: state.notifications.map(n => ({
          ...n,
          time: getRelativeTime(n.createdAt)
        }))
      }));
    }, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, []);

  // DESHABILITADO: Notificaciones automáticas del sistema que causaban duplicaciones
  // Solo se generarán notificaciones cuando el usuario realice acciones específicas
  /*
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const systemNotifications = [
        () => useNotificationStore.getState().notifySystemUpdate('2.1.3'),
        () => useNotificationStore.getState().notifyNewFeature('Música de fondo para videos'),
        () => useNotificationStore.getState().notifyAccountIssue('Actualiza tu información de perfil para mejorar las recomendaciones.')
      ];

      // Enviar una notificación aleatoria cada 2-5 minutos
      const randomInterval = () => {
        const delay = Math.random() * (300000 - 120000) + 120000; // 2-5 minutos
        setTimeout(() => {
          const randomNotification = systemNotifications[Math.floor(Math.random() * systemNotifications.length)];
          randomNotification();
          randomInterval(); // Programar la siguiente
        }, delay);
      };

      // Iniciar después de 30 segundos
      setTimeout(randomInterval, 30000);
    }
  }, []);
  */

  return { notifications };
};

// Importar React para useEffect
import React from 'react';

// Función para limpiar notificaciones duplicadas al inicializar
if (typeof window !== 'undefined') {
  // Ejecutar limpieza al cargar la página
  setTimeout(() => {
    const store = useNotificationStore.getState();
    if (store.notifications.length > 0) {
      console.log('🧹 Limpiando notificaciones duplicadas al iniciar...');
      
      // Primero limpiar notificaciones con fechas inválidas
      store.notifications = store.notifications.filter(n => {
        const date = typeof n.createdAt === 'string' ? new Date(n.createdAt) : n.createdAt;
        return !isNaN(date.getTime());
      });
      
      // Luego remover duplicados
      store.removeDuplicates();
    }
  }, 1000);
} 