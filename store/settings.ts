import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  marketing: boolean;
  updates: boolean;
}

interface GenerationSettings {
  defaultTone: 'professional' | 'casual' | 'friendly' | 'authoritative';
  defaultLength: 'short' | 'medium' | 'long';
  autoSchedule: boolean;
  preferredTime: string;
}

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  generation: GenerationSettings;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  updateGeneration: (settings: Partial<GenerationSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      notifications: {
        email: true,
        push: true,
        marketing: false,
        updates: true
      },
      generation: {
        defaultTone: 'professional',
        defaultLength: 'medium',
        autoSchedule: false,
        preferredTime: '09:00'
      },
      
      setTheme: (theme) => set({ theme }),
      
      updateNotifications: (settings) =>
        set((state) => ({
          notifications: { ...state.notifications, ...settings }
        })),
      
      updateGeneration: (settings) =>
        set((state) => ({
          generation: { ...state.generation, ...settings }
        }))
    }),
    {
      name: 'settings-storage',
    }
  )
);