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
  {
    id: '1',
    title: 'Estrategias para el crecimiento de comunidades',
    category: 'marketing',
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
        audioUrl: sampleAudioUrls.local1, // Audio de ejemplo funcional
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
    category: 'marketing',
    rating: 4.2,
    totalReviews: 8,
    episodes: [
      { id: '1', title: 'Episodio 1', duration: '32:15', description: 'Fundamentos del marketing digital' },
      { id: '2', title: 'Episodio 2', duration: '28:45', description: 'SEO y posicionamiento web' },
      { id: '3', title: 'Episodio 3', duration: '35:20', description: 'Publicidad en redes sociales' },
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
  podcastsPerPage: 15,
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