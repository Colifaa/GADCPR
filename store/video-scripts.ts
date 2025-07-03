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
  podcastId?: string;
  podcastTitle?: string;
  category?: string;
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
    tone: 'educativo',
    style: 'tutorial',
    focus: 'consejos',
    duration: '3:00',
    createdAt: new Date('2024-01-15'),
    status: 'completed',
    podcastId: '5',
    podcastTitle: 'Inteligencia Artificial y el Futuro',
    category: 'tecnologia'
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
    style: 'tendencias',
    focus: 'estadisticas',
    duration: '4:30',
    createdAt: new Date('2024-01-20'),
    status: 'published',
    podcastId: '2',
    podcastTitle: 'Marketing Digital Avanzado',
    category: 'marketing'
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
    style: 'top-lista',
    focus: 'reaction',
    duration: '4:00',
    createdAt: new Date('2024-01-18'),
    status: 'draft',
    podcastId: '10',
    podcastTitle: 'Humor en la Red',
    category: 'entretenimiento'
  },
  {
    id: '4',
    title: 'Caso de Estudio: Startup que Facturó $1M en 6 Meses',
    content: `[HOOK - 0:00-0:20]
¿Cómo una startup sin experiencia logró facturar un millón de dólares en solo 6 meses?

[CASO REAL - 0:20-5:30]
🏆 Caso de éxito: TechFlow Solutions
💎 Lección: Validación temprana del producto
🎯 Aprendizaje: Enfoque en retención sobre adquisición
📊 Dato: 400% de crecimiento mensual

[ANÁLISIS - 5:30-6:30]
Los factores clave que permitieron este éxito extraordinario y cómo puedes aplicarlos.

[RECURSOS - 6:30-7:00]
Descarga el framework completo en el enlace de la descripción.`,
    tone: 'emprendedor',
    style: 'caso-estudio',
    focus: 'casos-exito',
    duration: '7:00',
    createdAt: new Date('2024-01-22'),
    status: 'completed',
    podcastId: '7',
    podcastTitle: 'Emprendimiento Sin Límites',
    category: 'negocios'
  },
  {
    id: '5',
    title: 'Reflexión: El Futuro del Trabajo Remoto',
    content: `[INTRODUCCIÓN CONTEMPLATIVA - 0:00-0:30]
En un espacio de reflexión, hablemos del futuro del trabajo remoto y lo que significa para nuestra sociedad.

[REFLEXIÓN - 0:30-4:00]
🤔 Opinión: La humanización del trabajo a distancia
💭 Reflexión: ¿Estamos perdiendo la conexión humana?
🔍 Dato clave: 73% de los trabajadores prefieren híbrido
⚡ Revelación: Las oficinas están evolucionando, no desapareciendo

[CONTEMPLACIÓN - 4:00-4:30]
¿Cómo podemos mantener la humanidad en un mundo digital?`,
    tone: 'reflexivo',
    style: 'opinion',
    focus: 'insights',
    duration: '4:30',
    createdAt: new Date('2024-01-25'),
    status: 'completed',
    podcastId: '3',
    podcastTitle: 'Reflexiones Contemporáneas',
    category: 'sociedad'
  },
  {
    id: '6',
    title: 'Debate: ¿La IA Reemplazará a los Creativos?',
    content: `[PLANTEAMIENTO - 0:00-0:30]
¡Prepárate! Vamos a explorar uno de los debates más candentes: ¿La IA reemplazará a los creativos?

[ARGUMENTOS - 0:30-4:30]
🔥 Controversia: Diseñadores vs. IA generativa
💥 Polémica: ¿Creatividad artificial o herramienta?
⚡ Debate: Perspectivas de profesionales
🤯 Punto caliente: El futuro de las agencias

[PERSPECTIVAS - 4:30-5:30]
Examinemos diferentes puntos de vista sobre este tema polémico.

[CONCLUSIÓN - 5:30-6:00]
La respuesta puede sorprenderte.`,
    tone: 'dinamico',
    style: 'debate',
    focus: 'controversias',
    duration: '6:00',
    createdAt: new Date('2024-01-28'),
    status: 'published',
    podcastId: '8',
    podcastTitle: 'Debates Actuales',
    category: 'tecnologia'
  },
  {
    id: '7',
    title: 'Testimonios: Historias de Transformación Digital',
    content: `[INTRODUCCIÓN - 0:00-0:20]
Escucharemos experiencias reales de personas que han vivido la transformación digital.

[TESTIMONIOS - 0:20-4:00]
👥 Testimonio: María, CEO de TechCorp
💬 Opinión real: "La transformación cambió todo"
🗣️ Experiencia: Juan, desarrollador freelance
⭐ Reseña: "Duplicamos ingresos en 8 meses"

[ANÁLISIS - 4:00-4:30]
Conectaremos estos testimonios con lecciones aplicables para tu negocio.`,
    tone: 'inspirador',
    style: 'experiencia',
    focus: 'testimonios',
    duration: '4:30',
    createdAt: new Date('2024-01-30'),
    status: 'completed',
    podcastId: '9',
    podcastTitle: 'Historias de Éxito',
    category: 'negocios'
  },
  {
    id: '8',
    title: 'Herramientas: Top 10 Apps de Productividad 2024',
    content: `[GANCHO - 0:00-0:15]
¡Súbele al volumen! Porque vamos a hablar de las 10 herramientas que revolucionarán tu productividad.

[RANKING - 0:15-4:00]
🏆 Top 10: Las mejores aplicaciones
🛠️ Herramienta: Notion - Organización total
⚙️ Tool: Obsidian - Gestión de conocimiento
🔧 Aplicación: Todoist - Tareas inteligentes
💻 Software: Grammarly - Escritura profesional

[TUTORIAL RÁPIDO - 4:00-4:45]
Veremos tutoriales rápidos de las aplicaciones más útiles.

[CONCLUSIÓN - 4:45-5:00]
Links de descarga en la descripción.`,
    tone: 'energico',
    style: 'top-lista',
    focus: 'herramientas',
    duration: '5:00',
    createdAt: new Date('2024-02-01'),
    status: 'published',
    podcastId: '11',
    podcastTitle: 'Productividad Máxima',
    category: 'tecnologia'
  },
  {
    id: '9',
    title: 'Reseña: Análisis Completo del Nuevo iPhone',
    content: `[INTRO - 0:00-0:20]
Desde una perspectiva profesional, examinamos el nuevo iPhone tras 30 días de uso intensivo.

[EVALUACIÓN - 0:20-3:30]
⭐ Reseña crítica: Diseño y construcción
📝 Valoración: Rendimiento vs. competencia
⚖️ Análisis comparativo: iPhone 15 vs. Galaxy S24
🔍 Veredicto: ¿Vale la pena el upgrade?

[CONCLUSIÓN - 3:30-4:00]
Nuestra recomendación final basada en datos y experiencia real.`,
    tone: 'analitico',
    style: 'reseña',
    focus: 'recursos',
    duration: '4:00',
    createdAt: new Date('2024-02-03'),
    status: 'completed',
    podcastId: '12',
    podcastTitle: 'Tech Reviews',
    category: 'tecnologia'
  },
  {
    id: '10',
    title: 'Predicciones: El Futuro del E-commerce en 2025',
    content: `[SETUP - 0:00-0:30]
Con datos y evidencia, exploramos las predicciones más probables para el e-commerce.

[PROYECCIONES - 0:30-4:30]
🔮 Predicciones 2025: Comercio conversacional
📈 Proyección: IA en customer service
🎯 Escenario: Realidad aumentada en compras
📊 Estadística: 85% de compras serán online

[METODOLOGÍA - 4:30-5:30]
Desglosaremos cada paso del proceso de análisis predictivo.

[RECOMENDACIONES - 5:30-6:00]
Cómo preparar tu negocio para estos cambios.`,
    tone: 'profesional',
    style: 'predicciones',
    focus: 'metodologia',
    duration: '6:00',
    createdAt: new Date('2024-02-05'),
    status: 'completed',
    podcastId: '13',
    podcastTitle: 'Futuro Digital',
    category: 'negocios'
  },
  {
    id: '11',
    title: 'Humor: Los Errores Más Divertidos de la IA',
    content: `[INTRO DIVERTIDA - 0:00-0:20]
Con una sonrisa (y algunos chistes), hablemos de los errores más graciosos de la inteligencia artificial.

[COMPILACIÓN - 0:20-3:20]
😂 IA intenta escribir poesía romántica
🤣 ChatGPT explica cómo hacer agua
😅 Dall-E dibuja "gatos con sombrero"
🎭 Los fails más épicos de 2024

[REFLEXIÓN CON HUMOR - 3:20-4:00]
Con gracia y sabiduría, exploremos por qué estos errores son valiosos.

[CIERRE - 4:00-4:30]
Diversión educativa garantizada. ¡Comparte tus propios fails con IA!`,
    tone: 'humoristico',
    style: 'storytelling',
    focus: 'behind-scenes',
    duration: '4:30',
    createdAt: new Date('2024-02-07'),
    status: 'published',
    podcastId: '14',
    podcastTitle: 'Tech & Humor',
    category: 'entretenimiento'
  },
  {
    id: '12',
    title: 'Comparación: Netflix vs. Disney+ vs. Prime Video',
    content: `[INTRODUCCIÓN - 0:00-0:30]
Charla informal pero valiosa sobre las tres plataformas de streaming más populares.

[CARA A CARA - 0:30-4:00]
⚖️ Análisis comparativo: Catálogo de contenido
📊 Versus: Precio vs. valor
🔍 Comparativa: Calidad de video y audio
⭐ Veredicto: ¿Cuál es la mejor para ti?

[RECOMENDACIÓN - 4:00-4:30]
Basándonos en diferentes perfiles de usuario, aquí nuestras sugerencias.`,
    tone: 'casual',
    style: 'comparacion',
    focus: 'recursos',
    duration: '4:30',
    createdAt: new Date('2024-02-10'),
    status: 'completed',
    podcastId: '15',
    podcastTitle: 'Streaming Wars',
    category: 'entretenimiento'
  },
  {
    id: '13',
    title: 'Entrevista: Secretos de una Startup Unicornio',
    content: `[PRESENTACIÓN - 0:00-0:30]
Prepárate para transformar tu visión del emprendimiento con nuestra invitada especial.

[CONVERSACIÓN - 0:30-6:00]
🎤 Entrevista: Ana Martínez, CEO de UnicornTech
💬 Diálogo: "Cómo alcanzamos la valoración de $1B"
🗣️ Testimonios: Los momentos más difíciles
📸 Making of: Historia detrás del éxito

[TAKEAWAYS - 6:00-7:00]
✅ Takeaway: Perseverancia ante el fracaso
💎 Lección: Importancia del timing
🎯 Aprendizaje: Construir el equipo correcto

[CIERRE - 7:00-7:30]
Gracias por ser parte de esta comunidad de emprendedores.`,
    tone: 'inspirador',
    style: 'entrevista',
    focus: 'takeaways',
    duration: '7:30',
    createdAt: new Date('2024-02-12'),
    status: 'published',
    podcastId: '16',
    podcastTitle: 'Conversaciones de Valor',
    category: 'negocios'
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