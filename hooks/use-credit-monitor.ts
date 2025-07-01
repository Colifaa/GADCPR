import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useNotificationStore } from '@/store/notifications';

export const useCreditMonitor = () => {
  const { user } = useAuthStore();
  const { notifyCreditsLow } = useNotificationStore();

  useEffect(() => {
    if (!user) return;

    const checkCredits = () => {
      const credits = user.credits || 0;
      
      // Notificar si los créditos están bajos (menos de 10)
      // Solo notificar una vez cuando realmente se consuman créditos
      if (credits > 0 && credits <= 10) {
        // Verificar si ya se notificó para este nivel de créditos
        const lastNotificationLevel = localStorage.getItem('last-credit-notification');
        if (lastNotificationLevel !== credits.toString()) {
          notifyCreditsLow(credits);
          localStorage.setItem('last-credit-notification', credits.toString());
        }
      }
    };

    // Verificar créditos al montar el componente
    checkCredits();

    // DESHABILITADO: Verificación automática cada 30 segundos que causaba notificaciones duplicadas
    // Solo se verificará cuando se consuman créditos realmente
    /*
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(checkCredits, 30000);
      return () => clearInterval(interval);
    }
    */
  }, [user, notifyCreditsLow]);

  return null;
}; 