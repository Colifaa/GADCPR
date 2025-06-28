import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interfaz para los datos que vienen de n8n
export interface N8nData {
  id: string;
  status: string;
  generatedText: any;
  explanation?: any; // Ahora opcional
  sentimentScore: number;
  sentimentLabel: string;
  content?: any; // Nuevo campo opcional
  timestamp: Date;
}

interface N8nState {
  data: N8nData[];
  lastReceived: N8nData | null;
  addData: (data: Omit<N8nData, 'id' | 'timestamp'>) => void;
  clearData: () => void;
  getDataById: (id: string) => N8nData | undefined;
  getDataByStatus: (status: string) => N8nData[];
}

export const useN8nStore = create<N8nState>()(
  persist(
    (set, get) => ({
      data: [],
      lastReceived: null,

      addData: (newData) => {
        const dataWithMeta: N8nData = {
          ...newData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
        };

        set((state) => ({
          data: [dataWithMeta, ...state.data],
          lastReceived: dataWithMeta,
        }));

        console.log('✅ Datos de n8n guardados:', dataWithMeta);
      },

      clearData: () => {
        set({ data: [], lastReceived: null });
        console.log('🗑️ Datos de n8n eliminados');
      },

      getDataById: (id: string) => {
        return get().data.find(item => item.id === id);
      },

      getDataByStatus: (status: string) => {
        return get().data.filter(item => item.status === status);
      },
    }),
    {
      name: 'n8n-data-storage',
      partialize: (state) => ({
        data: state.data,
        lastReceived: state.lastReceived,
      }),
    }
  )
); 