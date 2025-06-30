import { create } from 'zustand';

export interface Episode {
  id: string;
  title: string;
  duration: string;
  description: string;
  audioUrl?: string; // URL del archivo de audio
  publishDate?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PodcastData {
  id: string;
  title: string;
  category: string;
  episodes?: Episode[];
  reviews?: Review[];
  rating?: number;
  totalReviews?: number;
  coverImage?: string; // URL de la imagen de portada
  author?: string;
}

// Nuevo estado para el reproductor de audio
export interface AudioPlayerState {
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  isBuffering: boolean;
  playbackRate: number;
}

interface PodcastState {
  // Data
  podcastDatabase: PodcastData[];
  selectedPodcast: PodcastData | null;
  selectedEpisode: Episode | null;
  isPlaying: boolean;
  isProcessingUrl: boolean;
  urlError: string;
  
  // Audio Player State
  audioPlayer: AudioPlayerState;
  audioElement: HTMLAudioElement | null;
  
  // Pagination states
  currentPodcastPage: number;
  currentReviewPage: number;
  podcastsPerPage: number;
  reviewsPerPage: number;
  
  // Actions
  setPodcastDatabase: (podcasts: PodcastData[]) => void;
  setSelectedPodcast: (podcast: PodcastData | null) => void;
  setSelectedEpisode: (episode: Episode | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsProcessingUrl: (processing: boolean) => void;
  setUrlError: (error: string) => void;
  setCurrentPodcastPage: (page: number) => void;
  setCurrentReviewPage: (page: number) => void;
  resetPagination: () => void;
  
  // Audio Player Actions
  initializeAudioElement: () => void;
  playAudio: () => Promise<void>;
  pauseAudio: () => void;
  togglePlayPause: () => Promise<void>;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  updateCurrentTime: (time: number) => void;
  updateDuration: (duration: number) => void;
  setIsLoading: (loading: boolean) => void;
  setIsBuffering: (buffering: boolean) => void;
  
  // Helper functions
  getPodcastsByCategory: (category: string) => PodcastData[];
  filterPodcasts: (query: string) => PodcastData[];
  validateUrl: (url: string) => boolean;
  processUrlToPodcast: (url: string) => Promise<PodcastData>;
}

// URLs de ejemplo de podcasts reales (usando archivos de audio de ejemplo)
// Para producción, estas URLs deberían venir de APIs de podcasts o archivos subidos
const sampleAudioUrls = {
  // Archivos de ejemplo de diferentes fuentes libres
  sample1: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
  sample2: 'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav', 
  sample3: 'https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav',
  sample4: 'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav',
  sample5: 'https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther60.wav',
  // Para desarrollo local, puedes usar archivos en tu carpeta public
  local1: '/audio/crisis_economica.mp3',
  local2: '/audio/lamine_yamal.mp3'
};

const mockPodcastDatabase: PodcastData[] = [
  // MARKETING PODCASTS
  {
    id: '1',
    title: 'Estrategias para el crecimiento de comunidades',
    category: 'otro',
    author: 'María López',
    rating: 5.0,
    totalReviews: 6,
    coverImage: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Marketing',
    episodes: [
      { 
        id: '1', 
        title: 'Introducción a las estrategias de crecimiento', 
        duration: '45:30', 
        description: 'Introducción a las estrategias de crecimiento para comunidades digitales',
        audioUrl: sampleAudioUrls.local1,
        publishDate: '2024-01-15'
      },
      { 
        id: '2', 
        title: 'Técnicas avanzadas de engagement', 
        duration: '38:15', 
        description: 'Técnicas avanzadas de engagement y retención de usuarios',
        audioUrl: sampleAudioUrls.local2,
        publishDate: '2024-01-22'
      },
      { 
        id: '3', 
        title: 'Casos de éxito y análisis profundo', 
        duration: '52:20', 
        description: 'Análisis de casos de éxito en el crecimiento de comunidades',
        audioUrl: sampleAudioUrls.local1,
        publishDate: '2024-01-29'
      }
    ],
    reviews: [
      {
        id: '1',
        userName: 'Anna Torres',
        rating: 5,
        comment: 'Este podcast es increíble. Las estrategias son prácticas y fáciles de aplicar. ¡Muy recomendado!',
        date: '15/08/00'
      },
      {
        id: '2',
        userName: 'Carlos Mendoza',
        rating: 5,
        comment: 'Grandes ideas, pero algunos ejemplos son un poco generales. Aun así, vale la pena escucharlo.',
        date: '15/08/00'
      },
    ]
  },
  {
    id: '2',
    title: 'Marketing Digital Avanzado',
    category: 'otro',
    author: 'Roberto Silva',
    rating: 4.2,
    totalReviews: 8,
    coverImage: 'https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=Digital+Mkt',
    episodes: [
      { id: '1', title: 'Fundamentos del marketing digital', duration: '32:15', description: 'Fundamentos del marketing digital', audioUrl: sampleAudioUrls.local1, publishDate: '2024-02-01' },
      { id: '2', title: 'SEO y posicionamiento web', duration: '28:45', description: 'SEO y posicionamiento web', audioUrl: sampleAudioUrls.local2, publishDate: '2024-02-08' },
      { id: '3', title: 'Publicidad en redes sociales', duration: '35:20', description: 'Publicidad en redes sociales', audioUrl: sampleAudioUrls.local1, publishDate: '2024-02-15' },
    ],
    reviews: [
      {
        id: '1',
        userName: 'Sofia Rodriguez',
        rating: 4,
        comment: 'Muy buen contenido, pero podría ser más actualizado.',
        date: '12/08/00'
      },
      {
        id: '2',
        userName: 'Miguel Santos',
        rating: 5,
        comment: 'Excelente para principiantes en marketing digital.',
        date: '10/08/00'
      },
      {
        id: '3',
        userName: 'Patricia Ruiz',
        rating: 4,
        comment: 'Muy útil para mi negocio online. Recomendado.',
        date: '11/08/00'
      },
    ]
  },
  {
    id: '3',
    title: 'Branding y Posicionamiento',
    category: 'otro',
    author: 'Ana Martínez',
    rating: 4.7,
    totalReviews: 12,
    coverImage: 'https://via.placeholder.com/300x300/FF9F43/FFFFFF?text=Branding',
    episodes: [
      { id: '1', title: 'Construyendo una marca sólida', duration: '41:30', description: 'Cómo construir una marca sólida desde cero', audioUrl: sampleAudioUrls.local1, publishDate: '2024-02-20' },
      { id: '2', title: 'Identidad visual y narrativa', duration: '36:45', description: 'Creando identidad visual y narrativa de marca', audioUrl: sampleAudioUrls.local2, publishDate: '2024-02-27' },
      { id: '3', title: 'Posicionamiento en el mercado', duration: '44:15', description: 'Estrategias de posicionamiento efectivas', audioUrl: sampleAudioUrls.local1, publishDate: '2024-03-05' },
    ],
    reviews: [
      { id: '1', userName: 'Diego Herrera', rating: 5, comment: 'Excelente contenido sobre branding. Muy profesional.', date: '20/08/00' },
      { id: '2', userName: 'Carmen Vega', rating: 4, comment: 'Buenas ideas, aunque algunos conceptos son complejos.', date: '18/08/00' },
    ]
  },
  {
    id: '4',
    title: 'Influencer Marketing Mastery',
    category: 'otro',
    author: 'Luis Fernández',
    rating: 4.1,
    totalReviews: 15,
    coverImage: 'https://via.placeholder.com/300x300/A55EEA/FFFFFF?text=Influencer',
    episodes: [
      { id: '1', title: 'El poder del marketing de influencers', duration: '39:20', description: 'Introducción al marketing de influencers', audioUrl: sampleAudioUrls.local1, publishDate: '2024-03-10' },
      { id: '2', title: 'Selección y colaboración con influencers', duration: '42:10', description: 'Cómo elegir y trabajar con influencers', audioUrl: sampleAudioUrls.local2, publishDate: '2024-03-17' },
      { id: '3', title: 'Medición de ROI en campañas', duration: '37:55', description: 'Cómo medir el retorno de inversión', audioUrl: sampleAudioUrls.local1, publishDate: '2024-03-24' },
    ],
    reviews: [
      { id: '1', userName: 'Isabella Cruz', rating: 4, comment: 'Muy útil para entender el mundo de los influencers.', date: '25/08/00' },
      { id: '2', userName: 'Fernando Ruiz', rating: 4, comment: 'Buen contenido, pero podría tener más ejemplos prácticos.', date: '23/08/00' },
    ]
  },

  // TECNOLOGÍA PODCASTS
  {
    id: '5',
    title: 'Inteligencia Artificial y el Futuro',
    category: 'tecnologia',
    author: 'Dr. Carlos Tech',
    rating: 4.8,
    totalReviews: 20,
    coverImage: 'https://via.placeholder.com/300x300/26D0CE/FFFFFF?text=AI+Future',
    episodes: [
      { id: '1', title: 'Introducción a la IA moderna', duration: '48:30', description: 'Fundamentos de la inteligencia artificial', audioUrl: sampleAudioUrls.local1, publishDate: '2024-01-10' },
      { id: '2', title: 'Machine Learning en la práctica', duration: '52:15', description: 'Aplicaciones prácticas del machine learning', audioUrl: sampleAudioUrls.local2, publishDate: '2024-01-17' },
      { id: '3', title: 'Ética en la inteligencia artificial', duration: '45:40', description: 'Consideraciones éticas en el desarrollo de IA', audioUrl: sampleAudioUrls.local1, publishDate: '2024-01-24' },
      { id: '4', title: 'El futuro del trabajo con IA', duration: '41:25', description: 'Cómo la IA transformará el mercado laboral', audioUrl: sampleAudioUrls.local2, publishDate: '2024-01-31' },
    ],
    reviews: [
      { id: '1', userName: 'Tech Enthusiast', rating: 5, comment: 'Increíble análisis del futuro de la IA. Muy recomendado.', date: '30/08/00' },
      { id: '2', userName: 'María Developer', rating: 5, comment: 'Excelente para entender las tendencias tecnológicas.', date: '28/08/00' },
      { id: '3', userName: 'Jorge Innovador', rating: 4, comment: 'Muy informativo, aunque a veces muy técnico.', date: '26/08/00' },
    ]
  },
  {
    id: '6',
    title: 'Desarrollo Web Moderno',
    category: 'tecnologia',
    author: 'Sara DevCode',
    rating: 4.5,
    totalReviews: 18,
    coverImage: 'https://via.placeholder.com/300x300/FF6348/FFFFFF?text=Web+Dev',
    episodes: [
      { id: '1', title: 'React vs Vue vs Angular', duration: '43:20', description: 'Comparación de frameworks frontend', audioUrl: sampleAudioUrls.local1, publishDate: '2024-02-05' },
      { id: '2', title: 'Backend con Node.js', duration: '39:45', description: 'Desarrollo backend moderno con Node.js', audioUrl: sampleAudioUrls.local2, publishDate: '2024-02-12' },
      { id: '3', title: 'Bases de datos NoSQL', duration: '46:10', description: 'MongoDB, Redis y otras bases NoSQL', audioUrl: sampleAudioUrls.local1, publishDate: '2024-02-19' },
    ],
    reviews: [
      { id: '1', userName: 'DevMaster', rating: 5, comment: 'Perfecto para developers que quieren actualizarse.', date: '22/08/00' },
      { id: '2', userName: 'CodeNinja', rating: 4, comment: 'Buen contenido técnico, muy útil.', date: '20/08/00' },
    ]
  },
  {
    id: '7',
    title: 'Ciberseguridad Esencial',
    category: 'tecnologia',
    author: 'Alex SecurityPro',
    rating: 4.6,
    totalReviews: 14,
    coverImage: 'https://via.placeholder.com/300x300/2C2C54/FFFFFF?text=Security',
    episodes: [
      { id: '1', title: 'Fundamentos de ciberseguridad', duration: '40:30', description: 'Conceptos básicos de seguridad informática', audioUrl: sampleAudioUrls.local1, publishDate: '2024-03-01' },
      { id: '2', title: 'Protección contra malware', duration: '38:20', description: 'Cómo protegerse del malware moderno', audioUrl: sampleAudioUrls.local2, publishDate: '2024-03-08' },
      { id: '3', title: 'Seguridad en la nube', duration: '44:45', description: 'Mejores prácticas para cloud security', audioUrl: sampleAudioUrls.local1, publishDate: '2024-03-15' },
    ],
    reviews: [
      { id: '1', userName: 'SecureUser', rating: 5, comment: 'Esencial para cualquier profesional de IT.', date: '16/08/00' },
      { id: '2', userName: 'ITManager', rating: 4, comment: 'Muy útil para implementar en la empresa.', date: '14/08/00' },
    ]
  },
  {
    id: '8',
    title: 'Blockchain y Criptomonedas',
    category: 'tecnologia',
    author: 'Crypto Expert',
    rating: 4.3,
    totalReviews: 22,
    coverImage: 'https://via.placeholder.com/300x300/F79F1F/FFFFFF?text=Blockchain',
    episodes: [
      { id: '1', title: 'Introducción al blockchain', duration: '47:15', description: 'Qué es blockchain y cómo funciona', audioUrl: sampleAudioUrls.local1, publishDate: '2024-03-20' },
      { id: '2', title: 'Bitcoin y Ethereum explicados', duration: '41:30', description: 'Las criptomonedas más importantes', audioUrl: sampleAudioUrls.local2, publishDate: '2024-03-27' },
      { id: '3', title: 'Smart contracts y DeFi', duration: '49:20', description: 'Contratos inteligentes y finanzas descentralizadas', audioUrl: sampleAudioUrls.local1, publishDate: '2024-04-03' },
    ],
    reviews: [
      { id: '1', userName: 'CryptoTrader', rating: 4, comment: 'Buena introducción al mundo crypto.', date: '10/08/00' },
      { id: '2', userName: 'BlockchainDev', rating: 5, comment: 'Excelente explicación técnica.', date: '08/08/00' },
    ]
  },

  // EMPRENDIMIENTO PODCASTS
  {
    id: '9',
    title: 'Startup desde Cero',
    category: 'emprendimiento',
    author: 'Elena Entrepreneur',
    rating: 4.9,
    totalReviews: 35,
    coverImage: 'https://via.placeholder.com/300x300/00D2D3/FFFFFF?text=Startup',
    episodes: [
      { id: '1', title: 'Validando tu idea de negocio', duration: '44:20', description: 'Cómo validar una idea antes de invertir', audioUrl: sampleAudioUrls.local1, publishDate: '2024-01-05' },
      { id: '2', title: 'Creando un MVP efectivo', duration: '41:15', description: 'Desarrollo de producto mínimo viable', audioUrl: sampleAudioUrls.local2, publishDate: '2024-01-12' },
      { id: '3', title: 'Búsqueda de inversión', duration: '48:30', description: 'Cómo conseguir financiación para tu startup', audioUrl: sampleAudioUrls.local1, publishDate: '2024-01-19' },
      { id: '4', title: 'Escalando tu negocio', duration: '42:45', description: 'Estrategias para hacer crecer tu empresa', audioUrl: sampleAudioUrls.local2, publishDate: '2024-01-26' },
    ],
    reviews: [
      { id: '1', userName: 'StartupFounder', rating: 5, comment: 'Invaluable para cualquier emprendedor. Lo mejor que he escuchado.', date: '05/08/00' },
      { id: '2', userName: 'BusinessOwner', rating: 5, comment: 'Consejos prácticos y realistas. Muy recomendado.', date: '03/08/00' },
      { id: '3', userName: 'InvestorMind', rating: 4, comment: 'Buena perspectiva desde el lado del emprendedor.', date: '01/08/00' },
    ]
  },
  {
    id: '10',
    title: 'Liderazgo y Gestión',
    category: 'emprendimiento',
    author: 'Miguel Leader',
    rating: 4.4,
    totalReviews: 16,
    coverImage: 'https://via.placeholder.com/300x300/5F27CD/FFFFFF?text=Leadership',
    episodes: [
      { id: '1', title: 'Fundamentos del liderazgo', duration: '39:30', description: 'Qué hace a un buen líder', audioUrl: sampleAudioUrls.local1, publishDate: '2024-02-10' },
      { id: '2', title: 'Gestión de equipos remotos', duration: '43:20', description: 'Liderando equipos distribuidos', audioUrl: sampleAudioUrls.local2, publishDate: '2024-02-17' },
      { id: '3', title: 'Toma de decisiones estratégicas', duration: '46:15', description: 'Cómo tomar decisiones difíciles', audioUrl: sampleAudioUrls.local1, publishDate: '2024-02-24' },
    ],
    reviews: [
      { id: '1', userName: 'TeamManager', rating: 4, comment: 'Muy útil para managers nuevos.', date: '28/07/00' },
      { id: '2', userName: 'CEO_Startup', rating: 5, comment: 'Excelentes insights sobre liderazgo.', date: '26/07/00' },
    ]
  },
  {
    id: '11',
    title: 'Finanzas para Emprendedores',
    category: 'emprendimiento',
    author: 'Laura FinanceGuru',
    rating: 4.7,
    totalReviews: 28,
    coverImage: 'https://via.placeholder.com/300x300/FF3838/FFFFFF?text=Finance',
    episodes: [
      { id: '1', title: 'Fundamentos financieros', duration: '38:45', description: 'Conceptos básicos de finanzas empresariales', audioUrl: sampleAudioUrls.local1, publishDate: '2024-03-05' },
      { id: '2', title: 'Flujo de caja y presupuestos', duration: '41:30', description: 'Gestión del flujo de caja', audioUrl: sampleAudioUrls.local2, publishDate: '2024-03-12' },
      { id: '3', title: 'Inversión y crecimiento', duration: '44:20', description: 'Cómo invertir para crecer', audioUrl: sampleAudioUrls.local1, publishDate: '2024-03-19' },
    ],
    reviews: [
      { id: '1', userName: 'SmallBizOwner', rating: 5, comment: 'Perfecto para entender las finanzas del negocio.', date: '20/07/00' },
      { id: '2', userName: 'EntrepreneurLife', rating: 4, comment: 'Muy claro y fácil de entender.', date: '18/07/00' },
    ]
  },
  {
    id: '12',
    title: 'Innovación y Creatividad',
    category: 'emprendimiento',
    author: 'David Innovator',
    rating: 4.2,
    totalReviews: 11,
    coverImage: 'https://via.placeholder.com/300x300/FF9FF3/FFFFFF?text=Innovation',
    episodes: [
      { id: '1', title: 'Pensamiento creativo en los negocios', duration: '40:15', description: 'Cómo desarrollar creatividad empresarial', audioUrl: sampleAudioUrls.local1, publishDate: '2024-04-01' },
      { id: '2', title: 'Innovación disruptiva', duration: '37:50', description: 'Creando productos que cambian mercados', audioUrl: sampleAudioUrls.local2, publishDate: '2024-04-08' },
      { id: '3', title: 'Cultura de innovación', duration: '42:30', description: 'Fomentando la innovación en tu empresa', audioUrl: sampleAudioUrls.local1, publishDate: '2024-04-15' },
    ],
    reviews: [
      { id: '1', userName: 'CreativeFounder', rating: 4, comment: 'Buenas ideas para estimular la creatividad.', date: '15/07/00' },
      { id: '2', userName: 'InnovationManager', rating: 4, comment: 'Útil para crear equipos más innovadores.', date: '13/07/00' },
    ]
  },

  // NUEVAS CATEGORÍAS
  {
    id: '13',
    title: 'Productividad Personal',
    category: 'otro',
    author: 'Ana ProductivePro',
    rating: 4.6,
    totalReviews: 19,
    coverImage: 'https://via.placeholder.com/300x300/54A0FF/FFFFFF?text=Productivity',
    episodes: [
      { id: '1', title: 'Gestión del tiempo efectiva', duration: '35:20', description: 'Técnicas para optimizar tu tiempo', audioUrl: sampleAudioUrls.local1, publishDate: '2024-04-20' },
      { id: '2', title: 'Eliminando distracciones', duration: '32:45', description: 'Cómo mantener el foco en lo importante', audioUrl: sampleAudioUrls.local2, publishDate: '2024-04-27' },
      { id: '3', title: 'Hábitos de alta performance', duration: '38:15', description: 'Construyendo rutinas exitosas', audioUrl: sampleAudioUrls.local1, publishDate: '2024-05-04' },
    ],
    reviews: [
      { id: '1', userName: 'ProductiveUser', rating: 5, comment: 'Cambió completamente mi forma de trabajar.', date: '10/07/00' },
      { id: '2', userName: 'TimeManager', rating: 4, comment: 'Técnicas muy prácticas y aplicables.', date: '08/07/00' },
    ]
  },
  {
    id: '14',
    title: 'Salud Mental y Bienestar',
    category: 'otro',
    author: 'Dr. Mental Health',
    rating: 4.8,
    totalReviews: 24,
    coverImage: 'https://via.placeholder.com/300x300/2ED573/FFFFFF?text=Wellness',
    episodes: [
      { id: '1', title: 'Manejo del estrés laboral', duration: '41:30', description: 'Técnicas para reducir el estrés en el trabajo', audioUrl: sampleAudioUrls.local1, publishDate: '2024-05-10' },
      { id: '2', title: 'Mindfulness y meditación', duration: '36:20', description: 'Prácticas de atención plena', audioUrl: sampleAudioUrls.local2, publishDate: '2024-05-17' },
      { id: '3', title: 'Balance vida-trabajo', duration: '39:45', description: 'Encontrando el equilibrio perfecto', audioUrl: sampleAudioUrls.local1, publishDate: '2024-05-24' },
    ],
    reviews: [
      { id: '1', userName: 'WellnessSeeker', rating: 5, comment: 'Esencial para mantener la salud mental.', date: '05/07/00' },
      { id: '2', userName: 'StressedWorker', rating: 5, comment: 'Me ayudó mucho con mi ansiedad laboral.', date: '03/07/00' },
    ]
  },
  {
    id: '15',
    title: 'Inversiones y Finanzas Personales',
    category: 'otro',
    author: 'Carlos InvestorPro',
    rating: 4.5,
    totalReviews: 31,
    coverImage: 'https://via.placeholder.com/300x300/FFA502/FFFFFF?text=Investing',
    episodes: [
      { id: '1', title: 'Introducción a las inversiones', duration: '43:15', description: 'Primeros pasos en el mundo de las inversiones', audioUrl: sampleAudioUrls.local1, publishDate: '2024-05-30' },
      { id: '2', title: 'Diversificación de portafolio', duration: '40:30', description: 'Cómo diversificar tus inversiones', audioUrl: sampleAudioUrls.local2, publishDate: '2024-06-06' },
      { id: '3', title: 'Inversión a largo plazo', duration: '45:20', description: 'Estrategias para inversores pacientes', audioUrl: sampleAudioUrls.local1, publishDate: '2024-06-13' },
    ],
    reviews: [
      { id: '1', userName: 'NewInvestor', rating: 4, comment: 'Perfecto para principiantes en inversiones.', date: '01/07/00' },
      { id: '2', userName: 'PortfolioBuilder', rating: 5, comment: 'Excelentes consejos sobre diversificación.', date: '29/06/00' },
    ]
  },
  // ENTRETENIMIENTO PODCASTS
  {
    id: '16',
    title: 'Historias de Terror',
    category: 'entretenimiento',
    author: 'Narradora Misteriosa',
    rating: 4.7,
    totalReviews: 18,
    coverImage: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Terror',
    episodes: [
      { id: '1', title: 'La casa abandonada', duration: '35:20', description: 'Una historia escalofriante sobre una casa maldita', audioUrl: sampleAudioUrls.local1, publishDate: '2024-06-20' },
      { id: '2', title: 'El espejo del ático', duration: '28:45', description: 'Un espejo que muestra más de lo que debería', audioUrl: sampleAudioUrls.local2, publishDate: '2024-06-27' },
    ],
    reviews: [
      { id: '1', userName: 'HorrorFan', rating: 5, comment: '¡Me encanta! Muy bien narrado.', date: '25/06/00' },
      { id: '2', userName: 'ScaredListener', rating: 4, comment: 'Perfecto para noches de insomnio.', date: '22/06/00' },
    ]
  },
  {
    id: '17',
    title: 'Comedia y Risas',
    category: 'entretenimiento',
    author: 'Los Comediantes',
    rating: 4.3,
    totalReviews: 22,
    coverImage: 'https://via.placeholder.com/300x300/F59E0B/FFFFFF?text=Comedy',
    episodes: [
      { id: '1', title: 'Anécdotas divertidas', duration: '42:10', description: 'Las mejores anécdotas cómicas', audioUrl: sampleAudioUrls.local1, publishDate: '2024-07-01' },
      { id: '2', title: 'Imitaciones famosas', duration: '38:30', description: 'Imitando a celebridades', audioUrl: sampleAudioUrls.local2, publishDate: '2024-07-08' },
    ],
    reviews: [
      { id: '1', userName: 'LaughLover', rating: 4, comment: 'Me hicieron reír mucho en el trabajo.', date: '10/07/00' },
      { id: '2', userName: 'FunnyGuy', rating: 5, comment: 'Excelente para levantar el ánimo.', date: '05/07/00' },
    ]
  },
  // NOTICIAS PODCASTS
  {
    id: '18',
    title: 'Noticias del Mundo Tech',
    category: 'noticias',
    author: 'Periodista Digital',
    rating: 4.4,
    totalReviews: 35,
    coverImage: 'https://via.placeholder.com/300x300/EF4444/FFFFFF?text=News',
    episodes: [
      { id: '1', title: 'Últimas noticias de IA', duration: '25:15', description: 'Lo más reciente en inteligencia artificial', audioUrl: sampleAudioUrls.local1, publishDate: '2024-07-15' },
      { id: '2', title: 'Actualizaciones de redes sociales', duration: '30:20', description: 'Cambios en plataformas sociales', audioUrl: sampleAudioUrls.local2, publishDate: '2024-07-16' },
    ],
    reviews: [
      { id: '1', userName: 'NewsJunkie', rating: 4, comment: 'Siempre al día con las noticias tech.', date: '16/07/00' },
      { id: '2', userName: 'TechFollower', rating: 5, comment: 'Información precisa y actualizada.', date: '15/07/00' },
    ]
  },
  {
    id: '19',
    title: 'Política Internacional',
    category: 'noticias',
    author: 'Analista Político',
    rating: 4.1,
    totalReviews: 28,
    coverImage: 'https://via.placeholder.com/300x300/6B7280/FFFFFF?text=Politics',
    episodes: [
      { id: '1', title: 'Análisis electoral 2024', duration: '45:30', description: 'Análisis de las elecciones mundiales', audioUrl: sampleAudioUrls.local1, publishDate: '2024-07-10' },
      { id: '2', title: 'Relaciones internacionales', duration: '40:15', description: 'Estado de las relaciones entre países', audioUrl: sampleAudioUrls.local2, publishDate: '2024-07-17' },
    ],
    reviews: [
      { id: '1', userName: 'PoliticalWatcher', rating: 4, comment: 'Análisis muy profundo y objetivo.', date: '18/07/00' },
      { id: '2', userName: 'NewsReader', rating: 4, comment: 'Me ayuda a entender la política mundial.', date: '12/07/00' },
    ]
  },
  // EDUCACIÓN PODCASTS
  {
    id: '20',
    title: 'Historia Universal',
    category: 'educacion',
    author: 'Prof. Historia',
    rating: 4.8,
    totalReviews: 42,
    coverImage: 'https://via.placeholder.com/300x300/10B981/FFFFFF?text=History',
    episodes: [
      { id: '1', title: 'Civilizaciones antiguas', duration: '50:20', description: 'Explorando las grandes civilizaciones', audioUrl: sampleAudioUrls.local1, publishDate: '2024-06-01' },
      { id: '2', title: 'Guerras mundiales', duration: '55:45', description: 'Análisis de los grandes conflictos', audioUrl: sampleAudioUrls.local2, publishDate: '2024-06-08' },
    ],
    reviews: [
      { id: '1', userName: 'HistoryBuff', rating: 5, comment: 'Increíblemente educativo y entretenido.', date: '15/06/00' },
      { id: '2', userName: 'Student', rating: 5, comment: 'Me ayuda mucho con mis estudios.', date: '10/06/00' },
    ]
  },
  {
    id: '21',
    title: 'Ciencias Naturales',
    category: 'educacion',
    author: 'Dr. Científico',
    rating: 4.6,
    totalReviews: 33,
    coverImage: 'https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=Science',
    episodes: [
      { id: '1', title: 'Física cuántica explicada', duration: '48:10', description: 'Conceptos de física cuántica simplificados', audioUrl: sampleAudioUrls.local1, publishDate: '2024-06-15' },
      { id: '2', title: 'Biología molecular', duration: '42:30', description: 'Fundamentos de biología molecular', audioUrl: sampleAudioUrls.local2, publishDate: '2024-06-22' },
    ],
    reviews: [
      { id: '1', userName: 'ScienceLover', rating: 5, comment: 'Complejo pero muy bien explicado.', date: '25/06/00' },
      { id: '2', userName: 'CuriousStudent', rating: 4, comment: 'Perfecto para aprender ciencias.', date: '20/06/00' },
    ]
  }
];

export const usePodcastStore = create<PodcastState>((set, get) => ({
  // Initial state
  podcastDatabase: mockPodcastDatabase,
  selectedPodcast: null,
  selectedEpisode: null,
  isPlaying: false,
  isProcessingUrl: false,
  urlError: '',
  currentPodcastPage: 1,
  currentReviewPage: 1,
  podcastsPerPage: 8,
  reviewsPerPage: 6,
  
  // Audio Player State
  audioPlayer: {
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoading: false,
    isBuffering: false,
    playbackRate: 1,
  },
  audioElement: null,
  
  // Actions
  setPodcastDatabase: (podcasts) => set({ podcastDatabase: podcasts }),
  
  setSelectedPodcast: (podcast) => {
    const { pauseAudio } = get();
    pauseAudio(); // Pausar audio actual si hay uno reproduciéndose
    set({ 
      selectedPodcast: podcast,
      currentReviewPage: 1,
      selectedEpisode: null,
      isPlaying: false
    });
  },
  
  setSelectedEpisode: (episode) => {
    const { initializeAudioElement } = get();
    set({ selectedEpisode: episode, isPlaying: false });
    if (episode?.audioUrl) {
      initializeAudioElement();
    }
  },
  
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  
  setIsProcessingUrl: (processing) => set({ isProcessingUrl: processing }),
  
  setUrlError: (error) => set({ urlError: error }),
  
  setCurrentPodcastPage: (page) => set({ currentPodcastPage: page }),
  
  setCurrentReviewPage: (page) => set({ currentReviewPage: page }),
  
  resetPagination: () => set({ 
    currentPodcastPage: 1, 
    currentReviewPage: 1 
  }),
  
  // Audio Player Actions
  initializeAudioElement: () => {
    const { selectedEpisode, audioElement } = get();
    
    if (!selectedEpisode?.audioUrl) return;
    
    // Si ya existe un elemento de audio, limpiarlo
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
    }
    
    const audio = new Audio(selectedEpisode.audioUrl);
    
    // Event listeners
    audio.addEventListener('loadstart', () => {
      set((state) => ({
        audioPlayer: { ...state.audioPlayer, isLoading: true }
      }));
    });
    
    audio.addEventListener('loadedmetadata', () => {
      set((state) => ({
        audioPlayer: { 
          ...state.audioPlayer, 
          duration: audio.duration,
          isLoading: false 
        }
      }));
    });
    
    audio.addEventListener('timeupdate', () => {
      set((state) => ({
        audioPlayer: { ...state.audioPlayer, currentTime: audio.currentTime }
      }));
    });
    
    audio.addEventListener('waiting', () => {
      set((state) => ({
        audioPlayer: { ...state.audioPlayer, isBuffering: true }
      }));
    });
    
    audio.addEventListener('canplay', () => {
      set((state) => ({
        audioPlayer: { ...state.audioPlayer, isBuffering: false }
      }));
    });
    
    audio.addEventListener('ended', () => {
      set({ isPlaying: false });
      set((state) => ({
        audioPlayer: { ...state.audioPlayer, currentTime: 0 }
      }));
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Error de audio:', e);
      set({ 
        isPlaying: false,
        urlError: 'Error al cargar el audio'
      });
      set((state) => ({
        audioPlayer: { 
          ...state.audioPlayer, 
          isLoading: false, 
          isBuffering: false 
        }
      }));
    });
    
    set({ audioElement: audio });
  },
  
  playAudio: async () => {
    const { audioElement } = get();
    if (!audioElement) return;
    
    try {
      await audioElement.play();
      set({ isPlaying: true });
    } catch (error) {
      console.error('Error al reproducir audio:', error);
      set({ urlError: 'Error al reproducir el audio' });
    }
  },
  
  pauseAudio: () => {
    const { audioElement } = get();
    if (!audioElement) return;
    
    audioElement.pause();
    set({ isPlaying: false });
  },
  
  togglePlayPause: async () => {
    const { isPlaying, playAudio, pauseAudio } = get();
    
    if (isPlaying) {
      pauseAudio();
    } else {
      await playAudio();
    }
  },
  
  seekTo: (time) => {
    const { audioElement } = get();
    if (!audioElement) return;
    
    audioElement.currentTime = time;
    set((state) => ({
      audioPlayer: { ...state.audioPlayer, currentTime: time }
    }));
  },
  
  setVolume: (volume) => {
    const { audioElement } = get();
    if (!audioElement) return;
    
    audioElement.volume = volume;
    set((state) => ({
      audioPlayer: { ...state.audioPlayer, volume }
    }));
  },
  
  setPlaybackRate: (rate) => {
    const { audioElement } = get();
    if (!audioElement) return;
    
    audioElement.playbackRate = rate;
    set((state) => ({
      audioPlayer: { ...state.audioPlayer, playbackRate: rate }
    }));
  },
  
  updateCurrentTime: (time) => {
    set((state) => ({
      audioPlayer: { ...state.audioPlayer, currentTime: time }
    }));
  },
  
  updateDuration: (duration) => {
    set((state) => ({
      audioPlayer: { ...state.audioPlayer, duration }
    }));
  },
  
  setIsLoading: (loading) => {
    set((state) => ({
      audioPlayer: { ...state.audioPlayer, isLoading: loading }
    }));
  },
  
  setIsBuffering: (buffering) => {
    set((state) => ({
      audioPlayer: { ...state.audioPlayer, isBuffering: buffering }
    }));
  },
  
  // Helper functions
  getPodcastsByCategory: (category) => {
    const { podcastDatabase } = get();
    return podcastDatabase.filter(p => p.category === category);
  },
  
  filterPodcasts: (query) => {
    const { podcastDatabase } = get();

    // Si la consulta está vacía, devolver toda la base
    if (!query.trim()) return podcastDatabase;

    const lowerQuery = query.toLowerCase();

    return podcastDatabase.filter((podcast) => {
      // Título del podcast
      if (podcast.title?.toLowerCase().includes(lowerQuery)) return true;

      // Categoría
      if (podcast.category?.toLowerCase().includes(lowerQuery)) return true;

      // Autor
      if (podcast.author?.toLowerCase().includes(lowerQuery)) return true;

      // Episodios (título, descripción o url)
      if (
        podcast.episodes?.some(
          (ep) =>
            ep.title?.toLowerCase().includes(lowerQuery) ||
            ep.description?.toLowerCase().includes(lowerQuery) ||
            ep.audioUrl?.toLowerCase().includes(lowerQuery)
        )
      )
        return true;

      // Reseñas (comentario o nombre de usuario)
      if (
        podcast.reviews?.some(
          (review) =>
            review.comment?.toLowerCase().includes(lowerQuery) ||
            review.userName?.toLowerCase().includes(lowerQuery)
        )
      )
        return true;

      return false;
    });
  },
  
  validateUrl: (url) => {
    try {
      new URL(url);
      return url.includes('podcast') || url.includes('spotify') || url.includes('apple') || url.includes('youtube') || url.includes('soundcloud');
    } catch {
      return false;
    }
  },
  
  processUrlToPodcast: async (url) => {
    const { validateUrl, setIsProcessingUrl, setUrlError } = get();
    
    if (!url.trim()) {
      setUrlError('Por favor ingresa una URL del podcast');
      throw new Error('URL vacía');
    }

    // Función para detectar el tipo de URL y extraer ID
    const detectPlatformAndExtractId = (url: string) => {
      const platforms = {
        // Spotify: episodios y shows
        spotify: /spotify\.com\/(?:episode|show)\/([a-zA-Z0-9]+)/,
        // Apple Podcasts: múltiples formatos
        apple: /podcasts\.apple\.com\/.*\/podcast\/.*\/id(\d+)/,
        // YouTube: formato largo, corto, móvil, y con parámetros
        youtube: /(?:(?:www\.)?youtube\.com\/watch\?v=|youtu\.be\/|m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)(?:[&?]\S*)?/,
        // SoundCloud: usuarios y tracks
        soundcloud: /soundcloud\.com\/[\w-]+\/[\w-]+/,
        // Archivos de audio directos con parámetros
        direct: /\.(mp3|wav|ogg|m4a|aac|flac)(\?.*)?$/i
      };

      for (const [platform, regex] of Object.entries(platforms)) {
        const match = url.match(regex);
        if (match) {
          return { platform, id: match[1] || 'direct' };
        }
      }
      
      return { platform: 'unknown', id: null };
    };

    const { platform, id } = detectPlatformAndExtractId(url);

    if (platform === 'unknown' && !validateUrl(url)) {
      setUrlError('Por favor ingresa una URL válida de podcast (Spotify, Apple Podcasts, YouTube, SoundCloud, o archivo de audio directo)');
      throw new Error('URL inválida');
    }

    setUrlError('');
    setIsProcessingUrl(true);

    return new Promise<PodcastData>((resolve) => {
      setTimeout(() => {
        // Simular extracción de metadatos basada en la plataforma
        let extractedPodcast: PodcastData;
        
        switch (platform) {
          case 'spotify':
            extractedPodcast = {
              id: 'spotify-' + Date.now(),
              title: 'Podcast de Spotify - Extraído',
              category: 'extracted',
              author: 'Artista de Spotify',
              rating: 4.7,
              totalReviews: 12,
              coverImage: 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=Spotify',
              episodes: [
                {
                  id: 'spotify-episode-1',
                  title: 'Episodio de Spotify',
                  duration: '48:30',
                  description: 'Episodio extraído desde Spotify con metadatos enriquecidos',
                  audioUrl: sampleAudioUrls.sample1, // En producción: URL del audio real de Spotify
                  publishDate: new Date().toISOString().split('T')[0]
                }
              ],
              reviews: []
            };
            break;
            
          case 'apple':
            extractedPodcast = {
              id: 'apple-' + Date.now(),
              title: 'Podcast de Apple Podcasts',
              category: 'extracted',
              author: 'Podcaster de Apple',
              rating: 4.8,
              totalReviews: 25,
              coverImage: 'https://via.placeholder.com/300x300/000000/FFFFFF?text=Apple',
              episodes: [
                {
                  id: 'apple-episode-1',
                  title: 'Episodio de Apple Podcasts',
                  duration: '42:15',
                  description: 'Episodio de alta calidad desde Apple Podcasts',
                  audioUrl: sampleAudioUrls.sample2,
                  publishDate: new Date().toISOString().split('T')[0]
                }
              ],
              reviews: []
            };
            break;
            
          case 'youtube':
            // Detectar si es parte de una lista de reproducción
            const isPlaylist = url.includes('list=');
            const playlistId = isPlaylist ? url.match(/list=([a-zA-Z0-9_-]+)/)?.[1] : null;
            
            extractedPodcast = {
              id: 'youtube-' + Date.now(),
              title: isPlaylist ? 'Serie de Podcasts de YouTube' : 'Podcast de YouTube',
              category: 'extracted',
              author: 'Canal de YouTube',
              rating: 4.5,
              totalReviews: 8,
              coverImage: 'https://via.placeholder.com/300x300/FF0000/FFFFFF?text=YouTube',
              episodes: [
                {
                  id: `youtube-episode-${id}`,
                  title: isPlaylist ? `Video ${id} de la serie` : `Video ${id}`,
                  duration: '1:15:20',
                  description: isPlaylist 
                    ? `Video de YouTube (ID: ${id}) parte de la lista: ${playlistId}`
                    : `Video de YouTube extraído con ID: ${id}`,
                  audioUrl: sampleAudioUrls.sample3,
                  publishDate: new Date().toISOString().split('T')[0]
                }
              ],
              reviews: []
            };
            break;
            
          case 'direct':
            extractedPodcast = {
              id: 'direct-' + Date.now(),
              title: 'Audio Directo',
              category: 'extracted',
              author: 'Archivo de Audio',
              rating: 4.0,
              totalReviews: 1,
              coverImage: 'https://via.placeholder.com/300x300/6366F1/FFFFFF?text=Audio',
              episodes: [
                {
                  id: 'direct-episode-1',
                  title: 'Archivo de Audio',
                  duration: 'Calculando...',
                  description: 'Archivo de audio cargado directamente',
                  audioUrl: url, // Usar la URL directa del archivo
                  publishDate: new Date().toISOString().split('T')[0]
                }
              ],
              reviews: []
            };
            break;
            
          default:
            extractedPodcast = {
              id: 'generic-' + Date.now(),
              title: 'Podcast Genérico Extraído',
              category: 'extracted',
              author: 'Autor Desconocido',
              rating: 4.2,
              totalReviews: 5,
              episodes: [
                {
                  id: 'generic-episode-1',
                  title: 'Episodio extraído',
                  duration: '45:30',
                  description: 'Episodio extraído desde URL externa',
                  audioUrl: sampleAudioUrls.sample1,
                  publishDate: new Date().toISOString().split('T')[0]
                }
              ],
              reviews: []
            };
        }

        setIsProcessingUrl(false);
        setUrlError('');
        
        console.log('✅ Metadatos extraídos desde', platform + ':', {
          titulo: extractedPodcast.title,
          duracion: extractedPodcast.episodes?.[0]?.duration,
          autor: extractedPodcast.author,
          plataforma: platform,
          videoId: id, // ID extraído de la URL
          fechaPublicacion: new Date().toLocaleDateString(),
          descripcion: extractedPodcast.episodes?.[0]?.description,
          audioUrl: extractedPodcast.episodes?.[0]?.audioUrl,
          coverImage: extractedPodcast.coverImage
        });

        resolve(extractedPodcast);
      }, 2000);
    });
  },

  // Función auxiliar para agregar un podcast desde archivo local
  addPodcastFromFile: (file: File, metadata: Partial<PodcastData>) => {
    const { podcastDatabase, setPodcastDatabase } = get();
    
    // Crear URL del objeto para el archivo local
    const audioUrl = URL.createObjectURL(file);
    
    const newPodcast: PodcastData = {
      id: 'local-' + Date.now(),
      title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
      category: metadata.category || 'local',
      author: metadata.author || 'Autor Local',
      rating: 0,
      totalReviews: 0,
      episodes: [
        {
          id: 'local-episode-1',
          title: metadata.title || 'Episodio Local',
          duration: 'Calculando...',
          description: 'Podcast cargado desde archivo local',
          audioUrl: audioUrl,
          publishDate: new Date().toISOString().split('T')[0]
        }
      ],
      reviews: [],
      ...metadata
    };
    
    setPodcastDatabase([...podcastDatabase, newPodcast]);
    return newPodcast;
  },

  // Función para agregar URLs de audio de APIs populares
  addPodcastFromAPI: async (apiSource: 'podcast-index' | 'rss' | 'custom', sourceUrl: string) => {
    const { podcastDatabase, setPodcastDatabase, setIsProcessingUrl, setUrlError } = get();
    
    setIsProcessingUrl(true);
    setUrlError('');
    
    return new Promise<PodcastData>((resolve, reject) => {
      setTimeout(() => {
        try {
          // Simulación de llamada a API
          const newPodcast: PodcastData = {
            id: 'api-' + Date.now(),
            title: `Podcast desde ${apiSource}`,
            category: 'api',
            author: 'API Source',
            rating: 4.5,
            totalReviews: 0,
            episodes: [
              {
                id: 'api-episode-1',
                title: 'Episodio desde API',
                duration: '35:20',
                description: `Contenido extraído desde ${apiSource}`,
                audioUrl: sampleAudioUrls.sample1,
                publishDate: new Date().toISOString().split('T')[0]
              }
            ],
            reviews: []
          };
          
          setPodcastDatabase([...podcastDatabase, newPodcast]);
          setIsProcessingUrl(false);
          resolve(newPodcast);
        } catch (error) {
          setUrlError(`Error al conectar con ${apiSource}`);
          setIsProcessingUrl(false);
          reject(error);
        }
      }, 1500);
    });
  }
})); 