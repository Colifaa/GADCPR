import { create } from 'zustand';
import { useUserImagesStore } from './user-images';

export type ContentType = 'texto' | 'imagenes' | 'videos' | 'gif' | 'infografias' | 'presentaciones';

export interface GeneratedContent {
  id: string;
  type: ContentType;
  title: string;
  data: any;
  createdAt: Date;
  tone: string;
  style: string;
}

interface GeneratedContentStore {
  contents: GeneratedContent[];
  currentContent: GeneratedContent | null;
  isLoading: boolean;
  setCurrentContent: (content: GeneratedContent) => void;
  generateContent: (type: ContentType, tone: string, style: string) => Promise<void>;
  getContentByType: (type: ContentType) => GeneratedContent[];
}

// Mock data para diferentes tipos de contenido
const mockContents: Record<ContentType, any> = {
  texto: {
    content: "🌟 Cómo Nutrir Tu Comunidad: 5 Estrategias Clave para el Éxito\n\n¡Hola, [Nombre de tu Comunidad]! En el último episodio de nuestro podcast 'Creciendo Juntos', hablamos sobre la importancia de nutrir y hacer crecer nuestras comunidades en redes sociales. Aquí te compartimos 5 estrategias clave para asegurar que tu comunidad no solo crezca, sino que florezca. ✨\n\n📈 ¿Listo para transformar tu comunidad? ¡Vamos allá!",
    hashtags: ["#ComunidadDigital", "#CrecimientoPersonal", "#RedesSociales", "#Estrategias", "#Comunidad"]
  },
  imagenes: {
    images: [
      "/images/landing/landing.png",
      "/images/landing/landing2.png", 
      "/images/landing/landing3.png"
    ],
    captions: [
      "Slide 1 - Título: Estrategias para el crecimiento",
      "Slide 2 - Estrategia 1: Escucha Activa",
      "Slide 3 - Estrategia 2: Contenido Personalizado"
    ]
  },
  videos: {
    videoUrl: "/videos/sample-video.mp4",
    thumbnail: "/images/landing/landing.png",
    duration: "2:30",
    script: "Guión del video sobre estrategias de comunidad...",
    description: "Video explicativo sobre cómo nutrir tu comunidad digital"
  },
  gif: {
    gifUrl: "/gifs/community-growth.gif",
    thumbnail: "/images/landing/landing2.png",
    description: "GIF animado mostrando el crecimiento de la comunidad",
    duration: "3s"
  },
  infografias: {
    imageUrl: "/images/infografia-comunidad.png",
    title: "5 Estrategias para Nutrir tu Comunidad",
    sections: [
      { title: "Escucha Activa", description: "Responde a comentarios y preguntas" },
      { title: "Contenido Personalizado", description: "Adapta tu contenido a los intereses" },
      { title: "Interacción Regular", description: "Mantén conversaciones constantes" },
      { title: "Valor Agregado", description: "Comparte contenido útil y relevante" },
      { title: "Feedback", description: "Solicita y valora la opinión de tu audiencia" }
    ]
  },
  presentaciones: {
    title: "Cómo Nutrir Tu Comunidad: 5 Estrategias Clave",
    slides: [
      {
        title: "Título Principal",
        content: "Cómo Nutrir Tu Comunidad: 5 Estrategias Clave para el Éxito",
        type: "title"
      },
      {
        title: "Estrategia 1: Escucha Activa",
        content: "Presta atención a lo que dice tu comunidad. Responde a sus comentarios y preguntas. Entiende sus necesidades fortalece la conexión.",
        type: "content"
      },
      {
        title: "Estrategia 2: Contenido Personalizado", 
        content: "Ofrece contenido que resuene con tus miembros. Considera sus intereses y adapta tus publicaciones y recursos a sus necesidades.",
        type: "content"
      },
      {
        title: "Estrategia 3: Interacción Regular",
        content: "Mantén conversaciones constantes. Una representación gráfica de una conversación (por ejemplo, burbujas de diálogo).",
        type: "content"
      },
      {
        title: "Estrategia 4: Valor Agregado",
        content: "Comparte contenido útil y relevante. Un gráfico que muestre diferentes tipos de contenido (videos, blogs, encuestas).",
        type: "content"
      },
      {
        title: "¡Gracias!",
        content: "¿Preguntas?",
        type: "closing"
      }
    ],
    totalSlides: 6,
    currentSlide: 1
  }
};

export const useGeneratedContentStore = create<GeneratedContentStore>((set, get) => ({
  contents: [],
  currentContent: null,
  isLoading: false,

  setCurrentContent: (content) => {
    set({ currentContent: content });
  },

  generateContent: async (type: ContentType, tone: string, style: string) => {
    set({ isLoading: true });
    
    // Simular delay de generación
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Obtener imágenes del usuario
    const userImages = useUserImagesStore.getState().images;
    const userImageUrls = userImages.map(img => img.url);
    
    // Crear contenido personalizado con las imágenes del usuario
    const customData = { ...mockContents[type] };
    
    // Para tipos de contenido que usan imágenes, usar las del usuario
    if (type === 'imagenes' && userImageUrls.length > 0) {
      customData.images = userImageUrls.slice(0, 3); // Máximo 3 imágenes
      customData.captions = userImageUrls.slice(0, 3).map((_, index) => 
        `Slide ${index + 1} - Basado en tu imagen personalizada`
      );
    }
    
    if (type === 'videos' && userImageUrls.length > 0) {
      customData.thumbnail = userImageUrls[0]; // Usar primera imagen como thumbnail
    }
    
    if (type === 'gif' && userImageUrls.length > 0) {
      customData.thumbnail = userImageUrls[0];
    }
    
    if (type === 'infografias' && userImageUrls.length > 0) {
      customData.imageUrl = userImageUrls[0];
    }
    
    if (type === 'presentaciones' && userImageUrls.length > 0) {
      // Agregar imágenes a algunas diapositivas
      customData.slides = customData.slides.map((slide: any, index: number) => {
        if (index > 0 && index < customData.slides.length - 1 && userImageUrls[index - 1]) {
          return {
            ...slide,
            image: userImageUrls[index - 1]
          };
        }
        return slide;
      });
    }
    
    const newContent: GeneratedContent = {
      id: `content-${Date.now()}`,
      type,
      title: getContentTitle(type),
      data: customData,
      createdAt: new Date(),
      tone,
      style
    };

    set(state => ({
      contents: [newContent, ...state.contents],
      currentContent: newContent,
      isLoading: false
    }));
  },

  getContentByType: (type: ContentType) => {
    return get().contents.filter(content => content.type === type);
  }
}));

function getContentTitle(type: ContentType): string {
  const titles: Record<ContentType, string> = {
    texto: "Publicación en Instagram con Carousel sobre 'Nutrición' o Cuidado de la Comunidad",
    imagenes: "Carousel de Imágenes: Estrategias para Nutrir tu Comunidad", 
    videos: "Video: Cómo Nutrir Tu Comunidad - 5 Estrategias Clave",
    gif: "GIF Animado: Crecimiento de Comunidad Digital",
    infografias: "Infografía: 5 Estrategias para el Éxito de tu Comunidad",
    presentaciones: "Presentación: Estrategias para Nutrir tu Comunidad"
  };
  return titles[type];
} 