import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryEntry {
  id: string;
  title: string;
  podcastTitle: string;
  podcastAuthor: string;
  episodeTitle?: string;
  date: string;
  type: 'podcast';
  status: 'completed' | 'analyzing' | 'failed';
  analysisData?: {
    summary?: string;
    keyPoints?: string[];
    insights?: string[];
    duration?: string;
  };
  userId?: string; // Para futuro uso multi-usuario
}

interface HistoryState {
  entries: HistoryEntry[];
  isLoading: boolean;
  
  // Actions
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'date'>) => void;
  updateEntry: (id: string, updates: Partial<HistoryEntry>) => void;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
  getEntriesByUserId: (userId?: string) => HistoryEntry[];
  getEntryById: (id: string) => HistoryEntry | undefined;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [
        // Datos mockeados iniciales
        {
          id: '1',
          title: '¿Cómo Sabes si Tu Comunidad está Creciendo?',
          podcastTitle: 'Estrategias para el crecimiento de comunidades',
          podcastAuthor: 'María López',
          episodeTitle: 'Introducción a las estrategias de crecimiento',
          date: '2024-08-15',
          type: 'podcast',
          status: 'completed',
          analysisData: {
            summary: 'Análisis profundo sobre métricas de crecimiento comunitario y estrategias de engagement.',
            keyPoints: [
              'Métricas clave para medir el crecimiento',
              'Estrategias de retención de usuarios',
              'Técnicas de engagement orgánico'
            ],
            insights: [
              'El crecimiento sostenible requiere enfoque en calidad sobre cantidad',
              'La participación activa es más valiosa que el número de miembros'
            ],
            duration: '45:30'
          }
        },
        {
          id: '2',
          title: 'Crecimiento en Red',
          podcastTitle: 'Marketing Digital Avanzado',
          podcastAuthor: 'Roberto Silva',
          episodeTitle: 'SEO y posicionamiento web',
          date: '2024-08-15',
          type: 'podcast',
          status: 'completed',
          analysisData: {
            summary: 'Estrategias de marketing digital para el crecimiento exponencial en redes.',
            keyPoints: [
              'Optimización SEO avanzada',
              'Marketing de contenidos',
              'Análisis de competencia'
            ],
            insights: [
              'El SEO técnico es fundamental para el crecimiento',
              'El contenido de calidad genera autoridad'
            ],
            duration: '28:45'
          }
        },
        {
          id: '3',
          title: 'Estrategias para Conectar',
          podcastTitle: 'Branding y Posicionamiento',
          podcastAuthor: 'Ana Martínez',
          episodeTitle: 'Construcción de marca personal',
          date: '2024-08-15',
          type: 'podcast',
          status: 'completed',
          analysisData: {
            summary: 'Técnicas avanzadas para crear conexiones auténticas con tu audiencia.',
            keyPoints: [
              'Storytelling efectivo',
              'Construcción de marca personal',
              'Comunicación auténtica'
            ],
            insights: [
              'La autenticidad genera mayor conexión que la perfección',
              'Las historias personales crean vínculos emocionales'
            ],
            duration: '42:15'
          }
        },
        {
          id: '4',
          title: 'Más Allá del Like',
          podcastTitle: 'Inteligencia Artificial y el Futuro',
          podcastAuthor: 'Dr. Carlos Tech',
          episodeTitle: 'Machine Learning en la práctica',
          date: '2024-08-15',
          type: 'podcast',
          status: 'completed',
          analysisData: {
            summary: 'Análisis sobre el futuro de las interacciones digitales más allá de las métricas tradicionales.',
            keyPoints: [
              'Métricas de engagement profundo',
              'IA para personalización',
              'Futuro de las interacciones digitales'
            ],
            insights: [
              'Las métricas superficiales no reflejan el verdadero engagement',
              'La IA permite experiencias más personalizadas'
            ],
            duration: '52:15'
          }
        }
      ],
      isLoading: false,

      addEntry: (entryData) => {
        const newEntry: HistoryEntry = {
          ...entryData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        };

        set((state) => ({
          entries: [newEntry, ...state.entries] // Agregar al inicio para mostrar los más recientes primero
        }));
      },

      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map(entry =>
            entry.id === id ? { ...entry, ...updates } : entry
          )
        }));
      },

      removeEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter(entry => entry.id !== id)
        }));
      },

      clearHistory: () => {
        set({ entries: [] });
      },

      getEntriesByUserId: (userId) => {
        const { entries } = get();
        if (!userId) return entries; // Si no hay userId, devolver todas las entradas
        return entries.filter(entry => entry.userId === userId);
      },

      getEntryById: (id) => {
        const { entries } = get();
        return entries.find(entry => entry.id === id);
      },
    }),
    {
      name: 'history-storage', // Nombre para localStorage
    }
  )
); 