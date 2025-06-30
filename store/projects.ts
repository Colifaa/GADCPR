import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface GeneratedContent {
  type: 'text' | 'image' | 'gif' | 'video' | 'infografia' | 'presentacion'
  title: string
  content: string
  thumbnail?: string
  description?: string
  slides?: number // Para presentaciones
  format?: string // Para especificar formato (PDF, PPTX, etc.)
  tone?: string // Tono usado para generar el contenido
  style?: string // Estilo usado para generar el contenido
}

export interface Project {
  id: string
  title: string
  episodes: number
  subtitle: string
  duration: string
  listeners: number
  date: string
  generatedContent: GeneratedContent[]
  podcastTitle: string
  podcastAuthor: string
  episodeTitle?: string
  createdAt: string
  // Contenido generado específico para este proyecto
  linkedContent?: {
    type: string
    tone: string
    style: string
    music?: string  // ID de la música seleccionada
  } // Para contenido de redes sociales (usa parámetros URL)
  linkedScriptId?: string  // Para guiones de video (usa ID específico)
}

interface ProjectsStore {
  projects: Project[]
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void
  removeProject: (id: string) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  clearProjects: () => void
  linkContentToProject: (projectId: string, content?: { type: string, tone: string, style: string, music?: string }, scriptId?: string) => void
  migrateProjects: () => void
}

export const useProjectsStore = create<ProjectsStore>()(
  persist(
    (set, get) => ({
      projects: [
        // Datos iniciales mock
        {
          id: "1",
          title: "Creciendo Juntos",
          episodes: 3,
          subtitle: "Subtema principal: Colaboraciones y alianzas estratégicas",
          duration: "25 mins",
          listeners: 158,
          date: "15/08/00",
          podcastTitle: "Emprendimiento Digital",
          podcastAuthor: "María González",
          episodeTitle: "Alianzas que transforman negocios",
          createdAt: new Date().toISOString(),
          generatedContent: [
            {
              type: "text",
              title: "Post para Instagram",
              content: "🚀 Las alianzas estratégicas son el motor del crecimiento empresarial\n\n✨ Puntos clave del episodio:\n• Identifica socios complementarios\n• Define objetivos claros y medibles\n• Establece comunicación transparente\n• Crea valor mutuo desde el inicio\n\n💡 Recuerda: Una buena alianza no es solo compartir recursos, es potenciar las fortalezas de ambas partes.\n\n#Emprendimiento #AlianzasEstrategicas #Crecimiento #Negocios",
              description: "Contenido optimizado para redes sociales",
              tone: "profesional",
              style: "educativos"
            },
            {
              type: "image",
              title: "Infografía - Claves del Éxito",
              content: "/api/placeholder/800/600",
              thumbnail: "/api/placeholder/400/300",
              description: "Infografía con los 5 pilares de las alianzas exitosas",
              tone: "profesional",
              style: "educativos"
            },
            {
              type: "video",
              title: "Video Resumen - 60 segundos",
              content: "/api/placeholder/video",
              thumbnail: "/api/placeholder/400/300",
              description: "Resumen dinámico del episodio en formato vertical",
              tone: "energico",
              style: "entretenimiento"
            },
            {
              type: "infografia",
              title: "Infografía - Proceso de Alianzas",
              content: "/api/generated/infografia/alianzas.pdf",
              thumbnail: "/api/placeholder/400/600",
              description: "Infografía detallada con el proceso paso a paso",
              format: "PDF",
              tone: "profesional",
              style: "informativo"
            },
            {
              type: "presentacion",
              title: "Presentación - Estrategias de Alianzas",
              content: "/api/generated/presentacion/alianzas.pptx",
              thumbnail: "/api/placeholder/600/400",
              description: "Presentación ejecutiva con casos de éxito",
              slides: 12,
              format: "PPTX",
              tone: "profesional",
              style: "educativos"
            }
          ]
        },
        {
          id: "2",
          title: "Nexos Digitales",
          episodes: 5,
          subtitle: "Subtema principal: El verdadero valor del engagement",
          duration: "55 mins",
          listeners: 258,
          date: "15/08/00",
          podcastTitle: "Marketing Digital Avanzado",
          podcastAuthor: "Carlos Ruiz",
          episodeTitle: "Métricas que realmente importan",
          createdAt: new Date().toISOString(),
          generatedContent: [
            {
              type: "text",
              title: "Thread para Twitter",
              content: "🧵 THREAD: El engagement real vs. las métricas vanidosas\n\n1/7 📊 Muchas marcas se obsesionan con los likes y seguidores, pero ¿realmente importan?\n\n2/7 💡 El engagement verdadero se mide en:\n- Comentarios significativos\n- Compartidos con contexto\n- Conversaciones generadas\n- Acciones tomadas\n\n3/7 🎯 Calidad > Cantidad siempre\n\n4/7 📈 Una comunidad de 1K personas comprometidas vale más que 100K seguidores pasivos\n\n5/7 🔥 Estrategias que funcionan:\n- Contenido que genera debate\n- Preguntas abiertas\n- Historias personales\n- Valor educativo\n\n6/7 💪 El engagement real construye relaciones, no solo números\n\n7/7 ¿Cuál es tu métrica favorita para medir engagement real? 👇\n\n#MarketingDigital #Engagement #CommunityBuilding",
              description: "Hilo optimizado para generar conversación",
              tone: "casual",
              style: "entretenimiento"
            },
            {
              type: "gif",
              title: "GIF Animado - Métricas",
              content: "/api/placeholder/gif",
              thumbnail: "/api/placeholder/400/300",
              description: "Animación mostrando la diferencia entre métricas vanidosas y engagement real",
              tone: "casual",
              style: "entretenimiento"
            },
            {
              type: "infografia",
              title: "Infografía - Métricas de Engagement",
              content: "/api/generated/infografia/engagement.pdf",
              thumbnail: "/api/placeholder/400/600",
              description: "Comparativa visual entre métricas reales y vanidosas",
              format: "PDF",
              tone: "profesional",
              style: "informativo"
            },
            {
              type: "presentacion",
              title: "Deck - Estrategias de Engagement",
              content: "/api/generated/presentacion/engagement.pptx",
              thumbnail: "/api/placeholder/600/400",
              description: "Presentación con estrategias probadas de engagement",
              slides: 15,
              format: "PPTX",
              tone: "profesional",
              style: "educativos"
            }
          ]
        }
      ],

      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          projects: [newProject, ...state.projects]
        }))
      },

      removeProject: (id) => {
        set((state) => ({
          projects: state.projects.filter(p => p.id !== id)
        }))
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map(p => 
            p.id === id ? { ...p, ...updates } : p
          )
        }))
      },

      clearProjects: () => {
        set({ projects: [] })
      },

      linkContentToProject: (projectId, content, scriptId) => {
        set((state) => ({
          projects: state.projects.map(p => 
            p.id === projectId 
              ? { ...p, linkedContent: content, linkedScriptId: scriptId }
              : p
          )
        }))
      },

      // Función para migrar proyectos existentes (agregar campo music si no existe)
      migrateProjects: () => {
        set((state) => ({
          projects: state.projects.map(p => ({
            ...p,
            linkedContent: p.linkedContent ? {
              ...p.linkedContent,
              music: p.linkedContent.music || undefined
            } : undefined
          }))
        }))
      },
    }),
    {
      name: 'projects-storage',
    }
  )
) 