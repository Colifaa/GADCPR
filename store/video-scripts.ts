import { create } from 'zustand';

export interface VideoScript {
  id: string;
  title: string;
  content: string;
  tone: string;
  style: string;
  focus: string;
  duration: string;
  createdAt: Date;
  thumbnail?: string;
  status: 'draft' | 'completed' | 'published';
}

interface VideoScriptsState {
  scripts: VideoScript[];
  isGenerating: boolean;
  addScript: (script: Omit<VideoScript, 'id' | 'createdAt'>) => void;
  updateScript: (id: string, updates: Partial<VideoScript>) => void;
  deleteScript: (id: string) => void;
  setGenerating: (isGenerating: boolean) => void;
}

// Datos mockeados iniciales
const mockScripts: VideoScript[] = [
  {
    id: '1',
    title: 'Tutorial: Introducción a la Plataforma',
    content: `[INTRO - 0:00-0:10]
¡Hola! Bienvenidos a nuestro tutorial completo sobre cómo usar la plataforma de generación de contenido con IA.

[DESARROLLO - 0:10-2:30]
En este video aprenderás:
- Cómo navegar por el dashboard principal
- Las diferentes opciones de generación de contenido
- Tips para obtener mejores resultados

[LLAMADA A LA ACCIÓN - 2:30-3:00]
¡No olvides suscribirte y activar las notificaciones para más tutoriales como este!`,
    tone: 'amigable',
    style: 'educativo',
    focus: 'tutorial',
    duration: '3:00',
    createdAt: new Date('2024-01-15'),
    status: 'completed'
  },
  {
    id: '2',
    title: 'Análisis: Tendencias de Marketing Digital 2024',
    content: `[GANCHO - 0:00-0:15]
Las tendencias de marketing digital están cambiando rápidamente. ¿Estás preparado para 2024?

[CONTENIDO PRINCIPAL - 0:15-4:00]
Hoy analizaremos:
1. El auge del video marketing personalizado
2. IA en la creación de contenido
3. Nuevas plataformas emergentes
4. Métricas que realmente importan

[CONCLUSIÓN - 4:00-4:30]
Implementa estas estrategias ahora y mantente ahead de tu competencia.`,
    tone: 'profesional',
    style: 'informativo',
    focus: 'marketing',
    duration: '4:30',
    createdAt: new Date('2024-01-20'),
    status: 'published'
  },
  {
    id: '3',
    title: 'Entretenimiento: Los Memes que Marcaron la Semana',
    content: `[INTRO DINÁMICA - 0:00-0:20]
¡Qué tal internet! Aquí estamos con el recap semanal de los memes más virales.

[DESARROLLO - 0:20-3:40]
Esta semana tuvimos:
- El meme del gato programador
- La nueva tendencia de TikTok
- Los mejores fails de la semana

[OUTRO - 3:40-4:00]
¡Comenta cuál fue tu favorito y no olvides seguirme para más contenido!`,
    tone: 'energico',
    style: 'entretenimiento',
    focus: 'viral',
    duration: '4:00',
    createdAt: new Date('2024-01-18'),
    status: 'draft'
  }
];

export const useVideoScriptsStore = create<VideoScriptsState>((set) => ({
  scripts: mockScripts,
  isGenerating: false,
  
  addScript: (scriptData) => set((state) => ({
    scripts: [
      {
        ...scriptData,
        id: Date.now().toString(),
        createdAt: new Date()
      },
      ...state.scripts
    ]
  })),
  
  updateScript: (id, updates) => set((state) => ({
    scripts: state.scripts.map(script => 
      script.id === id ? { ...script, ...updates } : script
    )
  })),
  
  deleteScript: (id) => set((state) => ({
    scripts: state.scripts.filter(script => script.id !== id)
  })),
  
  setGenerating: (isGenerating) => set({ isGenerating })
})); 