import { create } from 'zustand';

export interface PodcastMetrics {
  totalListeners: number;
  averageDuration: string;
  engagementRate: number;
  retentionRate: number;
  downloadCount: number;
  shareCount: number;
  subscriptionRate: number;
  reviewsCount: number;
  averageRating: number;
}

export interface SentimentAnalysis {
  positive: number;
  neutral: number;
  negative: number;
  overallSentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
}

export interface TopicAnalysis {
  id: string;
  name: string;
  relevance: number;
  frequency: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
}

export interface AudienceSegment {
  ageGroup: string;
  percentage: number;
  engagement: number;
  preferredTopics: string[];
}

export interface ContentRecommendation {
  id: string;
  type: 'topic' | 'format' | 'timing' | 'style';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  expectedImpact: number;
}

export interface CompetitorAnalysis {
  name: string;
  category: string;
  followers: number;
  avgRating: number;
  topTopics: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface PodcastAnalysisData {
  id: string;
  podcastId: string;
  title: string;
  creator: string;
  network: string;
  genre: string;
  theme: string;
  subtheme: string;
  duration: string;
  description: string;
  analysisDate: string;
  status: 'analyzing' | 'completed' | 'error';
  
  // Métricas principales
  metrics: PodcastMetrics;
  
  // Análisis de sentimientos
  sentimentAnalysis: SentimentAnalysis;
  
  // Análisis de temas
  topicAnalysis: TopicAnalysis[];
  
  // Segmentación de audiencia
  audienceSegments: AudienceSegment[];
  
  // Recomendaciones de contenido
  contentRecommendations: ContentRecommendation[];
  
  // Análisis competitivo
  competitorAnalysis: CompetitorAnalysis[];
  
  // Tendencias temporales
  trends: {
    listenership: { month: string; count: number }[];
    engagement: { month: string; rate: number }[];
    topTopics: { month: string; topics: string[] }[];
  };
  
  // Palabras clave principales
  keywords: string[];
  
  // Score general
  overallScore: number;
  
  // Insights y hallazgos clave
  keyInsights: string[];
  
  // Puntos fuertes y áreas de mejora
  strengths: string[];
  areasForImprovement: string[];
}

interface PodcastAnalysisState {
  // Estado principal
  currentAnalysis: PodcastAnalysisData | null;
  analysisHistory: PodcastAnalysisData[];
  isAnalyzing: boolean;
  analysisProgress: number;
  error: string | null;
  
  // Filtros y configuración
  selectedTimeRange: '7d' | '30d' | '90d' | '1y';
  selectedMetrics: string[];
  
  // Acciones
  setCurrentAnalysis: (analysis: PodcastAnalysisData | null) => void;
  addAnalysisToHistory: (analysis: PodcastAnalysisData) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setAnalysisProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  setSelectedTimeRange: (range: '7d' | '30d' | '90d' | '1y') => void;
  setSelectedMetrics: (metrics: string[]) => void;
  
  // Funciones de análisis
  startAnalysis: (podcastId: string, podcastData: any) => Promise<void>;
  generateMockAnalysis: (podcastId: string, podcastData: any) => PodcastAnalysisData;
  getAnalysisByPodcastId: (podcastId: string) => PodcastAnalysisData | null;
  clearAnalysis: () => void;
}

// Datos mock para diferentes categorías de podcasts
const getMockDataByCategory = (category: string, podcastData: any) => {
  const baseMetrics = {
    totalListeners: Math.floor(Math.random() * 50000) + 10000,
    averageDuration: podcastData.episodes?.[0]?.duration || '45:30',
    engagementRate: Math.floor(Math.random() * 30) + 60,
    retentionRate: Math.floor(Math.random() * 20) + 70,
    downloadCount: Math.floor(Math.random() * 100000) + 25000,
    shareCount: Math.floor(Math.random() * 5000) + 1000,
    subscriptionRate: Math.floor(Math.random() * 15) + 10,
    reviewsCount: podcastData.totalReviews || Math.floor(Math.random() * 200) + 50,
    averageRating: podcastData.rating || (Math.random() * 1.5 + 3.5)
  };

  const categorySpecificData = {
    marketing: {
      topics: [
        { id: '1', name: 'Marketing Digital', relevance: 95, frequency: 87, sentiment: 'positive' as const, keywords: ['SEO', 'Redes Sociales', 'Email Marketing', 'Conversión'] },
        { id: '2', name: 'Estrategias de Crecimiento', relevance: 88, frequency: 72, sentiment: 'positive' as const, keywords: ['Growth Hacking', 'Métricas', 'ROI', 'KPIs'] },
        { id: '3', name: 'Análisis de Audiencia', relevance: 82, frequency: 65, sentiment: 'neutral' as const, keywords: ['Segmentación', 'Personas', 'Comportamiento'] },
        { id: '4', name: 'Tendencias del Sector', relevance: 75, frequency: 58, sentiment: 'positive' as const, keywords: ['Innovación', 'Tecnología', 'Futuro'] }
      ],
      insights: [
        'El enfoque en marketing digital genera 40% más engagement que temas generales',
        'Los episodios sobre ROI y métricas tienen la mayor tasa de retención (85%)',
        'La audiencia prefiere ejemplos prácticos y casos de estudio reales',
        'Las estrategias de growth hacking son el tema más compartido en redes sociales'
      ],
      strengths: [
        'Contenido altamente especializado y práctico',
        'Excelente estructura narrativa con casos reales',
        'Invitados expertos con credibilidad en el sector',
        'Actualizaciones frecuentes sobre tendencias del mercado'
      ],
      improvements: [
        'Incluir más ejemplos de pequeñas empresas',
        'Expandir contenido sobre marketing offline',
        'Agregar episodios más cortos para audiencia móvil',
        'Mejorar la interacción con la comunidad en redes sociales'
      ]
    },
    tecnologia: {
      topics: [
        { id: '1', name: 'Inteligencia Artificial', relevance: 92, frequency: 78, sentiment: 'positive' as const, keywords: ['Machine Learning', 'AI', 'Automatización', 'Algoritmos'] },
        { id: '2', name: 'Desarrollo de Software', relevance: 85, frequency: 70, sentiment: 'neutral' as const, keywords: ['Programación', 'Frameworks', 'DevOps', 'Testing'] },
        { id: '3', name: 'Ciberseguridad', relevance: 80, frequency: 62, sentiment: 'negative' as const, keywords: ['Seguridad', 'Hacking', 'Privacidad', 'Vulnerabilidades'] },
        { id: '4', name: 'Startups Tech', relevance: 77, frequency: 55, sentiment: 'positive' as const, keywords: ['Innovación', 'Inversión', 'Escalabilidad', 'Disruption'] }
      ],
      insights: [
        'Los temas de IA generan 60% más interacciones que otros temas tecnológicos',
        'La audiencia técnica valora la profundidad sobre la amplitud del contenido',
        'Los episodios sobre ciberseguridad tienen alta retención pero baja satisfacción',
        'Las entrevistas con fundadores de startups tech son las más compartidas'
      ],
      strengths: [
        'Cobertura exhaustiva de tecnologías emergentes',
        'Análisis técnico profundo y bien fundamentado',
        'Red sólida de expertos e invitados de la industria',
        'Anticipación efectiva de tendencias tecnológicas'
      ],
      improvements: [
        'Simplificar conceptos técnicos para audiencia más amplia',
        'Incluir más contenido sobre el impacto social de la tecnología',
        'Agregar tutoriales prácticos y demos',
        'Mejorar el balance entre teoría y aplicación práctica'
      ]
    },
    emprendimiento: {
      topics: [
        { id: '1', name: 'Estrategias de Negocio', relevance: 90, frequency: 75, sentiment: 'positive' as const, keywords: ['Business Model', 'Estrategia', 'Planificación', 'Ejecución'] },
        { id: '2', name: 'Financiamiento', relevance: 87, frequency: 68, sentiment: 'neutral' as const, keywords: ['Inversión', 'Capital', 'Funding', 'VCs'] },
        { id: '3', name: 'Liderazgo', relevance: 83, frequency: 60, sentiment: 'positive' as const, keywords: ['Management', 'Equipos', 'Cultura', 'Motivación'] },
        { id: '4', name: 'Casos de Éxito', relevance: 79, frequency: 55, sentiment: 'positive' as const, keywords: ['Success Stories', 'Experiencias', 'Lecciones', 'Mentoring'] }
      ],
      insights: [
        'Los casos de éxito reales aumentan la retención de audiencia en un 45%',
        'Los temas de financiamiento generan más preguntas pero menor engagement',
        'La audiencia emprendedora prefiere formato de entrevista conversacional',
        'Los episodios sobre liderazgo tienen la mayor tasa de recomendación'
      ],
      strengths: [
        'Historias inspiradoras y motivacionales bien contadas',
        'Diversidad de perspectivas empresariales y sectores',
        'Consejos prácticos aplicables inmediatamente',
        'Comunidad activa y comprometida de emprendedores'
      ],
      improvements: [
        'Incluir más contenido sobre emprendimiento femenino',
        'Expandir cobertura de mercados emergentes',
        'Agregar episodios sobre fracasos y lecciones aprendidas',
        'Mejorar seguimiento post-episodio con recursos adicionales'
      ]
    }
  };

  if (categorySpecificData[category as keyof typeof categorySpecificData]) {
    return categorySpecificData[category as keyof typeof categorySpecificData];
  }

  // Generar datos genéricos si la categoría no está definida
  const genericKeywords = podcastData.title.split(' ').slice(0, 4).map((w: string) => w.replace(/[^a-zA-Zá-úÁ-Ú0-9]/g, ''));
  const genericTopicName = podcastData.title.split(' ').slice(0, 2).join(' ');

  const genericData = {
    topics: [
      { id: '1', name: genericTopicName, relevance: 90, frequency: 70, sentiment: 'positive' as const, keywords: genericKeywords },
      { id: '2', name: 'Tendencias Relevantes', relevance: 80, frequency: 60, sentiment: 'neutral' as const, keywords: ['Tendencias', 'Actualidad', 'Insights'] },
      { id: '3', name: 'Perspectivas de la Audiencia', relevance: 75, frequency: 55, sentiment: 'positive' as const, keywords: ['Audiencia', 'Feedback', 'Engagement'] },
      { id: '4', name: 'Casos Destacados', relevance: 70, frequency: 50, sentiment: 'positive' as const, keywords: ['Casos', 'Ejemplos', 'Lecciones'] }
    ],
    insights: [
      `El podcast muestra gran interés en ${genericTopicName}`,
      'La audiencia valora la información aplicada a la vida real',
      'Los episodios con invitados generan mayor retención',
      'Las preguntas abiertas incrementan la participación en redes sociales'
    ],
    strengths: [
      'Contenido bien estructurado y fácil de seguir',
      'Presentadores con buen dominio del tema',
      'Uso de ejemplos y anécdotas que enriquecen el aprendizaje',
      'Actualización frecuente de episodios'
    ],
    improvements: [
      'Incluir más estadísticas y datos concretos',
      'Ampliar la diversidad de voces invitadas',
      'Explorar formatos más dinámicos como debates o Q&A',
      'Optimizar la duración para mantener la atención de la audiencia'
    ]
  };

  return genericData;
};

export const usePodcastAnalysisStore = create<PodcastAnalysisState>((set, get) => ({
  // Estado inicial
  currentAnalysis: null,
  analysisHistory: [],
  isAnalyzing: false,
  analysisProgress: 0,
  error: null,
  selectedTimeRange: '30d',
  selectedMetrics: ['listeners', 'engagement', 'retention', 'sentiment'],

  // Acciones básicas
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  
  addAnalysisToHistory: (analysis) => {
    const { analysisHistory } = get();
    const updatedHistory = [analysis, ...analysisHistory.slice(0, 9)]; // Mantener solo los últimos 10
    set({ analysisHistory: updatedHistory });
  },
  
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setAnalysisProgress: (progress) => set({ analysisProgress: progress }),
  setError: (error) => set({ error }),
  setSelectedTimeRange: (range) => set({ selectedTimeRange: range }),
  setSelectedMetrics: (metrics) => set({ selectedMetrics: metrics }),

  // Función principal de análisis
  startAnalysis: async (podcastId, podcastData) => {
    const { setIsAnalyzing, setAnalysisProgress, setError, generateMockAnalysis, setCurrentAnalysis, addAnalysisToHistory } = get();
    
    try {
      setIsAnalyzing(true);
      setAnalysisProgress(0);
      setError(null);

      // Simular progreso del análisis
      const progressSteps = [
        { progress: 20, message: 'Extrayendo datos del podcast...' },
        { progress: 40, message: 'Analizando contenido y temas...' },
        { progress: 60, message: 'Procesando métricas de audiencia...' },
        { progress: 80, message: 'Generando insights y recomendaciones...' },
        { progress: 100, message: 'Análisis completado' }
      ];

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setAnalysisProgress(step.progress);
      }

      // Generar análisis mock
      const analysis = generateMockAnalysis(podcastId, podcastData);
      
      setCurrentAnalysis(analysis);
      addAnalysisToHistory(analysis);
      setIsAnalyzing(false);
      setAnalysisProgress(0);

    } catch (error) {
      setError('Error al analizar el podcast. Por favor intenta nuevamente.');
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  },

  // Generar datos mock de análisis
  generateMockAnalysis: (podcastId, podcastData) => {
    const categoryData = getMockDataByCategory(podcastData.category, podcastData);
    
    const analysis: PodcastAnalysisData = {
      id: 'analysis-' + Date.now(),
      podcastId,
      title: podcastData.title,
      creator: podcastData.author || 'Creador Desconocido',
      network: ['Spotify Studios', 'Apple Podcasts', 'Google Podcasts', 'Anchor', 'Red Independiente'][Math.floor(Math.random() * 5)],
      genre: podcastData.category === 'marketing' ? 'Educacional' : 
             podcastData.category === 'tecnologia' ? 'Tecnología' : 'Emprendimiento',
      theme: podcastData.category === 'marketing' ? 'Marketing Digital' : 
             podcastData.category === 'tecnologia' ? 'Innovación Tecnológica' : 'Desarrollo Empresarial',
      subtheme: podcastData.category === 'marketing' ? 'Estrategias de Crecimiento' :
                podcastData.category === 'tecnologia' ? 'Inteligencia Artificial' : 'Casos de Éxito',
      duration: podcastData.episodes?.[0]?.duration || '45:30',
      description: podcastData.episodes?.[0]?.description || 'Análisis profundo del contenido del podcast',
      analysisDate: new Date().toISOString(),
      status: 'completed',

      metrics: {
        totalListeners: Math.floor(Math.random() * 50000) + 10000,
        averageDuration: podcastData.episodes?.[0]?.duration || '45:30',
        engagementRate: Math.floor(Math.random() * 30) + 60,
        retentionRate: Math.floor(Math.random() * 20) + 70,
        downloadCount: Math.floor(Math.random() * 100000) + 25000,
        shareCount: Math.floor(Math.random() * 5000) + 1000,
        subscriptionRate: Math.floor(Math.random() * 15) + 10,
        reviewsCount: podcastData.totalReviews || Math.floor(Math.random() * 200) + 50,
        averageRating: podcastData.rating || (Math.random() * 1.5 + 3.5)
      },

      sentimentAnalysis: {
        positive: Math.floor(Math.random() * 30) + 50,
        neutral: Math.floor(Math.random() * 20) + 20,
        negative: Math.floor(Math.random() * 15) + 5,
        overallSentiment: 'positive',
        confidence: Math.floor(Math.random() * 20) + 80
      },

      topicAnalysis: categoryData.topics,

      audienceSegments: [
        { ageGroup: '18-24', percentage: 15, engagement: 78, preferredTopics: ['Tendencias', 'Innovación'] },
        { ageGroup: '25-34', percentage: 35, engagement: 85, preferredTopics: ['Estrategias', 'Casos de Éxito'] },
        { ageGroup: '35-44', percentage: 30, engagement: 82, preferredTopics: ['Liderazgo', 'Experiencia'] },
        { ageGroup: '45-54', percentage: 15, engagement: 79, preferredTopics: ['Análisis', 'Perspectiva'] },
        { ageGroup: '55+', percentage: 5, engagement: 73, preferredTopics: ['Sabiduría', 'Mentoría'] }
      ],

      contentRecommendations: (() => {
        // Función auxiliar para barajar arrays
        const shuffleArray = <T,>(arr: T[]): T[] => arr.slice().sort(() => Math.random() - 0.5);

        // Plantillas base
        const baseRecommendations = [
          {
            type: 'topic' as const,
            title: `Profundizar en ${categoryData.topics[0]?.name || 'temas clave'}`,
            description: 'La audiencia quiere un análisis más detallado sobre este tema',
          },
          {
            type: 'format' as const,
            title: 'Integrar episodios de preguntas y respuestas',
            description: 'Fomenta la participación directa de la audiencia',
          },
          {
            type: 'timing' as const,
            title: 'Publicar en horarios de mayor actividad',
            description: 'Optimiza la visibilidad del episodio en las primeras horas',
          },
          {
            type: 'style' as const,
            title: 'Añadir historias personales',
            description: 'Humaniza el contenido y crea mayor conexión emocional',
          },
          {
            type: 'topic' as const,
            title: 'Invitar expertos externos',
            description: 'Aporta perspectivas variadas y credibilidad adicional',
          }
        ];

        // Seleccionar aleatoriamente 3 recomendaciones y asignar prioridad/impacto aleatorio
        const selected = shuffleArray(baseRecommendations).slice(0, 3).map((rec, idx) => ({
          id: (idx + 1).toString(),
          ...rec,
          priority: (['high', 'medium', 'low'])[Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
          expectedImpact: Math.floor(Math.random() * 30) + 60 // 60 - 90
        }));

        return selected;
      })(),

      competitorAnalysis: [
        {
          name: 'Podcast Líder del Sector',
          category: podcastData.category,
          followers: 75000,
          avgRating: 4.6,
          topTopics: categoryData.topics.slice(0, 2).map(t => t.name),
          strengths: ['Alta frecuencia de publicación', 'Invitados de alto perfil'],
          weaknesses: ['Contenido repetitivo', 'Poca interacción con audiencia']
        },
        {
          name: 'Competidor Emergente',
          category: podcastData.category,
          followers: 25000,
          avgRating: 4.3,
          topTopics: categoryData.topics.slice(1, 3).map(t => t.name),
          strengths: ['Formato innovador', 'Comunidad muy activa'],
          weaknesses: ['Producción inconsistente', 'Audio de menor calidad']
        }
      ],

      trends: {
        listenership: [
          { month: 'Ene', count: 8500 },
          { month: 'Feb', count: 9200 },
          { month: 'Mar', count: 10100 },
          { month: 'Abr', count: 11500 },
          { month: 'May', count: 12800 },
          { month: 'Jun', count: 13200 }
        ],
        engagement: [
          { month: 'Ene', rate: 65 },
          { month: 'Feb', rate: 68 },
          { month: 'Mar', rate: 72 },
          { month: 'Abr', rate: 75 },
          { month: 'May', rate: 78 },
          { month: 'Jun', rate: 82 }
        ],
        topTopics: [
          { month: 'Ene', topics: ['Planificación', 'Objetivos'] },
          { month: 'Feb', topics: ['Estrategias', 'Ejecución'] },
          { month: 'Mar', topics: ['Crecimiento', 'Escalabilidad'] },
          { month: 'Abr', topics: ['Innovación', 'Tecnología'] },
          { month: 'May', topics: ['Liderazgo', 'Equipos'] },
          { month: 'Jun', topics: ['Resultados', 'Métricas'] }
        ]
      },

      keywords: categoryData.topics.flatMap(t => t.keywords),

      overallScore: Math.floor(Math.random() * 15) + 80,

      keyInsights: categoryData.insights,

      strengths: categoryData.strengths,

      areasForImprovement: categoryData.improvements
    };

    return analysis;
  },

  // Funciones utilitarias
  getAnalysisByPodcastId: (podcastId) => {
    const { analysisHistory } = get();
    return analysisHistory.find(analysis => analysis.podcastId === podcastId) || null;
  },

  clearAnalysis: () => {
    set({ 
      currentAnalysis: null, 
      isAnalyzing: false, 
      analysisProgress: 0, 
      error: null 
    });
  }
})); 