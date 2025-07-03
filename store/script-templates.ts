import { create } from 'zustand'

export type ToneKey = 'conversacional' | 'profesional' | 'dinamico' | 'educativo' | 'entretenido' | 'inspirador' | 'analitico' | 'casual' | 'energico' | 'reflexivo' | 'humoristico' | 'emprendedor'

export type StyleKey = 'resumen' | 'storytelling' | 'analisis' | 'tutorial' | 'debate' | 'entrevista' | 'reseña' | 'opinion' | 'caso-estudio' | 'top-lista' | 'comparacion' | 'experiencia' | 'tendencias' | 'predicciones'

export type FocusKey = 'insights' | 'quotes' | 'takeaways' | 'behind-scenes' | 'reaction' | 'extension' | 'estadisticas' | 'consejos' | 'recursos' | 'herramientas' | 'testimonios' | 'controversias' | 'metodologia' | 'casos-exito'

interface ScriptTemplateState {
  introTemplates: Record<ToneKey, string[]>
  headerTemplates: Record<StyleKey, string[]>
  bulletPrefixes: Record<FocusKey, string[]>
  focusDetails: Record<FocusKey, string[]>
  closingTemplates: string[]
}

const initialState: ScriptTemplateState = {
  introTemplates: {
    conversacional: [
      '¡Hola! Hoy conversamos relajadamente sobre',
      'Bienvenidos a una charla entre amigos acerca de',
      '¿Listos para platicar sobre',
      'Tomemos un café virtual y hablemos de',
      'Como siempre, sin filtros, vamos a hablar de',
      'Ponte cómodo que hoy exploramos'
    ],
    profesional: [
      'En la edición de hoy abordamos en profundidad',
      'Analicemos detenidamente',
      'Presentamos un informe detallado sobre',
      'Desde una perspectiva profesional, examinamos',
      'Con datos y evidencia, exploramos',
      'En el contexto actual del mercado, analizamos'
    ],
    dinamico: [
      '¡Atención! Estos son los puntos más 🔥 sobre',
      'No parpadees: aquí vienen las claves de',
      '¡Rápido y conciso! Todo lo que necesitas saber sobre',
      '¡Prepárate! Vamos a desglosar',
      'Sin rodeos: esto es lo que debes saber sobre',
      '¡Boom! Los datos más impactantes sobre'
    ],
    educativo: [
      'Bienvenidos a esta clase express acerca de',
      'Preparen sus apuntes para aprender sobre',
      'Hoy desglosamos paso a paso',
      'En esta lección práctica veremos',
      'Desde lo básico hasta lo avanzado en',
      'Para entender completamente, empecemos con'
    ],
    entretenido: [
      'Prepárate para divertirte mientras descubrimos',
      '¡Diversión garantizada! Hoy hablaremos de',
      'Entre risas y datos curiosos, exploramos',
      'Con humor y buena onda, vamos a ver',
      'Relajate que esto va a estar bueno:',
      'Episodio especial lleno de sorpresas sobre'
    ],
    inspirador: [
      'Hoy vamos a elevar tu perspectiva sobre',
      'Prepárate para transformar tu visión de',
      'Este episodio va a cambiar tu forma de ver',
      'Inspirémonos juntos hablando de',
      'Una conversación que puede cambiar tu vida acerca de',
      'Descubre el poder transformador de'
    ],
    analitico: [
      'Desmembrando los datos, analizamos',
      'Con lupa y detalle, examinamos',
      'Bajo el microscopio: diseccionamos',
      'Desde múltiples ángulos, estudiamos',
      'Con metodología rigurosa, exploramos',
      'Basándonos en investigación, analizamos'
    ],
    casual: [
      'Hoy en plan relajado hablamos de',
      'Sin tanto protocolo, veamos',
      'Charla informal pero valiosa sobre',
      'En modo chill, exploramos',
      'Simplemente conversando acerca de',
      'De tú a tú, hablemos de'
    ],
    energico: [
      '¡Con toda la energía! Vamos a explorar',
      '¡Arrancamos con fuerza hablando de',
      '¡Súbele al volumen! Porque vamos a hablar de',
      '¡Energía al máximo! Descubramos',
      '¡Vamos con todo! En este episodio sobre',
      '¡Explosión de contenido! Todo sobre'
    ],
    reflexivo: [
      'Tomemos un momento para reflexionar sobre',
      'En una pausa contemplativa, examinemos',
      'Desde la introspección, exploremos',
      'Con calma y profundidad, meditemos sobre',
      'En un espacio de reflexión, hablemos de',
      'Pausadamente, pero con profundidad, sobre'
    ],
    humoristico: [
      'Con una sonrisa (y algunos chistes), hablemos de',
      'Entre carcajadas, vamos a ver',
      'Con humor, pero sin perder la seriedad, sobre',
      'Riéndonos un poco, pero aprendiendo mucho de',
      'Con gracia y sabiduría, exploremos',
      'Diversión educativa garantizada hablando de'
    ],
    emprendedor: [
      'Desde la mentalidad emprendedora, analicemos',
      'Con visión de negocio, exploremos',
      'Pensando como CEO, veamos',
      'Con mentalidad disruptiva, hablemos de',
      'Desde el ecosistema startup, analizamos',
      'Con espíritu innovador, descubramos'
    ]
  },
  headerTemplates: {
    resumen: ['[RESUMEN EJECUTIVO]', '[PUNTOS CLAVE]', '[SÍNTESIS PRINCIPAL]'],
    storytelling: ['[HISTORIA]', '[NARRATIVA]', '[RELATO]', '[EXPERIENCIA]'],
    analisis: ['[ANÁLISIS DETALLADO]', '[EXAMEN A FONDO]', '[INVESTIGACIÓN]', '[DIAGNÓSTICO]'],
    tutorial: ['[PASO A PASO]', '[GUÍA RÁPIDA]', '[INSTRUCCIONES]', '[METODOLOGÍA]'],
    debate: ['[PUNTOS DE VISTA]', '[MESA REDONDA]', '[PERSPECTIVAS]', '[ARGUMENTOS]'],
    entrevista: ['[ENTREVISTA]', '[CONVERSACIÓN]', '[DIÁLOGO]', '[TESTIMONIOS]'],
    reseña: ['[RESEÑA CRÍTICA]', '[EVALUACIÓN]', '[VALORACIÓN]', '[VEREDICTO]'],
    opinion: ['[OPINIÓN PERSONAL]', '[PUNTO DE VISTA]', '[REFLEXIÓN]', '[POSICIÓN]'],
    'caso-estudio': ['[CASO DE ESTUDIO]', '[ANÁLISIS DE CASO]', '[EJEMPLO PRÁCTICO]', '[CASO REAL]'],
    'top-lista': ['[TOP 10]', '[RANKING]', '[LISTA DEFINITIVA]', '[MEJORES OPCIONES]'],
    comparacion: ['[COMPARATIVA]', '[CARA A CARA]', '[VERSUS]', '[ANÁLISIS COMPARATIVO]'],
    experiencia: ['[EXPERIENCIA PERSONAL]', '[VIVENCIA]', '[TESTIMONIO]', '[JOURNEY]'],
    tendencias: ['[TENDENCIAS ACTUALES]', '[FUTURO DEL SECTOR]', '[EVOLUCIÓN]', '[PREDICCIONES]'],
    predicciones: ['[PREDICCIONES 2024]', '[FUTURO PRÓXIMO]', '[PROYECCIONES]', '[ESCENARIOS]']
  },
  bulletPrefixes: {
    insights: ['💡 Insight', '🔍 Dato clave', '⚡ Revelación', '🎯 Punto crucial'],
    quotes: ['💬 Cita textual', '📢 Frase destacada', '🗣️ Declaración', '📝 Palabras exactas'],
    takeaways: ['✅ Takeaway', '📌 Conclusión', '🎯 Aprendizaje', '💎 Lección'],
    'behind-scenes': ['🎬 Detrás de escena', '📽️ Backstage', '🎭 Entre bambalinas', '📸 Making of'],
    reaction: ['😮 Reacción', '🤔 Opinión', '💭 Reflexión', '🔥 Respuesta'],
    extension: ['🔄 Extensión', '➕ Profundiza', '🔗 Conexión', '📚 Más información'],
    estadisticas: ['📊 Estadística', '📈 Dato', '🔢 Número', '📉 Métrica'],
    consejos: ['💡 Consejo', '🎯 Tip', '🚀 Recomendación', '⭐ Sugerencia'],
    recursos: ['🔗 Recurso', '📚 Herramienta', '🛠️ Utilidad', '📖 Referencia'],
    herramientas: ['🛠️ Herramienta', '⚙️ Tool', '🔧 Aplicación', '💻 Software'],
    testimonios: ['👥 Testimonio', '🗣️ Experiencia', '💬 Opinión real', '⭐ Reseña'],
    controversias: ['🔥 Controversia', '⚡ Debate', '💥 Polémica', '🤯 Punto caliente'],
    metodologia: ['📋 Metodología', '🎯 Proceso', '📝 Framework', '🔄 Sistema'],
    'casos-exito': ['🏆 Caso de éxito', '🎉 Historia de éxito', '💪 Logro', '🌟 Ejemplo ganador']
  },
  focusDetails: {
    insights: [
      'Analizaremos por qué estos insights son relevantes y cómo aplicarlos.',
      'Profundizaremos en las implicaciones de cada descubrimiento.',
      'Veremos cómo estos hallazgos pueden transformar tu perspectiva.',
      'Exploraremos el impacto real de estos insights en el sector.'
    ],
    quotes: [
      'Repasemos el contexto de cada cita y su impacto en la audiencia.',
      'Analizaremos las frases más memorables y su significado profundo.',
      'Desglosaremos las declaraciones más impactantes del episodio.',
      'Examinaremos las palabras que han generado más conversación.'
    ],
    takeaways: [
      'A continuación, cómo puedes poner en práctica cada takeaway.',
      'Veremos cómo implementar estas lecciones en tu día a día.',
      'Transformaremos estos aprendizajes en acciones concretas.',
      'Aplicaremos estos conocimientos a situaciones reales.'
    ],
    'behind-scenes': [
      'Te cuento la historia detrás de la producción y curiosidades.',
      'Descubrirás los secretos de cómo se creó este contenido.',
      'Revelaremos los momentos no mostrados del episodio.',
      'Conocerás el proceso creativo detrás de cada decisión.'
    ],
    reaction: [
      'Aquí mi opinión personal y reacciones del público.',
      'Analizaremos las respuestas más interesantes de la audiencia.',
      'Exploraremos diferentes perspectivas sobre el tema.',
      'Veremos cómo ha reaccionado la comunidad ante este contenido.'
    ],
    extension: [
      'Profundicemos con recursos y pasos adicionales para continuar aprendiendo.',
      'Expandiremos el tema con información complementaria.',
      'Conectaremos este contenido con otros episodios relacionados.',
      'Exploraremos las ramificaciones de este tema en profundidad.'
    ],
    estadisticas: [
      'Desglosaremos los números más impactantes y su significado.',
      'Analizaremos las tendencias reflejadas en estos datos.',
      'Contextualizaremos estas cifras dentro del panorama general.',
      'Veremos cómo interpretar correctamente estas estadísticas.'
    ],
    consejos: [
      'Aplicaremos estos consejos paso a paso en situaciones reales.',
      'Veremos ejemplos prácticos de cómo implementar cada sugerencia.',
      'Transformaremos estos tips en hábitos actionables.',
      'Personalizaremos estos consejos según diferentes contextos.'
    ],
    recursos: [
      'Exploraremos cada recurso y cómo maximizar su utilidad.',
      'Te guiaré para aprovechar al máximo estas herramientas.',
      'Veremos casos de uso específicos para cada recurso.',
      'Compararemos diferentes opciones y sus ventajas.'
    ],
    herramientas: [
      'Analizaremos las mejores herramientas para cada necesidad.',
      'Veremos tutoriales rápidos de las aplicaciones más útiles.',
      'Compararemos funcionalidades y precios de cada opción.',
      'Descubriremos herramientas gratuitas que pueden transformar tu trabajo.'
    ],
    testimonios: [
      'Escucharemos experiencias reales de personas que han vivido esto.',
      'Analizaremos diferentes perspectivas de usuarios reales.',
      'Veremos casos de éxito y también fracasos instructivos.',
      'Conectaremos estos testimonios con lecciones aplicables.'
    ],
    controversias: [
      'Examinaremos diferentes puntos de vista sobre este tema polémico.',
      'Analizaremos los argumentos de cada lado del debate.',
      'Exploraremos por qué este tema genera tanta discusión.',
      'Buscaremos puntos de encuentro entre posiciones opuestas.'
    ],
    metodologia: [
      'Desglosaremos cada paso del proceso de manera detallada.',
      'Veremos cómo adaptar esta metodología a diferentes contextos.',
      'Analizaremos los fundamentos teóricos detrás de cada técnica.',
      'Exploraremos variaciones y mejoras del método original.'
    ],
    'casos-exito': [
      'Analizaremos qué factores contribuyeron a estos éxitos.',
      'Extraeremos lecciones aplicables de cada historia de éxito.',
      'Veremos cómo replicar estos resultados en otros contextos.',
      'Identificaremos patrones comunes en estos casos ganadores.'
    ]
  },
  closingTemplates: [
    'Déjame tu opinión y suscríbete para más contenido relacionado.',
    'Si te gustó, comparte y únete para próximos episodios.',
    'Comenta qué te pareció y no olvides seguirnos.',
    'Cuéntanos tu experiencia con este tema en los comentarios.',
    'Comparte este video si crees que puede ayudar a alguien más.',
    'Déjanos saber qué otros temas te gustaría que cubramos.',
    'Tu feedback nos ayuda a crear mejor contenido para ti.',
    'Únete a la conversación y comparte tus insights.',
    'No te pierdas el próximo episodio donde hablaremos de...',
    'Mantente conectado para más contenido de valor como este.',
    'Gracias por ser parte de esta comunidad de aprendizaje.',
    'Nos vemos en el próximo video con más contenido impactante.'
  ]
}

export const useScriptTemplateStore = create<ScriptTemplateState>(() => initialState) 