import { create } from 'zustand';
import { useUserImagesStore } from './user-images';
import { usePodcastStore } from './podcasts'
import type { PodcastData } from './podcasts'

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
function generateTextContent(tone: string, style: string, podcast?: PodcastData | null): any {
  const communityName = generateCommunityName(tone, style);
  
  // Si existe un podcast seleccionado, usar datos específicos
  if (podcast) {
    const podcastTitle = podcast.title;
    const podcastCategory = podcast.category;
    const podcastAuthor = podcast.author || 'Creador';
    const firstEpisode = podcast.episodes?.[0];
    const episodeTitle = firstEpisode?.title || 'Episodio principal';
    const episodeDescription = firstEpisode?.description || 'Análisis profundo del contenido';
    
    // Crear hashtags específicos del podcast
    const podcastHashtags = [
      `#${podcastCategory.charAt(0).toUpperCase() + podcastCategory.slice(1)}`,
      `#${podcastTitle.replace(/\s+/g, '').slice(0, 15)}`,
      `#Podcast`,
      `#${podcastAuthor.replace(/\s+/g, '').slice(0, 15)}`,
      `#ContenidoPersonalizado`
    ];
    
    // Generar contenido específico basado en el podcast y el tono/estilo
    const podcastContentTemplates: Record<string, Record<string, (data: any) => string>> = {
      amigable: {
        educativos: (data) => `🎙️ ¡Aprendiendo con "${data.title}"! 

¡Hola, comunidad de ${communityName}! 🌟 Acabo de analizar el increíble podcast "${data.title}" de ${data.author}, y tengo que compartir contigo los insights más valiosos.

En el episodio "${data.episode}", ${data.author} nos enseña sobre ${data.category} de una manera súper accesible y práctica. 

✨ Lo que más me llamó la atención:
• ${data.description}
• Estrategias aplicables desde el primer día
• Casos reales que nos ayudan a entender mejor

¿Ya escuchaste este podcast? ¡Cuéntame qué te pareció en los comentarios! 👇

#ContenidoEducativo #PodcastRecomendado`,
        
        entretenimiento: (data) => `🎉 ¡Diversión garantizada con "${data.title}"! 

¡Hola, familia de ${communityName}! 🎊 ¿Buscas contenido sobre ${data.category} que te entretenga Y te enseñe? 

¡Tengo LA recomendación perfecta para ti!

🎙️ Podcast: "${data.title}" 
👨‍🎤 Por: ${data.author}
📺 Episodio destacado: "${data.episode}"

Este podcast me tiene SÚPER enganchado. ${data.author} tiene una forma única de explicar ${data.category} que te mantiene pegado desde el primer minuto. 

¡Es como tener una charla con tu mejor amigo experto en el tema! 😄

¿Qué podcast te tiene enganchado últimamente? ¡Comparte tus favoritos! 🚀`,
        
        informativo: (data) => `📊 Datos clave del podcast "${data.title}"

¡Hola, miembros de ${communityName}! 📰 He analizado el podcast "${data.title}" y aquí tienes la información más relevante:

🔍 **Análisis del contenido:**
• Temática principal: ${data.category}
• Creador: ${data.author}
• Episodio analizado: "${data.episode}"
• Enfoque: ${data.description}

📈 **Por qué es relevante:**
• Contenido actualizado sobre ${data.category}
• Perspectiva única de ${data.author}
• Información práctica y aplicable

Este tipo de contenido es exactamente lo que necesitamos para mantenernos actualizados en ${data.category}.

¿Qué otros podcasts recomiendas sobre este tema? 💡`,
        
        inspiracional: (data) => `✨ Inspiración del podcast "${data.title}"

¡Hola, visionarios de ${communityName}! 🌟 Acabo de terminar de escuchar "${data.title}" de ${data.author}, y mi mente está llena de ideas increíbles.

Este podcast sobre ${data.category} me recordó algo fundamental: cada gran historia comienza con alguien que decidió compartir su conocimiento.

🎙️ **Lo que más me inspiró:**
• La pasión de ${data.author} al hablar sobre ${data.category}
• En "${data.episode}": ${data.description}
• La manera en que transforma conceptos complejos en sabiduría práctica

💪 **Tu momento de reflexión:**
¿Qué conocimiento tienes que podría inspirar a otros? ¿Cuál es tu historia por contar?

Recuerda: tu voz importa, tus ideas pueden cambiar vidas. 🚀

¡Cuéntame en los comentarios qué te inspira a ti! 👇`
      },
      
      profesional: {
        educativos: (data) => `📊 Análisis profesional: "${data.title}"

Estimados colegas de ${communityName}, 

He completado un análisis exhaustivo del podcast "${data.title}" de ${data.author}, enfocado en ${data.category}. Los insights obtenidos son altamente relevantes para nuestra industria.

**Puntos clave del análisis:**
• Temática: ${data.category}
• Episodio destacado: "${data.episode}"
• Análisis: ${data.description}
• Aplicabilidad: Alta para profesionales en el sector

**Recomendaciones estratégicas:**
1. Implementar las metodologías discutidas
2. Evaluar aplicación en proyectos actuales
3. Considerar para desarrollo del equipo

Este contenido representa una oportunidad de aprendizaje continuo y mejora de competencias profesionales.

¿Qué recursos educativos recomienda su equipo? 📈`,
        
        entretenimiento: (data) => `🎭 Networking cultural: "${data.title}"

Colegas de ${communityName},

Las organizaciones exitosas entienden que el engagement profesional va más allá de las métricas. El podcast "${data.title}" de ${data.author} demuestra cómo integrar ${data.category} en la cultura organizacional.

**Aspectos destacados:**
• Creador: ${data.author}
• Enfoque: ${data.category}
• Episodio: "${data.episode}"
• Insight: ${data.description}

Este tipo de contenido enriquece nuestra perspectiva profesional y fortalece la cultura de equipo.

¿Cómo integra su organización contenido cultural en el desarrollo profesional? 🏆`,
        
        informativo: (data) => `📋 Reporte de contenido: "${data.title}"

Equipo de ${communityName},

Análisis completado del podcast "${data.title}" para evaluación de tendencias en ${data.category}.

**Datos del análisis:**
• Autor: ${data.author}
• Categoría: ${data.category}
• Episodio evaluado: "${data.episode}"
• Descripción: ${data.description}

**Relevancia para el negocio:**
• Información actualizada sobre ${data.category}
• Perspectivas de experto en la materia
• Aplicabilidad para estrategias corporativas

Recomiendo inclusión en el programa de desarrollo profesional continuo.

¿Requiere análisis adicional de contenido similar? 📊`,
        
        inspiracional: (data) => `🚀 Liderazgo inspiracional: "${data.title}"

Líderes de ${communityName},

El podcast "${data.title}" de ${data.author} ejemplifica el liderazgo transformacional en ${data.category}. Su enfoque en "${data.episode}" demuestra cómo los líderes visionarios comunican ideas complejas de manera impactante.

**Lecciones de liderazgo:**
• Comunicación clara y efectiva
• Dominio del tema: ${data.category}
• Visión estratégica: ${data.description}
• Capacidad de inspirar acción

Este contenido refuerza la importancia del liderazgo intelectual en nuestra industria.

¿Qué estrategias de liderazgo inspiracional implementa su organización? 💡`
      },
      
      casual: {
        educativos: (data) => `📚 Descubrimiento cool: "${data.title}"

¡Hey, gente de ${communityName}! 😊 ¿Saben qué? Me topé con un podcast genial llamado "${data.title}" de ${data.author}, y no podía guardarme estos tips súper útiles.

Es sobre ${data.category}, pero explicado de una manera súper fácil de entender. En el episodio "${data.episode}", ${data.author} habla sobre ${data.description}, y está buenísimo.

🌱 **Lo que me gustó:**
• Se entiende todo perfecto
• Ejemplos de la vida real
• Nada de complicaciones raras
• Tips que puedes usar YA

¡Dale una oportunidad! Te va a gustar mucho. 

¿Qué podcasts geniales has descubierto últimamente? ¡Comparte! 🎧`,
        
        entretenimiento: (data) => `🎮 ¡Encontré oro en podcasts!

¡Qué tal, comunidad de ${communityName}! 🤩 Tengo que contarles sobre "${data.title}" de ${data.author} - está INCREÍBLE.

Es sobre ${data.category}, pero no se vuelve aburrido para nada. El episodio "${data.episode}" me tuvo súper enganchado porque ${data.description}.

🔥 **Por qué me encanta:**
• ${data.author} tiene una onda genial
• Te ríes mientras aprendes
• Cero rollos técnicos pesados
• Te deja con ganas de más

¿Ya lo conocían? ¡Díganme qué tal les pareció! 

¿Cuál es su podcast favorito para pasar el rato? 🎉`,
        
        informativo: (data) => `📱 Info rápida: "${data.title}"

¡Hola, comunidad de ${communityName}! 💻 Quick update sobre un podcast que descubrí y que está muy bueno para mantenerse al día.

Se llama "${data.title}" de ${data.author}, y habla sobre ${data.category} de una manera súper directa. El episodio "${data.episode}" toca ${data.description} y está lleno de data interesante.

⚡ **Lo mejor:**
• Info actualizada
• Explicaciones claras
• Nada de paja
• Directo al grano

Perfect para estar al día sin complicarse la vida.

¿Qué otras fuentes usan para mantenerse informados? 📊`,
        
        inspiracional: (data) => `🌟 Buenas vibras del podcast "${data.title}"

¡Hola, soñadores de ${communityName}! 💪 Acabo de terminar de escuchar "${data.title}" de ${data.author}, y me dejó con una energía increíble.

Es sobre ${data.category}, pero lo que más me gustó es cómo ${data.author} comparte su pasión. En "${data.episode}", habla sobre ${data.description} de una forma que realmente te motiva.

✨ **Lo que me quedó:**
• Todos tenemos algo valioso que compartir
• No importa de dónde vengas, puedes aportar
• La consistencia es clave
• Las pequeñas acciones suman mucho

¿Qué te está inspirando últimamente? ¡Comparte esas buenas vibras! 🚀`
      },
      
      energico: {
        educativos: (data) => `⚡ ¡APRENDIZAJE EXPLOSIVO con "${data.title}"!

¡ATENCIÓN, guerreros del conocimiento de ${communityName}! 🚀 ¡Acabo de DEVORAR el podcast "${data.title}" de ${data.author} y estoy SÚPER CARGADO de conocimiento!

¡Es sobre ${data.category} y está INCREÍBLE! El episodio "${data.episode}" es PURA DINAMITA educativa: ${data.description}

🔥 **¿POR QUÉ ES GENIAL?**
• ${data.author} DOMINA el tema
• Información SÚPER POTENTE
• Ejemplos que te VUELAN la cabeza
• Conocimiento que puedes usar ¡YA!

¡PREPARENSE para REVOLUCIONAR su forma de entender ${data.category}!

¿QUÉ PODCAST los tiene SÚPER MOTIVADOS? ¡COMPARTAN! 💥`,
        
        entretenimiento: (data) => `🎊 ¡"${data.title}" es PURA DIVERSIÓN!

¡YO, SÚPER COMUNIDAD de ${communityName}! 💥 ¿Listos para REÍRSE mientras aprenden sobre ${data.category}? 

¡"${data.title}" de ${data.author} es EXACTAMENTE lo que necesitaban! En "${data.episode}", ${data.description} de una forma que te mantiene SÚPER ENGANCHADO.

🚀 **¡ES GENIAL PORQUE:**
• ${data.author} tiene una ENERGÍA INCREÍBLE
• Te DIVIERTES mientras aprendes
• Cero aburrimiento garantizado
• Te deja con ganas de MÁS

¡VAMOS A ROMPER EL INTERNET con recomendaciones geniales! 

¿Cuál es su podcast FAVORITO para pasar un buen rato? 🎉`,
        
        informativo: (data) => `📢 ¡INFO EXPLOSIVA de "${data.title}"!

¡COMUNIDAD IMPARABLE de ${communityName}! ⚡ ¡Tengo información SÚPER CALIENTE sobre ${data.category} que NO pueden perderse!

El podcast "${data.title}" de ${data.author} está ROMPIENDO todo con contenido INCREÍBLE. El episodio "${data.episode}" habla sobre ${data.description} y está LLENO de datos que van a cambiar su perspectiva.

🔥 **¡DATOS IMPORTANTES:**
• Creador: ${data.author} (¡Un GENIO!)
• Tema: ${data.category}
• Contenido: SÚPER ACTUALIZADO
• Aplicabilidad: ¡INMEDIATA!

¡MANTÉNGANSE AL DÍA con información que REALMENTE importa!

¿Qué fuentes de información los tienen EMOCIONADOS? 💪`,
        
        inspiracional: (data) => `💪 ¡"${data.title}" me tiene IMPARABLE!

¡GUERREROS de ${communityName}! 🏆 ¿Están listos para EXPLOTAR de motivación? ¡Acabo de terminar "${data.title}" de ${data.author} y estoy CARGADO de energía!

Este podcast sobre ${data.category} es PURA INSPIRACIÓN. En "${data.episode}", ${data.description} de una forma que te hace querer CONQUISTAR el mundo.

🚀 **¡ME ENCENDIÓ PORQUE:**
• ${data.author} es un VERDADERO LÍDER
• Su pasión por ${data.category} es CONTAGIOSA
• Te hace creer en tu POTENCIAL
• Cada palabra es PURA MOTIVACIÓN

¡ES HORA DE CONVERTIRSE en la MEJOR VERSIÓN de ustedes mismos!

¿Qué los tiene SÚPER MOTIVADOS ahora mismo? ¡COMPARTAN esa energía! ⚡`
      }
    };
    
    const toneTemplates = podcastContentTemplates[tone] || podcastContentTemplates.amigable;
    const contentGenerator = toneTemplates[style] || toneTemplates.educativos;
    
    const podcastData = {
      title: podcastTitle,
      author: podcastAuthor,
      category: podcastCategory,
      episode: episodeTitle,
      description: episodeDescription
    };
    
    return {
      content: contentGenerator(podcastData),
      hashtags: podcastHashtags,
      communityName,
      podcastTitle,
      podcastCategory,
      podcastAuthor
    };
  }
  
  // Contenido genérico si no hay podcast seleccionado (mantener el código original)
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
  const rawContent = toneContent[style] || toneContent.educativos;
  
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

  const content = rawContent;

  return {
    content,
    hashtags,
    communityName
  };
}

// Mock data para diferentes tipos de contenido
const mockContents: Record<ContentType, any> = {
  texto: generateTextContent('amigable', 'educativos', undefined), // Default, se sobrescribe en generateContent
  imagenes: {
    images: [
      "https://picsum.photos/seed/defaultimg1/800/600",
      "https://picsum.photos/seed/defaultimg2/800/600",
      "https://picsum.photos/seed/defaultimg3/800/600"
    ],
    captions: [
      "Slide 1: Introducción al contenido",
      "Slide 2: Desarrollo de ideas clave",
      "Slide 3: Conclusiones y takeaways"
    ]
  },
  videos: {
    videoUrl: "https://sample-videos.com/video/default/mp4/720/sample.mp4",
    thumbnail: "https://picsum.photos/seed/defaultvideo/1280/720",
    duration: "2:30",
    script: "Guión del video sobre estrategias de comunidad...",
    description: "Video explicativo sobre cómo nutrir tu comunidad digital"
  },
  gif: {
    gifUrl: "https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif",
    thumbnail: "https://picsum.photos/seed/defaultgif/480/270",
    description: "GIF animado mostrando el crecimiento de la comunidad",
    duration: "3s",
    width: 480,
    height: 270,
    loop: true
  },
  infografias: {
    imageUrl: "https://picsum.photos/seed/defaultinfografia/800/1200",
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
    title: "Estrategias para Nutrir tu Comunidad",
    slides: [
      {
        title: "Estrategias para Nutrir tu Comunidad",
        content: "Análisis de contenido podcast",
        type: "title",
        image: "https://picsum.photos/seed/defaultpresentationslide1/800/600"
      },
      {
        title: "Introducción",
        content: "Aprende las mejores prácticas para crear y mantener una comunidad sólida",
        type: "content",
        image: "https://picsum.photos/seed/defaultpresentationslide2/800/600"
      },
      {
        title: "5 Estrategias Clave",
        content: "1. Escucha activa\n2. Contenido de valor\n3. Interacción constante\n4. Feedback continuo\n5. Construcción de confianza",
        type: "content",
        image: "https://picsum.photos/seed/defaultpresentationslide3/800/600"
      },
      {
        title: "Implementación",
        content: "Cómo aplicar estas estrategias en tu comunidad digital",
        type: "content",
        image: "https://picsum.photos/seed/defaultpresentationslide4/800/600"
      },
      {
        title: "Conclusiones",
        content: "La paciencia y consistencia son clave para el éxito",
        type: "conclusion",
        image: "https://picsum.photos/seed/defaultpresentationslide5/800/600"
      }
    ],
    totalSlides: 5
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
    
    // Obtener podcast seleccionado e imágenes del usuario
    const selectedPodcast = usePodcastStore.getState().selectedPodcast;
    const userImages = useUserImagesStore.getState().images;
    const userImageUrls = userImages.map(img => img.url);
    
    // Crear contenido personalizado con las imágenes del usuario
    let customData = { ...mockContents[type] };
    
    // Para contenido de texto, generar contenido personalizado basado en tono y estilo
    if (type === 'texto') {
      customData = generateTextContent(tone, style, selectedPodcast);
    }
    
    // Para tipos de contenido que usan imágenes, usar las del usuario o Unsplash como fallback
    if (type === 'imagenes') {
      const query = selectedPodcast ? 
        `${selectedPodcast.title} ${selectedPodcast.category}` : 
        getPodcastTopic();
      
      if (userImageUrls.length > 0) {
        customData.images = userImageUrls.slice(0, 5);
      } else {
        const stock = getStockImagesByTopic(query, 5);
        customData.images = stock.length ? stock : getUnsplashImages(query, 5);
      }
      
      // Personalizar captions con información del podcast
      if (selectedPodcast) {
        customData.captions = [
          `Slide 1: "${selectedPodcast.title}" - Introducción`,
          `Slide 2: Análisis de ${selectedPodcast.category}`,
          `Slide 3: Insights principales por ${selectedPodcast.author || 'el creador'}`,
          `Slide 4: Aplicación práctica del contenido`,
          `Slide 5: Conclusiones y recomendaciones`
        ].slice(0, customData.images.length);
      } else {
        customData.captions = customData.images.map((_, index) => `Slide ${index + 1} - ${query}`);
      }
    }

    if (type === 'videos') {
      const query = selectedPodcast ? 
        `${selectedPodcast.title} ${selectedPodcast.category}` : 
        getPodcastTopic();
      
      // Generar thumbnail estable basado en el podcast
      const thumbnailSeed = selectedPodcast ? 
        selectedPodcast.title.replace(/[^a-z0-9]/gi, '').toLowerCase() : 
        'defaultvideo';
      
      if (userImageUrls.length > 0) {
        customData.thumbnail = userImageUrls[0];
      } else {
        customData.thumbnail = `https://picsum.photos/seed/${thumbnailSeed}/1280/720`;
      }
      
      // Generar contenido específico del video basado en el podcast
      if (selectedPodcast) {
        // URL de video estable usando ID del podcast
        const videoId = selectedPodcast.title.replace(/[^a-z0-9]/gi, '').toLowerCase();
        customData.videoUrl = `https://sample-videos.com/video/${videoId}/mp4/720/sample.mp4`;
        customData.description = `Video análisis del podcast "${selectedPodcast.title}" de ${selectedPodcast.author || 'el creador'}. Exploramos los temas clave sobre ${selectedPodcast.category} y sus aplicaciones prácticas.`;
        customData.duration = selectedPodcast.episodes?.[0]?.duration || "2:30";
        customData.script = `
INTRO (0:00-0:15):
¡Hola! Hoy analizamos "${selectedPodcast.title}" de ${selectedPodcast.author || 'un creador increíble'}.

DESARROLLO (0:15-1:45):
Este podcast sobre ${selectedPodcast.category} nos enseña:
- ${selectedPodcast.episodes?.[0]?.description || 'Conceptos fundamentales del tema'}
- Estrategias aplicables en la vida real
- Perspectivas únicas del autor

CIERRE (1:45-2:30):
"${selectedPodcast.title}" es una excelente fuente para aprender sobre ${selectedPodcast.category}. 
¿Ya lo escuchaste? ¡Déjame saber qué opinas en los comentarios!
        `.trim();
      } else {
        customData.videoUrl = `https://sample-videos.com/video/default/mp4/720/sample.mp4`;
        customData.description = `Video generado automáticamente sobre ${query}`;
        customData.thumbnail = `https://picsum.photos/seed/defaultvideo/1280/720`;
      }
    }

    if (type === 'gif') {
      // Generar GIF basado en tono y estilo usando el podcast
      customData = generateCustomGif(tone, style, selectedPodcast);
      if (userImageUrls.length > 0) {
        customData.thumbnail = userImageUrls[0];
      } else if (!customData.thumbnail) {
        const query = selectedPodcast ? 
          `${selectedPodcast.title} ${selectedPodcast.category}` : 
          getPodcastTopic();
        customData.thumbnail = getUnsplashImages(query,1)[0];
      }
    }

    if (type === 'infografias') {
      const query = selectedPodcast ? 
        `${selectedPodcast.title} ${selectedPodcast.category}` : 
        getPodcastTopic();
      
      // Generar imagen estable basada en el podcast
      const imageSeed = selectedPodcast ? 
        selectedPodcast.title.replace(/[^a-z0-9]/gi, '').toLowerCase() : 
        'defaultinfografia';
      
      if (userImageUrls.length > 0) {
        customData.imageUrl = userImageUrls[0];
      } else {
        customData.imageUrl = `https://picsum.photos/seed/${imageSeed}/800/1200`;
      }
      
      // Personalizar contenido de la infografía con datos del podcast
      if (selectedPodcast) {
        customData.title = `Infografía: Datos clave de "${selectedPodcast.title}"`;
        customData.sections = [
          { 
            title: "Podcast Analizado", 
            description: `"${selectedPodcast.title}" por ${selectedPodcast.author || 'Creador'}` 
          },
          { 
            title: "Categoría Principal", 
            description: selectedPodcast.category.charAt(0).toUpperCase() + selectedPodcast.category.slice(1) 
          },
          { 
            title: "Episodios Disponibles", 
            description: `${selectedPodcast.episodes?.length || 1} episodio(s) analizados` 
          },
          { 
            title: "Insights Principales", 
            description: selectedPodcast.episodes?.[0]?.description || "Contenido educativo de alta calidad" 
          },
          { 
            title: "Aplicación Práctica", 
            description: `Estrategias aplicables en ${selectedPodcast.category}` 
          }
        ];
      } else {
        customData.title = `Infografía: Datos clave sobre ${query}`;
        customData.imageUrl = `https://picsum.photos/seed/defaultinfografia/800/1200`;
      }
    }

    if (type === 'presentaciones') {
      const query = selectedPodcast ? 
        `${selectedPodcast.title} ${selectedPodcast.category}` : 
        getPodcastTopic();
      
      if (selectedPodcast) {
        customData.title = `Presentación: "${selectedPodcast.title}" - Análisis Completo`;
        const presentationSeed = selectedPodcast.title.replace(/[^a-z0-9]/gi, '').toLowerCase();
        
        customData.slides = [
          {
            title: "Análisis de Podcast",
            content: `"${selectedPodcast.title}" por ${selectedPodcast.author || 'Creador'}`,
            type: "title",
            image: userImageUrls[0] || `https://picsum.photos/seed/${presentationSeed}slide1/800/600`
          },
          {
            title: "Información General",
            content: `Categoría: ${selectedPodcast.category.charAt(0).toUpperCase() + selectedPodcast.category.slice(1)}\nCreador: ${selectedPodcast.author || 'Autor'}\nEpisodios: ${selectedPodcast.episodes?.length || 1}`,
            type: "content",
            image: userImageUrls[1] || `https://picsum.photos/seed/${presentationSeed}slide2/800/600`
          },
          {
            title: "Episodio Destacado",
            content: `"${selectedPodcast.episodes?.[0]?.title || 'Episodio Principal'}"\n\n${selectedPodcast.episodes?.[0]?.description || 'Contenido principal del podcast analizado.'}`,
            type: "content",
            image: userImageUrls[2] || `https://picsum.photos/seed/${presentationSeed}slide3/800/600`
          },
          {
            title: "Insights Principales",
            content: `• Enfoque en ${selectedPodcast.category}\n• Contenido educativo de calidad\n• Aplicación práctica de conceptos\n• Perspectiva única del autor`,
            type: "content",
            image: userImageUrls[3] || `https://picsum.photos/seed/${presentationSeed}slide4/800/600`
          },
          {
            title: "Conclusiones",
            content: `"${selectedPodcast.title}" ofrece valuable insights sobre ${selectedPodcast.category}. Recomendado para quienes buscan contenido de calidad en esta temática.`,
            type: "conclusion",
            image: userImageUrls[4] || `https://picsum.photos/seed/${presentationSeed}slide5/800/600`
          }
        ];
        customData.totalSlides = customData.slides.length;
      } else {
        const defaultSlides = [
          {
            title: "Estrategias para Nutrir tu Comunidad",
            content: "Análisis de contenido podcast",
            type: "title",
            image: "https://picsum.photos/seed/defaultpresentationslide1/800/600"
          },
          {
            title: "Introducción",
            content: "Aprende las mejores prácticas para crear y mantener una comunidad sólida",
            type: "content",
            image: "https://picsum.photos/seed/defaultpresentationslide2/800/600"
          },
          {
            title: "5 Estrategias Clave",
            content: "1. Escucha activa\n2. Contenido de valor\n3. Interacción constante\n4. Feedback continuo\n5. Construcción de confianza",
            type: "content",
            image: "https://picsum.photos/seed/defaultpresentationslide3/800/600"
          },
          {
            title: "Implementación",
            content: "Cómo aplicar estas estrategias en tu comunidad digital",
            type: "content",
            image: "https://picsum.photos/seed/defaultpresentationslide4/800/600"
          },
          {
            title: "Conclusiones",
            content: "La paciencia y consistencia son clave para el éxito",
            type: "conclusion",
            image: "https://picsum.photos/seed/defaultpresentationslide5/800/600"
          }
        ];
        
        customData.slides = defaultSlides;
        customData.totalSlides = customData.slides.length;
        customData.title = `Presentación sobre ${query}: Estrategias y Claves`;
      }
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
function generateCustomGif(tone: string, style: string, podcast?: PodcastData | null) {
  // Obtener información del podcast si está disponible
  const podcastTitle = podcast?.title || 'tu podcast';
  const podcastCategory = podcast?.category || 'contenido';
  const podcastAuthor = podcast?.author || 'creador';
  
  // Base de datos de GIFs organizados por categoría del podcast primero, luego por tono/estilo
  const gifDatabase: Record<string, Record<string, Record<string, any>>> = {
    // Categoría: Marketing
    marketing: {
      profesional: {
        educativos: {
          gifUrl: "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",
          description: podcast 
            ? `Estrategias de marketing profesional inspiradas en "${podcastTitle}" de ${podcastAuthor}. Crecimiento y métricas de ${podcastCategory}.`
            : "Estrategias de marketing y crecimiento profesional",
          title: podcast 
            ? `Marketing Estratégico: "${podcastTitle}"`
            : "Marketing Estratégico"
        },
        informativo: {
          gifUrl: "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif",
          description: podcast 
            ? `Dashboard de marketing y métricas del podcast "${podcastTitle}". Análisis de ${podcastCategory} por ${podcastAuthor}.`
            : "Dashboard de marketing y métricas",
          title: podcast 
            ? `Analytics de "${podcastTitle}"`
            : "Marketing Analytics"
        }
      },
      amigable: {
        educativos: {
          gifUrl: "https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif",
          description: podcast 
            ? `Aprendizaje de marketing divertido basado en "${podcastTitle}" de ${podcastAuthor}. Estrategias de ${podcastCategory} accesibles.`
            : "Aprendizaje de marketing divertido y accesible",
          title: podcast 
            ? `Marketing Fácil: "${podcastTitle}"`
            : "Marketing Fácil"
        }
      }
    },

    // Categoría: Tecnología
    tecnologia: {
      profesional: {
        educativos: {
          gifUrl: "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
          description: podcast 
            ? `Análisis tecnológico avanzado del podcast "${podcastTitle}" de ${podcastAuthor}. Insights sobre ${podcastCategory}.`
            : "Análisis tecnológico avanzado",
          title: podcast 
            ? `Tech Deep Dive: "${podcastTitle}"`
            : "Tech Analytics"
        },
        informativo: {
          gifUrl: "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",
          description: podcast 
            ? `Tendencias tecnológicas del podcast "${podcastTitle}". Innovación en ${podcastCategory} por ${podcastAuthor}.`
            : "Tendencias tecnológicas e innovación",
          title: podcast 
            ? `Innovación: "${podcastTitle}"`
            : "Tech Trends"
        }
      },
      energico: {
        educativos: {
          gifUrl: "https://media.giphy.com/media/xTiTnxpQ3ghPiB2Hp6/giphy.gif",
          description: podcast 
            ? `Tecnología explosiva del podcast "${podcastTitle}" de ${podcastAuthor}. Aprendizaje dinámico sobre ${podcastCategory}.`
            : "Tecnología explosiva y aprendizaje dinámico",
          title: podcast 
            ? `Tech Power: "${podcastTitle}"`
            : "Tech Power"
        }
      }
    },

    // Categoría: Emprendimiento
    emprendimiento: {
      profesional: {
        educativos: {
          gifUrl: "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",
          description: podcast 
            ? `Estrategias de emprendimiento del podcast "${podcastTitle}" de ${podcastAuthor}. Crecimiento empresarial en ${podcastCategory}.`
            : "Estrategias de emprendimiento y crecimiento",
          title: podcast 
            ? `Startup Strategy: "${podcastTitle}"`
            : "Startup Strategy"
        }
      },
      energico: {
        inspiracional: {
          gifUrl: "https://media.giphy.com/media/l1J9FiGxR61OcF2mI/giphy.gif",
          description: podcast 
            ? `Motivación emprendedora explosiva del podcast "${podcastTitle}" de ${podcastAuthor}. Inspiración para ${podcastCategory}.`
            : "Motivación emprendedora explosiva",
          title: podcast 
            ? `Entrepreneur Power: "${podcastTitle}"`
            : "Entrepreneur Power"
        }
      }
    },

    // Categoría: Otro (fallback genérico)
    otro: {
      profesional: {
        educativos: {
          gifUrl: "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif",
          description: podcast 
            ? `Análisis profesional del podcast "${podcastTitle}" de ${podcastAuthor}. Contenido educativo sobre ${podcastCategory}.`
            : "Análisis profesional de contenido",
          title: podcast 
            ? `Análisis Pro: "${podcastTitle}"`
            : "Análisis Profesional"
        },
        informativo: {
          gifUrl: "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
          description: podcast 
            ? `Información clave del podcast "${podcastTitle}". Datos importantes sobre ${podcastCategory} por ${podcastAuthor}.`
            : "Información y datos clave",
          title: podcast 
            ? `Info Key: "${podcastTitle}"`
            : "Información Clave"
        }
      },
      amigable: {
        educativos: {
          gifUrl: "https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif",
          description: podcast 
            ? `Aprendizaje amigable del podcast "${podcastTitle}" de ${podcastAuthor}. Contenido accesible sobre ${podcastCategory}.`
            : "Aprendizaje amigable y accesible",
          title: podcast 
            ? `Aprende Fácil: "${podcastTitle}"`
            : "Aprendizaje Fácil"
        },
        entretenimiento: {
          gifUrl: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif",
          description: podcast 
            ? `Entretenimiento basado en "${podcastTitle}" de ${podcastAuthor}. Diversión con contenido de ${podcastCategory}.`
            : "Entretenimiento y diversión",
          title: podcast 
            ? `Fun Content: "${podcastTitle}"`
            : "Contenido Divertido"
        }
      },
      casual: {
        educativos: {
          gifUrl: "https://media.giphy.com/media/l2Je66zG6mAAZxgqI/giphy.gif",
          description: podcast 
            ? `Tips casuales del podcast "${podcastTitle}" de ${podcastAuthor}. Aprendizaje relajado sobre ${podcastCategory}.`
            : "Tips casuales y aprendizaje relajado",
          title: podcast 
            ? `Tips Casual: "${podcastTitle}"`
            : "Tips Casuales"
        }
      },
      energico: {
        educativos: {
          gifUrl: "https://media.giphy.com/media/xTiTnxpQ3ghPiB2Hp6/giphy.gif",
          description: podcast 
            ? `Aprendizaje explosivo del podcast "${podcastTitle}" de ${podcastAuthor}. Energía pura sobre ${podcastCategory}.`
            : "Aprendizaje explosivo y dinámico",
          title: podcast 
            ? `Learn Power: "${podcastTitle}"`
            : "Aprendizaje Explosivo"
        },
        inspiracional: {
          gifUrl: "https://media.giphy.com/media/l1J9FiGxR61OcF2mI/giphy.gif",
          description: podcast 
            ? `Motivación explosiva del podcast "${podcastTitle}" de ${podcastAuthor}. Inspiración energética sobre ${podcastCategory}.`
            : "Motivación explosiva y energética",
          title: podcast 
            ? `Motivation Blast: "${podcastTitle}"`
            : "Motivación Explosiva"
        }
      }
    }
  };

  // Obtener la categoría del podcast o usar 'otro' como fallback
  const category = podcast?.category || 'otro';
  const categoryData = gifDatabase[category] || gifDatabase.otro;
  
  // Obtener el tono o usar 'amigable' como fallback
  const toneData = categoryData[tone] || categoryData.amigable || categoryData.profesional;
  
  // Obtener el estilo o usar el primero disponible
  const styleData = toneData[style] || toneData[Object.keys(toneData)[0]];

  // Fallback si no se encuentra nada
  const fallbackData = {
    gifUrl: "https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif",
    description: podcast 
      ? `Contenido dinámico del podcast "${podcastTitle}" de ${podcastAuthor} sobre ${podcastCategory}.`
      : "Contenido dinámico y engaging",
    title: podcast 
      ? `Contenido: "${podcastTitle}"`
      : "Contenido Dinámico"
  };

  const finalData = styleData || fallbackData;

  return {
    gifUrl: finalData.gifUrl,
    thumbnail: `https://picsum.photos/seed/${(podcast?.title || 'default').replace(/[^a-z0-9]/gi, '').toLowerCase()}/480/270`,
    description: finalData.description,
    title: finalData.title,
    duration: "3s",
    width: 480,
    height: 270,
    loop: true,
    tone: tone,
    style: style,
    podcastTitle: podcast?.title,
    podcastCategory: podcast?.category,
    podcastAuthor: podcast?.author
  };
}

function getContentTitle(type: ContentType, customData?: any): string {
  // Obtener información del podcast si está disponible
  const selectedPodcast = usePodcastStore.getState().selectedPodcast;
  
  if (selectedPodcast) {
    const podcastTitle = selectedPodcast.title;
    const podcastCategory = selectedPodcast.category;
    const podcastAuthor = selectedPodcast.author || 'Creador';
    
    // Títulos específicos del podcast por tipo de contenido
    const podcastTitles: Record<ContentType, string> = {
      texto: `Publicación sobre "${podcastTitle}" - Insights de ${podcastCategory}`,
      imagenes: `Carousel: "${podcastTitle}" por ${podcastAuthor}`,
      videos: `Video: Análisis de "${podcastTitle}" - ${podcastCategory}`,
      gif: customData?.title || `GIF: "${podcastTitle}" - Contenido Dinámico`,
      infografias: customData?.title || `Infografía: Datos Clave de "${podcastTitle}"`,
      presentaciones: `Presentación: "${podcastTitle}" - Estrategias de ${podcastCategory}`
    };
    
    return podcastTitles[type];
  }
  
  // Títulos genéricos si no hay podcast seleccionado
  if (type === 'gif' && customData?.title) {
    return `GIF Animado: ${customData.title}`;
  }
  
  if (type === 'infografias' && customData?.title) {
    return customData.title;
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

// Helper: obtener URLs aleatorias de imágenes estables basadas en un término de búsqueda
function getUnsplashImages(query: string, count: number = 3, width:number=800, height:number=600): string[] {
  // Usar Picsum Photos con seeds específicos basados en el query para URLs estables
  const seedBase = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  return Array.from({ length: count }, (_, idx) => {
    const seed = `${seedBase}${idx}`;
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
  });
}

// Fallback en caso de que alguna imagen no cargue (usado desde el frontend si es necesario)
export const getFallbackImage = (idx:number, width:number=800, height:number=600) => `https://picsum.photos/seed/fallback-${idx}/${width}/${height}`;

// Helper: deducir término del podcast o usar fallback
function getPodcastTopic(): string {
  const selectedPodcast = usePodcastStore.getState().selectedPodcast;
  if (selectedPodcast) {
    return selectedPodcast.category || selectedPodcast.title || 'podcast';
  }
  return 'podcast';
}

// Mapeo de imágenes estáticas de Picsum por tema para garantizar funcionamiento
const topicStockImages: Record<string, string[]> = {
  tecnologia: [
    'https://picsum.photos/seed/tech1/800/600',
    'https://picsum.photos/seed/tech2/800/600',
    'https://picsum.photos/seed/tech3/800/600',
    'https://picsum.photos/seed/tech4/800/600',
    'https://picsum.photos/seed/tech5/800/600',
  ],
  marketing: [
    'https://picsum.photos/seed/marketing1/800/600',
    'https://picsum.photos/seed/marketing2/800/600',
    'https://picsum.photos/seed/marketing3/800/600',
    'https://picsum.photos/seed/marketing4/800/600',
    'https://picsum.photos/seed/marketing5/800/600',
  ],
  negocios: [
    'https://picsum.photos/seed/business1/800/600',
    'https://picsum.photos/seed/business2/800/600',
    'https://picsum.photos/seed/business3/800/600',
    'https://picsum.photos/seed/business4/800/600',
    'https://picsum.photos/seed/business5/800/600',
  ],
  emprendimiento: [
    'https://picsum.photos/seed/startup1/800/600',
    'https://picsum.photos/seed/startup2/800/600',
    'https://picsum.photos/seed/startup3/800/600',
    'https://picsum.photos/seed/startup4/800/600',
    'https://picsum.photos/seed/startup5/800/600',
  ],
  entretenimiento: [
    'https://picsum.photos/seed/entertainment1/800/600',
    'https://picsum.photos/seed/entertainment2/800/600',
    'https://picsum.photos/seed/entertainment3/800/600',
    'https://picsum.photos/seed/entertainment4/800/600',
    'https://picsum.photos/seed/entertainment5/800/600',
  ],
  sociedad: [
    'https://picsum.photos/seed/society1/800/600',
    'https://picsum.photos/seed/society2/800/600',
    'https://picsum.photos/seed/society3/800/600',
    'https://picsum.photos/seed/society4/800/600',
    'https://picsum.photos/seed/society5/800/600',
  ],
  otro: [
    'https://picsum.photos/seed/other1/800/600',
    'https://picsum.photos/seed/other2/800/600',
    'https://picsum.photos/seed/other3/800/600',
    'https://picsum.photos/seed/other4/800/600',
    'https://picsum.photos/seed/other5/800/600',
  ],
  podcast: [
    'https://picsum.photos/seed/podcast1/800/600',
    'https://picsum.photos/seed/podcast2/800/600',
    'https://picsum.photos/seed/podcast3/800/600',
    'https://picsum.photos/seed/podcast4/800/600',
    'https://picsum.photos/seed/podcast5/800/600',
  ],
};

function getStockImagesByTopic(topic: string, count = 5, width=800, height=600): string[] {
  const key = topic.toLowerCase();
  
  // Buscar coincidencia exacta primero
  if (topicStockImages[key]) {
    return topicStockImages[key]
      .slice(0, count)
      .map(url => url.replace('/800/600', `/${width}/${height}`));
  }
  
  // Buscar coincidencia parcial en las palabras clave
  for (const topicKey of Object.keys(topicStockImages)) {
    if (topic.toLowerCase().includes(topicKey) || topicKey.includes(topic.toLowerCase())) {
      return topicStockImages[topicKey]
        .slice(0, count)
        .map(url => url.replace('/800/600', `/${width}/${height}`));
    }
  }
  
  // Fallback a 'otro' si no se encuentra coincidencia
  return topicStockImages.otro
    .slice(0, count)
    .map(url => url.replace('/800/600', `/${width}/${height}`));
} 