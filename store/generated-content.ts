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

// Función para generar nombres de comunidades basados en tono y estilo
function generateCommunityName(tone: string, style: string): string {
  const communityNames: Record<string, Record<string, string[]>> = {
    amigable: {
      educativos: ["Emprendedores Unidos", "Crecimiento Personal", "Aprendices Digitales", "Comunidad Creativa"],
      entretenimiento: ["Diversión Total", "Risas y Más", "Momentos Únicos", "Alegría Compartida"],
      informativo: ["Noticias Frescas", "Información Útil", "Datos Relevantes", "Actualidad Digital"],
      inspiracional: ["Sueños Posibles", "Motivación Diaria", "Inspiración Real", "Cambio Positivo"]
    },
    profesional: {
      educativos: ["Líderes del Futuro", "Excelencia Empresarial", "Desarrollo Profesional", "Innovación Corporativa"],
      entretenimiento: ["Networking Social", "Eventos Ejecutivos", "Cultura Empresarial", "Conexiones Pro"],
      informativo: ["Business Intelligence", "Tendencias del Mercado", "Análisis Estratégico", "Insights Corporativos"],
      inspiracional: ["Éxito Empresarial", "Liderazgo Efectivo", "Visión Estratégica", "Transformación Digital"]
    },
    casual: {
      educativos: ["Aprende Fácil", "Tips Cotidianos", "Conocimiento Libre", "Sabiduría Práctica"],
      entretenimiento: ["Buen Rollo", "Contenido Genial", "Diversión Casual", "Momentos Cool"],
      informativo: ["Info Rápida", "Datos Curiosos", "Noticias Express", "Contenido Útil"],
      inspiracional: ["Buenas Vibras", "Motivación Simple", "Inspiración Diaria", "Actitud Positiva"]
    },
    energico: {
      educativos: ["Acción y Aprendizaje", "Turbo Conocimiento", "Educación Explosiva", "Saber Dinámico"],
      entretenimiento: ["Diversión Extrema", "Energía Pura", "Adrenalina Total", "Poder Divertido"],
      informativo: ["Noticias Rápidas", "Info Explosiva", "Datos Dinámicos", "Actualidad Intensa"],
      inspiracional: ["Fuerza Imparable", "Energía Motivacional", "Poder Interior", "Acción Inspiradora"]
    }
  };

  const toneNames = communityNames[tone] || communityNames.amigable;
  const styleNames = toneNames[style] || toneNames.educativos;
  
  return styleNames[Math.floor(Math.random() * styleNames.length)];
}

// Función para generar contenido de texto personalizado
function generateTextContent(tone: string, style: string): any {
  const communityName = generateCommunityName(tone, style);
  
  const contentTemplates: Record<string, Record<string, string>> = {
    amigable: {
      educativos: `🌟 Cómo Nutrir Tu Comunidad: 5 Estrategias Clave para el Éxito\n\n¡Hola, comunidad de ${communityName}! En el último episodio de nuestro podcast 'Creciendo Juntos', hablamos sobre la importancia de nutrir y hacer crecer nuestras comunidades en redes sociales. Aquí te compartimos 5 estrategias clave para asegurar que tu comunidad no solo crezca, sino que florezca. ✨\n\n📈 ¿Listo para transformar tu comunidad? ¡Vamos allá!`,
      entretenimiento: `🎉 ¡Diversión Garantizada! 5 Formas de Hacer tu Comunidad Más Divertida\n\n¡Hola, familia de ${communityName}! ¿Sabías que las comunidades más exitosas son las que saben cómo divertirse? En nuestro último podcast hablamos sobre cómo crear momentos únicos que mantengan a tu audiencia enganchada y feliz. 🎊\n\n🚀 ¡Prepárate para llevar tu comunidad al siguiente nivel de diversión!`,
      informativo: `📰 Tendencias 2024: Lo que Toda Comunidad Debe Saber\n\n¡Hola, miembros de ${communityName}! El mundo digital cambia constantemente y es crucial mantenerse actualizado. En nuestro análisis semanal, te compartimos las 5 tendencias más importantes que están definiendo el futuro de las comunidades online. 📊\n\n💡 Información que marca la diferencia. ¡Vamos a explorarla juntos!`,
      inspiracional: `✨ Tu Comunidad, Tu Legado: 5 Pasos para Crear Impacto Real\n\n¡Hola, visionarios de ${communityName}! Cada gran comunidad comienza con un sueño y la determinación de hacer la diferencia. Hoy te compartimos las estrategias que han transformado comunidades pequeñas en movimientos poderosos. 🌟\n\n🔥 ¡Es hora de convertir tu visión en realidad!`
    },
    profesional: {
      educativos: `📊 Estrategias de Crecimiento Empresarial: Análisis de Casos de Éxito\n\nEstimados miembros de ${communityName}, en nuestro último webinar ejecutivo analizamos las metodologías que han permitido a las empresas líderes escalar sus operaciones de manera sostenible. Presentamos 5 frameworks probados que pueden implementar inmediatamente. 📈\n\n🎯 Resultados medibles. Crecimiento estratégico.`,
      entretenimiento: `🎭 Cultura Corporativa: El Arte de Crear Experiencias Memorables\n\nColegas de ${communityName}, las organizaciones más exitosas entienden que el engagement va más allá de los números. En nuestro estudio reciente, identificamos cómo las empresas Fortune 500 integran elementos de entretenimiento en su cultura organizacional. 🏆\n\n💼 Profesionalismo con personalidad.`,
      informativo: `📋 Reporte Semanal: Tendencias del Mercado y Oportunidades de Negocio\n\nEquipo de ${communityName}, nuestro departamento de análisis ha identificado 5 tendencias clave que están redefiniendo el panorama empresarial. Este informe incluye datos actualizados, proyecciones y recomendaciones estratégicas. 📈\n\n🔍 Información estratégica para decisiones inteligentes.`,
      inspiracional: `🚀 Liderazgo Transformacional: Construyendo el Futuro de tu Organización\n\nLíderes de ${communityName}, el verdadero liderazgo no se trata solo de gestionar, sino de inspirar transformaciones significativas. Compartimos las metodologías que han permitido a CEOs visionarios revolucionar sus industrias. 💡\n\n⚡ Lidera el cambio que quieres ver.`
    },
    casual: {
      educativos: `📚 Aprende Algo Nuevo Cada Día: Tips Que Realmente Funcionan\n\n¡Hey, gente de ${communityName}! ¿Sabían que aprender algo nuevo cada día puede cambiar completamente su perspectiva? En nuestro último video hablamos de 5 métodos súper sencillos para mantenerse siempre aprendiendo sin estresarse. 😊\n\n🌱 Conocimiento fácil y divertido. ¡Dale que se puede!`,
      entretenimiento: `🎮 Contenido que Engancha: Secretos de los Creadores Más Cool\n\n¡Qué tal, comunidad de ${communityName}! ¿Alguna vez se preguntaron cómo algunos creadores logran que siempre queramos ver más de su contenido? Hoy les comparto los trucos que usan los mejores para mantener a su audiencia súper enganchada. 🤩\n\n🔥 ¡Prepárense para crear contenido adictivo!`,
      informativo: `📱 Tech News: Lo Que Está Pasando en el Mundo Digital\n\n¡Hola, techies de ${communityName}! El mundo de la tecnología no para nunca, y esta semana han pasado cosas increíbles. Les traigo las 5 noticias más importantes explicadas de forma súper fácil para que estén al día. 💻\n\n⚡ Info tech sin complicaciones. ¡Vamos a ponernos al día!`,
      inspiracional: `🌟 Pequeños Cambios, Grandes Resultados: Tu Dosis de Motivación Semanal\n\n¡Hola, soñadores de ${communityName}! A veces pensamos que necesitamos hacer cambios enormes para lograr nuestros objetivos, pero la verdad es que los pequeños pasos constantes son los que realmente marcan la diferencia. 💪\n\n✨ ¡Hoy es el día perfecto para empezar algo nuevo!`
    },
    energico: {
      educativos: `⚡ ACELERA TU APRENDIZAJE: 5 Técnicas de Alta Velocidad\n\n¡ATENCIÓN, guerreros del conocimiento de ${communityName}! ¿Quieren aprender más rápido que nunca? ¡Tengo las técnicas EXPLOSIVAS que usan los genios para absorber información a velocidad SUPERSÓNICA! 🚀\n\n🔥 ¡PREPARENSE PARA REVOLUCIONAR SU FORMA DE APRENDER!`,
      entretenimiento: `🎊 ¡DIVERSIÓN AL MÁXIMO! Cómo Crear Contenido que EXPLOTE de Energía\n\n¡YO, SÚPER COMUNIDAD de ${communityName}! ¿Listos para crear contenido que NADIE pueda ignorar? ¡Hoy les traigo las fórmulas SECRETAS para hacer contenido que genere ADICCIÓN TOTAL! 💥\n\n🚀 ¡VAMOS A ROMPER EL INTERNET JUNTOS!`,
      informativo: `📢 NOTICIAS EXPLOSIVAS: La Info Más CALIENTE de la Semana\n\n¡COMUNIDAD IMPARABLE de ${communityName}! ¡Esta semana ha estado INCREÍBLE! Les traigo las noticias más IMPACTANTES que están cambiando el juego COMPLETAMENTE. ¡Información que NO pueden perderse! ⚡\n\n🔥 ¡MANTÉNGANSE AL DÍA CON LA VELOCIDAD DE LA LUZ!`,
      inspiracional: `💪 ¡DESATA TU PODER INTERIOR! 5 Pasos para Ser IMPARABLE\n\n¡GUERREROS de ${communityName}! ¿Están listos para EXPLOTAR todo su potencial? ¡Hoy les comparto las estrategias DEMOLEDORAS que usan los CAMPEONES para conseguir TODO lo que se proponen! 🏆\n\n🚀 ¡ES HORA DE CONVERTIRSE EN LA MEJOR VERSIÓN DE USTEDES MISMOS!`
    }
  };

  const toneContent = contentTemplates[tone] || contentTemplates.amigable;
  const content = toneContent[style] || toneContent.educativos;
  
  // Hashtags específicos por tono y estilo
  const hashtagsByToneStyle: Record<string, Record<string, string[]>> = {
    amigable: {
      educativos: ["#ComunidadDigital", "#CrecimientoPersonal", "#RedesSociales", "#Estrategias", "#Comunidad"],
      entretenimiento: ["#DiversiónTotal", "#ComunidadFeliz", "#BuenRollo", "#Entretenimiento", "#Risas"],
      informativo: ["#NoticiasDigitales", "#InformaciónÚtil", "#Tendencias", "#Actualidad", "#Datos"],
      inspiracional: ["#Motivación", "#Inspiración", "#SueñosPosibles", "#CambioPositivo", "#Crecimiento"]
    },
    profesional: {
      educativos: ["#LiderazgoEmpresarial", "#DesarrolloProfesional", "#Estrategia", "#Negocios", "#Excelencia"],
      entretenimiento: ["#CulturaEmpresarial", "#NetworkingPro", "#EventosCorporativos", "#TeamBuilding", "#Profesional"],
      informativo: ["#BusinessIntelligence", "#TendenciasMercado", "#AnálisisEmpresarial", "#Insights", "#Corporativo"],
      inspiracional: ["#ÉxitoEmpresarial", "#LiderazgoEfectivo", "#VisiónEmpresarial", "#TransformaciónDigital", "#Innovación"]
    },
    casual: {
      educativos: ["#AprendeFácil", "#TipsCotidianos", "#ConocimientoLibre", "#EducaciónSimple", "#SabiduríaPráctica"],
      entretenimiento: ["#BuenRollo", "#ContenidoGenial", "#DiversiónCasual", "#MomentosCool", "#Entretenimiento"],
      informativo: ["#InfoRápida", "#DatosCuriosos", "#NoticiasExpress", "#ContenidoÚtil", "#InfoFácil"],
      inspiracional: ["#BuenasVibras", "#MotivaciónSimple", "#InspiraciónDiaria", "#ActitudPositiva", "#Motivación"]
    },
    energico: {
      educativos: ["#AprendizajeExplosivo", "#TurboConocimiento", "#EducaciónDinámica", "#SaberPotente", "#AcciónEducativa"],
      entretenimiento: ["#DiversiónExtrema", "#EnergíaPura", "#AdrenalinTotal", "#PoderDivertido", "#EntretenimientoInteso"],
      informativo: ["#NoticiasRápidas", "#InfoExplosiva", "#DatosDinámicos", "#ActualidadIntensa", "#InfoEnergética"],
      inspiracional: ["#FuerzaImparable", "#EnergíaMotivacional", "#PoderInterior", "#AcciónInspiradora", "#MotivaciónExplosiva"]
    }
  };

  const toneHashtags = hashtagsByToneStyle[tone] || hashtagsByToneStyle.amigable;
  const hashtags = toneHashtags[style] || toneHashtags.educativos;

  return {
    content,
    hashtags,
    communityName
  };
}

// Mock data para diferentes tipos de contenido
const mockContents: Record<ContentType, any> = {
  texto: generateTextContent('amigable', 'educativos'), // Default, se sobrescribe en generateContent
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
    gifUrl: "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif", // GIF de gráficas creciendo
    thumbnail: "/images/landing/landing2.png",
    description: "GIF animado mostrando el crecimiento de la comunidad",
    duration: "3s",
    width: 480,
    height: 270,
    loop: true
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
    let customData = { ...mockContents[type] };
    
    // Para contenido de texto, generar contenido personalizado basado en tono y estilo
    if (type === 'texto') {
      customData = generateTextContent(tone, style);
    }
    
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
    
    if (type === 'gif') {
      // Generar GIF basado en tono y estilo
      customData = generateCustomGif(tone, style);
      if (userImageUrls.length > 0) {
        customData.thumbnail = userImageUrls[0];
      }
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
      title: getContentTitle(type, customData),
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

// Función para generar GIFs personalizados basados en tono y estilo
function generateCustomGif(tone: string, style: string) {
  // GIFs profesionales de diferentes categorías
  const gifDatabase = {
    // Tonos profesionales
    profesional: {
      educativos: {
        gifUrl: "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif", // Gráficas subiendo
        description: "Análisis profesional de datos y métricas de crecimiento",
        title: "Análisis de Datos Profesional"
      },
      informativo: {
        gifUrl: "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif", // Dashboard animado
        description: "Dashboard interactivo mostrando insights del podcast",
        title: "Dashboard de Insights"
      },
      inspiracional: {
        gifUrl: "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif", // Cohete despegando
        description: "Estrategias de crecimiento y desarrollo profesional",
        title: "Crecimiento Estratégico"
      },
      entretenimiento: {
        gifUrl: "https://media.giphy.com/media/3o7TKwmnDgQb5jemjK/giphy.gif", // Elementos animados
        description: "Presentación dinámica de conceptos clave",
        title: "Conceptos Dinámicos"
      }
    },
    // Tonos amigables
    amigable: {
      educativos: {
        gifUrl: "https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif", // Libros volando
        description: "Aprendizaje divertido y accesible para todos",
        title: "Aprendizaje Divertido"
      },
      informativo: {
        gifUrl: "https://media.giphy.com/media/3oKIPf3C7HqqoFXXqU/giphy.gif", // Iconos informativos
        description: "Información clara y fácil de entender",
        title: "Info Fácil"
      },
      inspiracional: {
        gifUrl: "https://media.giphy.com/media/26tn8zUZg4pEkjOda/giphy.gif", // Estrellas brillando
        description: "Motivación e inspiración para tu crecimiento",
        title: "Inspiración Diaria"
      },
      entretenimiento: {
        gifUrl: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif", // Elementos divertidos
        description: "Contenido entretenido y engaging",
        title: "Diversión Garantizada"
      }
    },
    // Tonos casuales
    casual: {
      educativos: {
        gifUrl: "https://media.giphy.com/media/l2Je66zG6mAAZxgqI/giphy.gif", // Elementos casuales
        description: "Tips y consejos en un formato relajado",
        title: "Tips Casuales"
      },
      informativo: {
        gifUrl: "https://media.giphy.com/media/3oKIPnqQhaPbEb5pMA/giphy.gif", // Info casual
        description: "Datos interesantes presentados de forma casual",
        title: "Data Casual"
      },
      inspiracional: {
        gifUrl: "https://media.giphy.com/media/l2JhOVyjSLXvqO5TG/giphy.gif", // Motivación casual
        description: "Inspiración sin presión, a tu ritmo",
        title: "Motivación Relajada"
      },
      entretenimiento: {
        gifUrl: "https://media.giphy.com/media/3o7TKTDn976rzVgDJK/giphy.gif", // Entretenimiento casual
        description: "Contenido ligero y entretenido",
        title: "Entretenimiento Ligero"
      }
    },
    // Tonos enérgicos
    energico: {
      educativos: {
        gifUrl: "https://media.giphy.com/media/xTiTnxpQ3ghPiB2Hp6/giphy.gif", // Energía educativa
        description: "Aprendizaje dinámico y lleno de energía",
        title: "Aprendizaje Dinámico"
      },
      informativo: {
        gifUrl: "https://media.giphy.com/media/3o7TKF1fSIs1R19B8Y/giphy.gif", // Info enérgica
        description: "Datos impactantes presentados con energía",
        title: "Datos Impactantes"
      },
      inspiracional: {
        gifUrl: "https://media.giphy.com/media/l1J9FiGxR61OcF2mI/giphy.gif", // Explosión de energía
        description: "Motivación explosiva para alcanzar tus metas",
        title: "Energía Motivacional"
      },
      entretenimiento: {
        gifUrl: "https://media.giphy.com/media/3oKIPyTdNJbKaSQVeE/giphy.gif", // Entretenimiento enérgico
        description: "Diversión a todo volumen",
        title: "Diversión Explosiva"
      }
    }
  };

  // Obtener el GIF correspondiente o usar uno por defecto
  const toneData = gifDatabase[tone as keyof typeof gifDatabase] || gifDatabase.amigable;
  const styleData = toneData[style as keyof typeof toneData] || toneData.educativos;

  return {
    gifUrl: styleData.gifUrl,
    thumbnail: "/images/landing/landing2.png",
    description: styleData.description,
    title: styleData.title,
    duration: "3s",
    width: 480,
    height: 270,
    loop: true,
    tone: tone,
    style: style
  };
}

function getContentTitle(type: ContentType, customData?: any): string {
  if (type === 'gif' && customData?.title) {
    return `GIF Animado: ${customData.title}`;
  }
  
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