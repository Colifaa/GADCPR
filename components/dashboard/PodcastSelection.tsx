'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Search, Music, Play, Pause, Volume2, Maximize2, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PodcastAnalysis } from './PodcastAnalysis';

interface Episode {
  id: string;
  title: string;
  duration: string;
  description: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface PodcastData {
  id: string;
  title: string;
  category: string;
  episodes?: Episode[];
  reviews?: Review[];
  rating?: number;
  totalReviews?: number;
}

export function PodcastSelection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('recomendaciones');
  const [showAnalysisView, setShowAnalysisView] = useState(false);
  const [showEpisodesView, setShowEpisodesView] = useState(false);
  const [showReviewsView, setShowReviewsView] = useState(false);
  const [showPodcastAnalysis, setShowPodcastAnalysis] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isProcessingUrl, setIsProcessingUrl] = useState(false);
  const [urlError, setUrlError] = useState('');
  
  // Estados para paginado
  const [currentPodcastPage, setCurrentPodcastPage] = useState(1);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const podcastsPerPage = 15; // 3 filas x 5 columnas
  const reviewsPerPage = 6;

  // Base de datos mock de podcasts con diferentes episodios y ratings
  const podcastDatabase: PodcastData[] = [
    {
      id: '1',
      title: 'Estrategias para el crecimiento de comunidades',
      category: 'marketing',
      rating: 5.0,
      totalReviews: 6,
      episodes: [
        { id: '1', title: 'Episodio 1', duration: '45:30', description: 'Introducción a las estrategias de crecimiento' },
        { id: '2', title: 'Episodio 2', duration: '38:15', description: 'Técnicas avanzadas de engagement' },
        { id: '3', title: 'Episodio 3', duration: '52:20', description: 'Casos de éxito y análisis profundo' },
        { id: '4', title: 'Episodio 4', duration: '41:45', description: 'Métricas y KPIs importantes' },
        { id: '5', title: 'Episodio 5', duration: '47:10', description: 'Tendencias futuras y predicciones' },
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
        {
          id: '3',
          userName: 'Lucía Gómez',
          rating: 5,
          comment: 'Me ha ayudado mucho a crecer mi comunidad. Los consejos sobre redes sociales son geniales.',
          date: '15/08/00'
        },
        {
          id: '4',
          userName: 'Pedro Ruiz',
          rating: 5,
          comment: 'Excelentes entrevistas y buenas perspectivas. Algunos episodios son un poco técnicos, pero útiles.',
          date: '15/08/00'
        },
        {
          id: '5',
          userName: 'María Fernández',
          rating: 5,
          comment: 'Me inspira y motiva a involucrar a más miembros. ¡Siempre aprendo algo nuevo!',
          date: '15/08/00'
        },
        {
          id: '6',
          userName: 'Javier López',
          rating: 5,
          comment: 'Un recurso valioso para cualquier líder comunitario. Aunque a veces los episodios son largos, la información que ofrecen es muy útil.',
          date: '15/08/00'
        },
        {
          id: '7',
          userName: 'Ana García',
          rating: 4,
          comment: 'Contenido muy útil para community managers. Me ha ayudado con mi estrategia.',
          date: '16/08/00'
        },
        {
          id: '8',
          userName: 'Roberto Díaz',
          rating: 5,
          comment: 'Excelente podcast con casos reales y aplicables.',
          date: '17/08/00'
        },
        {
          id: '9',
          userName: 'Carmen Soto',
          rating: 4,
          comment: 'Buenos tips aunque algunos episodios podrían ser más cortos.',
          date: '18/08/00'
        },
        {
          id: '10',
          userName: 'Francisco Villa',
          rating: 5,
          comment: 'Me encanta la variedad de temas que cubren. Muy completo.',
          date: '19/08/00'
        },
        {
          id: '11',
          userName: 'Elena Castillo',
          rating: 3,
          comment: 'Información interesante pero a veces repetitiva.',
          date: '20/08/00'
        },
        {
          id: '12',
          userName: 'Andrés Jiménez',
          rating: 5,
          comment: 'Perfecto para quienes gestionan comunidades online.',
          date: '21/08/00'
        }
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
        {
          id: '4',
          userName: 'Carlos Herrera',
          rating: 3,
          comment: 'Bueno pero algunos temas están desactualizados.',
          date: '12/08/00'
        },
        {
          id: '5',
          userName: 'Mónica López',
          rating: 5,
          comment: 'Me ayudó a mejorar mis campañas de Google Ads.',
          date: '13/08/00'
        },
        {
          id: '6',
          userName: 'Julio Mendez',
          rating: 4,
          comment: 'Contenido valioso aunque podría ser más práctico.',
          date: '14/08/00'
        },
        {
          id: '7',
          userName: 'Valeria Castro',
          rating: 5,
          comment: 'Perfecto para marketeros que inician. Muy claro.',
          date: '15/08/00'
        },
        {
          id: '8',
          userName: 'Rodrigo Silva',
          rating: 4,
          comment: 'Buenos fundamentos de marketing digital.',
          date: '16/08/00'
        }
      ]
    },
    {
      id: '3',
      title: 'Tecnología e Innovación',
      category: 'tecnologia',
      rating: 4.7,
      totalReviews: 12,
      episodes: [
        { id: '1', title: 'Episodio 1', duration: '55:10', description: 'Inteligencia artificial en 2024' },
        { id: '2', title: 'Episodio 2', duration: '48:30', description: 'Blockchain y criptomonedas' },
        { id: '3', title: 'Episodio 3', duration: '42:15', description: 'El futuro del trabajo remoto' },
        { id: '4', title: 'Episodio 4', duration: '38:45', description: 'Ciberseguridad para empresas' },
      ],
      reviews: [
        {
          id: '1',
          userName: 'Alex Chen',
          rating: 5,
          comment: 'Información muy actualizada sobre tecnología.',
          date: '18/08/00'
        },
        {
          id: '2',
          userName: 'Laura Morales',
          rating: 4,
          comment: 'Bueno, pero a veces muy técnico.',
          date: '16/08/00'
        },
        {
          id: '3',
          userName: 'Fernando Vega',
          rating: 5,
          comment: 'Excelente análisis de tendencias tecnológicas.',
          date: '17/08/00'
        },
        {
          id: '4',
          userName: 'Isabella Romero',
          rating: 4,
          comment: 'Muy informativo para profesionales IT.',
          date: '18/08/00'
        },
        {
          id: '5',
          userName: 'Sebastián Torres',
          rating: 5,
          comment: 'Me mantiene actualizado en tecnología. Imprescindible.',
          date: '19/08/00'
        },
        {
          id: '6',
          userName: 'Camila Díaz',
          rating: 3,
          comment: 'Interesante pero a veces demasiado complejo.',
          date: '20/08/00'
        },
        {
          id: '7',
          userName: 'Nicolás Peña',
          rating: 5,
          comment: 'Perfecto para estar al día con innovaciones.',
          date: '21/08/00'
        },
        {
          id: '8',
          userName: 'Gabriela Santos',
          rating: 4,
          comment: 'Buenos invitados expertos en tecnología.',
          date: '22/08/00'
        },
        {
          id: '9',
          userName: 'Mateo Guerrero',
          rating: 5,
          comment: 'Contenido de alta calidad y muy actual.',
          date: '23/08/00'
        },
        {
          id: '10',
          userName: 'Sofía Mendoza',
          rating: 4,
          comment: 'Excelente para desarrolladores y tech leads.',
          date: '24/08/00'
        },
        {
          id: '11',
          userName: 'Diego Herrera',
          rating: 5,
          comment: 'Siempre aprendo algo nuevo sobre IA y blockchain.',
          date: '25/08/00'
        },
        {
          id: '12',
          userName: 'Valentina Cruz',
          rating: 4,
          comment: 'Muy recomendado para profesionales tech.',
          date: '26/08/00'
        }
      ]
    },
    {
      id: '4',
      title: 'Emprendimiento Digital',
      category: 'emprendimiento',
      rating: 3.8,
      totalReviews: 5,
      episodes: [
        { id: '1', title: 'Episodio 1', duration: '41:20', description: 'Cómo validar tu idea de negocio' },
        { id: '2', title: 'Episodio 2', duration: '36:45', description: 'Financiamiento para startups' },
      ],
      reviews: [
        {
          id: '1',
          userName: 'Roberto Silva',
          rating: 4,
          comment: 'Buenos consejos para emprendedores.',
          date: '20/08/00'
        }
      ]
    },
    {
      id: '5',
      title: 'Redes Sociales Efectivas',
      category: 'marketing',
      rating: 4.5,
      totalReviews: 15,
      episodes: [
        { id: '1', title: 'Episodio 1', duration: '29:30', description: 'Instagram para negocios' },
        { id: '2', title: 'Episodio 2', duration: '33:15', description: 'TikTok marketing strategies' },
        { id: '3', title: 'Episodio 3', duration: '27:45', description: 'LinkedIn para profesionales' },
        { id: '4', title: 'Episodio 4', duration: '31:20', description: 'YouTube content creation' },
        { id: '5', title: 'Episodio 5', duration: '25:10', description: 'Twitter engagement tips' },
        { id: '6', title: 'Episodio 6', duration: '35:50', description: 'Facebook advertising' },
      ],
      reviews: [
        {
          id: '1',
          userName: 'Carmen Vega',
          rating: 5,
          comment: 'Perfecto para social media managers.',
          date: '22/08/00'
        }
      ]
    },
    {
      id: '6',
      title: 'SEO y Posicionamiento',
      category: 'marketing',
      rating: 4.3,
      totalReviews: 9,
      episodes: [
        { id: '1', title: 'Episodio 1', duration: '44:20', description: 'Fundamentos del SEO' },
        { id: '2', title: 'Episodio 2', duration: '38:45', description: 'Keywords y análisis de competencia' },
        { id: '3', title: 'Episodio 3', duration: '42:10', description: 'SEO técnico avanzado' },
      ],
      reviews: [
        {
          id: '1',
          userName: 'Diego Martinez',
          rating: 4,
          comment: 'Muy técnico pero útil para especialistas.',
          date: '25/08/00'
        }
      ]
    },
    {
      id: '7',
      title: 'Content Marketing',
      category: 'marketing',
      rating: 4.1,
      totalReviews: 7,
      episodes: [
        { id: '1', title: 'Episodio 1', duration: '36:15', description: 'Estrategias de contenido' },
        { id: '2', title: 'Episodio 2', duration: '41:30', description: 'Storytelling para marcas' },
      ],
      reviews: [
        {
          id: '1',
          userName: 'Isabella Torres',
          rating: 4,
          comment: 'Buenos ejemplos prácticos de contenido.',
          date: '28/08/00'
        }
      ]
    },
    {
      id: '8',
      title: 'Email Marketing Pro',
      category: 'marketing',
      rating: 3.9,
      totalReviews: 6,
      episodes: [
        { id: '1', title: 'Episodio 1', duration: '33:45', description: 'Automatización de emails' },
        { id: '2', title: 'Episodio 2', duration: '29:20', description: 'Segmentación de audiencias' },
        { id: '3', title: 'Episodio 3', duration: '35:10', description: 'A/B testing en campañas' },
      ],
      reviews: [
        {
          id: '1',
          userName: 'Fernando Lopez',
          rating: 4,
          comment: 'Buen contenido sobre automatización.',
          date: '30/08/00'
        }
      ]
    },
    {
      id: '9',
      title: 'Inteligencia Artificial',
      category: 'tecnologia',
      rating: 4.8,
      totalReviews: 18,
      episodes: [
        { id: '1', title: 'Episodio 1', duration: '52:30', description: 'Introducción a la IA' },
        { id: '2', title: 'Episodio 2', duration: '48:15', description: 'Machine Learning básico' },
        { id: '3', title: 'Episodio 3', duration: '55:45', description: 'Deep Learning y redes neuronales' },
        { id: '4', title: 'Episodio 4', duration: '43:20', description: 'IA en la industria' },
      ],
      reviews: [
        {
          id: '1',
          userName: 'Andrés Silva',
          rating: 5,
          comment: 'Excelente introducción a la IA moderna.',
          date: '02/09/00'
        }
      ]
    },
    {
      id: '10',
      title: 'Desarrollo Web Moderno',
      category: 'tecnologia',
      rating: 4.4,
      totalReviews: 11,
      episodes: [
        { id: '1', title: 'Episodio 1', duration: '45:10', description: 'React y Next.js' },
        { id: '2', title: 'Episodio 2', duration: '39:30', description: 'Backend con Node.js' },
        { id: '3', title: 'Episodio 3', duration: '41:45', description: 'Bases de datos modernas' },
      ],
      reviews: [
        {
          id: '1',
          userName: 'Valentina Cruz',
          rating: 4,
          comment: 'Perfecto para desarrolladores junior.',
          date: '05/09/00'
        }
      ]
    },
    {
      id: '11',
      title: 'Cloud Computing',
      category: 'tecnologia',
      rating: 4.6,
      totalReviews: 14,
      episodes: [
        { id: '1', title: 'Episodio 1', duration: '47:20', description: 'AWS fundamentals' },
        { id: '2', title: 'Episodio 2', duration: '44:15', description: 'Azure vs Google Cloud' },
        { id: '3', title: 'Episodio 3', duration: '51:30', description: 'DevOps en la nube' },
        { id: '4', title: 'Episodio 4', duration: '38:45', description: 'Seguridad en cloud' },
      ],
      reviews: [
        {
          id: '1',
          userName: 'Ricardo Morales',
          rating: 5,
          comment: 'Muy completo para arquitectos de nube.',
          date: '08/09/00'
        }
      ]
    },
    {
      id: '12',
      title: 'Ciberseguridad Digital',
      category: 'tecnologia',
      rating: 4.2,
      totalReviews: 8,
      episodes: [
        { id: '1', title: 'Episodio 1', duration: '40:30', description: 'Fundamentos de seguridad' },
        { id: '2', title: 'Episodio 2', duration: '37:45', description: 'Ethical hacking' },
        { id: '3', title: 'Episodio 3', duration: '43:20', description: 'Protección de datos' },
      ],
      reviews: [
        {
          id: '1',
          userName: 'Camila Ruiz',
          rating: 4,
          comment: 'Información actualizada sobre amenazas.',
          date: '10/09/00'
        }
      ]
    },
    {
      id: '13',
      title: 'Liderazgo Empresarial',
      category: 'emprendimiento',
      rating: 4.0,
      totalReviews: 10,
      episodes: [
        { id: '1', title: 'Episodio 1', duration: '42:15', description: 'Liderazgo transformacional' },
        { id: '2', title: 'Episodio 2', duration: '38:30', description: 'Gestión de equipos remotos' },
        { id: '3', title: 'Episodio 3', duration: '45:20', description: 'Toma de decisiones estratégicas' },
      ],
      reviews: [
        {
          id: '1',
          userName: 'Gabriel Santos',
          rating: 4,
          comment: 'Buenos consejos para managers.',
          date: '12/09/00'
        }
      ]
    },
    {
      id: '14',
      title: 'Startups Exitosas',
      category: 'emprendimiento',
      rating: 4.4,
      totalReviews: 13,
      episodes: [
        { id: '1', title: 'Episodio 1', duration: '49:10', description: 'De idea a MVP' },
        { id: '2', title: 'Episodio 2', duration: '44:25', description: 'Conseguir inversión' },
        { id: '3', title: 'Episodio 3', duration: '46:15', description: 'Escalabilidad del negocio' },
        { id: '4', title: 'Episodio 4', duration: '41:30', description: 'Exit strategies' },
      ],
      reviews: [
        {
          id: '1',
          userName: 'Natalia Vega',
          rating: 5,
          comment: 'Casos reales muy inspiradores.',
          date: '15/09/00'
        }
      ]
    },
    {
      id: '15',
      title: 'Finanzas para Emprendedores',
      category: 'emprendimiento',
      rating: 3.7,
      totalReviews: 5,
      episodes: [
        { id: '1', title: 'Episodio 1', duration: '35:45', description: 'Flujo de caja y presupuestos' },
        { id: '2', title: 'Episodio 2', duration: '32:20', description: 'Inversiones y ROI' },
      ],
      reviews: [
        {
          id: '1',
          userName: 'Sebastián Torres',
          rating: 4,
          comment: 'Conceptos básicos bien explicados.',
          date: '18/09/00'
        }
      ]
    },
    {
      id: '16',
      title: 'Negocios Online',
      category: 'emprendimiento',
      rating: 4.1,
      totalReviews: 9,
      episodes: [
        { id: '1', title: 'Episodio 1', duration: '40:15', description: 'E-commerce desde cero' },
        { id: '2', title: 'Episodio 2', duration: '37:30', description: 'Marketing digital para ventas' },
        { id: '3', title: 'Episodio 3', duration: '43:45', description: 'Automatización de procesos' },
      ],
      reviews: [
        {
          id: '1',
          userName: 'Mónica Herrera',
          rating: 4,
          comment: 'Práctico para tiendas online.',
          date: '20/09/00'
        }
      ]
    }
  ];

  // Organizar podcasts por categorías desde la base de datos
  const podcastsByCategory = {
    marketing: podcastDatabase.filter(p => p.category === 'marketing'),
    tecnologia: podcastDatabase.filter(p => p.category === 'tecnologia'),
    emprendimiento: podcastDatabase.filter(p => p.category === 'emprendimiento'),
  };

  const allPodcasts = podcastDatabase;

  const handlePodcastClick = (podcast: PodcastData) => {
    setSelectedPodcast(podcast);
    setCurrentReviewPage(1); // Reset review page when selecting new podcast
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAnalyzeClick = () => {
    if (selectedPodcast) {
      setShowPodcastAnalysis(true);
    }
  };

  const handleFinalAnalyze = () => {
    router.push('/seleccion');
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.includes('podcast') || url.includes('spotify') || url.includes('apple') || url.includes('youtube') || url.includes('soundcloud');
    } catch {
      return false;
    }
  };

  const handleUrlSubmit = async () => {
    if (!searchQuery.trim()) {
      setUrlError('Por favor ingresa una URL del podcast');
      return;
    }

    if (!validateUrl(searchQuery)) {
      setUrlError('Por favor ingresa una URL válida de podcast (Spotify, Apple Podcasts, YouTube, etc.)');
      return;
    }

    setUrlError('');
    setIsProcessingUrl(true);

    // Simular procesamiento de URL y extracción de metadatos
    setTimeout(() => {
      // Datos simulados extraídos del podcast basados en la URL
      const extractedPodcast: PodcastData = {
        id: 'url-podcast-' + Date.now(),
        title: 'Podcast extraído desde URL',
        category: 'extracted'
      };

      setSelectedPodcast(extractedPodcast);
      setIsProcessingUrl(false);
      setUrlError('');
      setSearchQuery(''); // Limpiar el campo de búsqueda
      
      // Mostrar mensaje de éxito con más detalles
      console.log('✅ Metadatos extraídos:', {
        titulo: extractedPodcast.title,
        duracion: '45:30',
        autor: 'Podcast Host',
        tema: 'Tecnología y Negocios',
        fechaPublicacion: new Date().toLocaleDateString(),
        descripcion: 'Descripción automáticamente extraída del podcast...'
      });
    }, 2000);
  };

  const filteredPodcasts = allPodcasts.filter(podcast => 
    podcast.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset podcast page when search changes
  React.useEffect(() => {
    setCurrentPodcastPage(1);
  }, [searchQuery]);

  // Funciones de paginado para podcasts
  const totalPodcastPages = Math.ceil(filteredPodcasts.length / podcastsPerPage);
  const indexOfLastPodcast = currentPodcastPage * podcastsPerPage;
  const indexOfFirstPodcast = indexOfLastPodcast - podcastsPerPage;
  const currentPodcasts = filteredPodcasts.slice(indexOfFirstPodcast, indexOfLastPodcast);

  const handlePodcastPageChange = (pageNumber: number) => {
    setCurrentPodcastPage(pageNumber);
  };

  // Funciones de paginado para reseñas
  const totalReviewPages = selectedPodcast ? Math.ceil((selectedPodcast.reviews?.length || 0) / reviewsPerPage) : 1;
  const indexOfLastReview = currentReviewPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = selectedPodcast?.reviews?.slice(indexOfFirstReview, indexOfLastReview) || [];

  const handleReviewPageChange = (pageNumber: number) => {
    setCurrentReviewPage(pageNumber);
  };

  // Función para convertir datos del podcast para el análisis
  const getPodcastAnalysisData = (podcast: PodcastData) => {
    const creators = ['Mariam Lopez', 'Carlos Rodriguez', 'Ana García', 'Luis Mendoza', 'Sofia Torres'];
    const networks = ['Spotify Studios', 'Apple Podcasts', 'Google Podcasts', 'Anchor', ''];
    
    return {
      id: podcast.id,
      title: podcast.title,
      creator: creators[Math.floor(Math.random() * creators.length)],
      network: networks[Math.floor(Math.random() * networks.length)],
      genre: podcast.category === 'marketing' ? 'Educacional' : 
             podcast.category === 'tecnologia' ? 'Tecnología' : 'Emprendimiento',
      theme: podcast.category === 'marketing' ? 'Marketing Digital' : 
             podcast.category === 'tecnologia' ? 'Innovación Tecnológica' : 'Desarrollo Empresarial',
      subtheme: podcast.category === 'marketing' ? 'Uso de Redes Sociales:' :
                podcast.category === 'tecnologia' ? 'Inteligencia Artificial:' : 'Estrategias de Crecimiento:',
      duration: podcast.episodes?.[0]?.duration || '02:00:00h',
      listeners: Math.floor(Math.random() * 9000 + 1000).toString().padStart(4, '0'),
      description: podcast.category === 'marketing' 
        ? 'El podcast se centra en técnicas y estrategias para fomentar el crecimiento de comunidades, especialmente en el contexto digital. Se abordan temas como la creación de contenido valioso, la interacción efectiva con miembros, y el uso de plataformas de redes sociales para aumentar el alcance.'
        : podcast.category === 'tecnologia'
        ? 'Este podcast explora las últimas tendencias en tecnología e innovación, cubriendo temas desde inteligencia artificial hasta ciberseguridad. Ideal para profesionales tech que buscan mantenerse actualizados con los avances más recientes del sector.'
        : 'Un podcast dedicado al mundo del emprendimiento y los negocios, donde se comparten estrategias, casos de éxito y lecciones aprendidas. Perfecto para emprendedores que buscan inspiración y conocimientos prácticos para hacer crecer sus empresas.'
    };
  };

  // Componente de paginado reutilizable
  const PaginationComponent = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
  }: { 
    currentPage: number; 
    totalPages: number; 
    onPageChange: (page: number) => void;
  }) => {
    const getPageNumbers = () => {
      const pages = [];
      const showPages = 5; // Mostrar máximo 5 números de página
      
      if (totalPages <= showPages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...', totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1, '...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="flex items-center justify-center space-x-1 mt-6">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Anterior
        </button>
        
        <div className="flex space-x-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`px-3 py-2 text-sm font-medium border transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                  : typeof page === 'number'
                  ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  : 'bg-white text-gray-400 border-gray-300 cursor-default'
              }`}
              disabled={typeof page !== 'number'}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
        </button>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          
          {/* Vista de Análisis Detallado */}
          {showAnalysisView && selectedPodcast ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAnalysisView(false)}
                    className="text-sm"
                  >
                    ← Volver
                  </Button>
                </div>
              </div>

              {/* Tabs for Analysis View */}
              <Tabs defaultValue="recomendaciones" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="recomendaciones">Recomendaciones y Tendencias</TabsTrigger>
                  <TabsTrigger value="categorias">Categorías</TabsTrigger>
                </TabsList>

                <TabsContent value="categorias" className="space-y-6">
                  {/* Search Bar */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Url del podcast"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4"
                      />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                      Buscar
                    </Button>
                  </div>

                  {/* Detailed Podcast Player */}
                  <Card className="bg-white">
                    <CardContent className="p-8">
                      <div className="text-center space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-900">
                          Estrategias para el crecimiento de comunidades
                        </h2>
                        
                        {/* Large Podcast Icon */}
                        <div className="flex justify-center">
                          <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center">
                            <Music className="w-12 h-12 text-white" />
                          </div>
                        </div>
                        
                        <p className="text-lg text-gray-600">Preview</p>
                        
                        {/* Episode Info */}
                        <div className="flex items-center justify-center space-x-8">
                          <span className="text-gray-600">Episodio 1</span>
                          <div className="flex items-center space-x-3">
                            <Select 
                              defaultValue={selectedEpisode?.id || (selectedPodcast.episodes && selectedPodcast.episodes.length > 0 ? selectedPodcast.episodes[0].id : 'episodio-1')}
                              onValueChange={(value) => {
                                const episode = selectedPodcast.episodes?.find(ep => ep.id === value);
                                if (episode) {
                                  setSelectedEpisode(episode);
                                }
                              }}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedPodcast.episodes?.map((episode, index) => (
                                  <SelectItem key={episode.id} value={episode.id}>
                                    Episodio {index + 1}
                                  </SelectItem>
                                )) || (
                                  <SelectItem value="episodio-1">Episodio 1</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Audio Player */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-center space-x-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handlePlayPause}
                              className="w-10 h-10 p-0"
                            >
                              {isPlaying ? (
                                <Pause className="w-5 h-5" />
                              ) : (
                                <Play className="w-5 h-5" />
                              )}
                            </Button>
                            
                            {/* Progress Bar */}
                            <div className="flex-1 max-w-md bg-blue-200 rounded-full h-3">
                              <div className="bg-blue-600 h-3 rounded-full w-1/3"></div>
                            </div>
                            
                            <Volume2 className="w-5 h-5 text-gray-600" />
                            <Maximize2 className="w-5 h-5 text-gray-600" />
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        <Button 
                          onClick={handleFinalAnalyze}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg"
                        >
                          Analizar y Generar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="recomendaciones" className="space-y-6">
                  {/* Content for recomendaciones tab */}
                  <div className="text-center py-12">
                    <p className="text-gray-500">Contenido de recomendaciones y tendencias</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Selección de Podcast</h1>
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Dashboard</span>
                </Button>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="categorias">Categorías</TabsTrigger>
                  <TabsTrigger value="recomendaciones">Recomendaciones y Tendencias</TabsTrigger>
                </TabsList>

                {/* Tab Content - Categorías */}
                <TabsContent value="categorias" className="space-y-6">
                  {/* Search Bar */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Url del podcast"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                        className="pl-10 pr-4"
                      />
                    </div>
                    <Button 
                      onClick={handleUrlSubmit}
                      disabled={isProcessingUrl}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    >
                      {isProcessingUrl ? 'Procesando...' : 'Buscar'}
                    </Button>
                    {selectedPodcast && (
                      <div className="text-sm text-green-600 font-medium">
                        ✓ Podcast seleccionado
                      </div>
                    )}
                  </div>

                  {/* URL Processing Message */}
                  {isProcessingUrl && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <div>
                          <p className="text-sm text-blue-700 font-medium">🔍 Procesando URL del podcast...</p>
                          <p className="text-xs text-blue-600">Extrayendo metadatos y analizando contenido</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* URL Error Message */}
                  {urlError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700">❌ {urlError}</p>
                    </div>
                  )}

                  {/* Selected Podcast Preview */}
                  {selectedPodcast && (
                    <Card className="bg-white border-2 border-blue-300 shadow-lg">
                      <CardContent className="p-6">
                        <div className="text-center space-y-4">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {selectedPodcast.title}
                          </h2>
                          
                          {/* Podcast Icon */}
                          <div className="flex justify-center">
                            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                              <Music className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          
                          <p className="text-gray-600">Preview</p>
                          
                          {/* Episode Info */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {selectedEpisode ? selectedEpisode.title : (selectedPodcast.episodes && selectedPodcast.episodes.length > 0 ? selectedPodcast.episodes[0].title : 'Episodio 1')}
                            </span>
                            <div className="flex items-center space-x-2">
                              <Select 
                                defaultValue={selectedEpisode?.id || (selectedPodcast.episodes && selectedPodcast.episodes.length > 0 ? selectedPodcast.episodes[0].id : 'episodio-1')}
                                onValueChange={(value) => {
                                  const episode = selectedPodcast.episodes?.find(ep => ep.id === value);
                                  if (episode) {
                                    setSelectedEpisode(episode);
                                  }
                                }}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedPodcast.episodes?.map((episode, index) => (
                                    <SelectItem key={episode.id} value={episode.id}>
                                      Episodio {index + 1}
                                    </SelectItem>
                                  )) || (
                                    <SelectItem value="episodio-1">Episodio 1</SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <Button 
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => setShowReviewsView(true)}
                              >
                                Calificar
                              </Button>
                            </div>
                          </div>
                          
                          {/* Audio Player */}
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handlePlayPause}
                                className="w-8 h-8 p-0"
                              >
                                {isPlaying ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </Button>
                              
                              {/* Progress Bar */}
                              <div className="flex-1 bg-blue-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
                              </div>
                              
                              <Volume2 className="w-4 h-4 text-gray-600" />
                              <Maximize2 className="w-4 h-4 text-gray-600" />
                            </div>
                          </div>
                          
                          {/* Action Button */}
                          <Button 
                            onClick={handleAnalyzeClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                          >
                            Analizar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Podcasts Grid */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {currentPodcasts.map((podcast) => (
                        <Card 
                          key={podcast.id}
                          className={`cursor-pointer transition-colors border-0 shadow-sm ${
                            selectedPodcast?.id === podcast.id 
                              ? 'bg-blue-100 border-blue-300' 
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                          onClick={() => handlePodcastClick(podcast)}
                        >
                          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-32">
                            <Music className="w-8 h-8 text-gray-700 mb-3" />
                            <p className="text-sm font-medium text-gray-900">{podcast.title}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Paginado de podcasts */}
                    {totalPodcastPages > 1 && (
                      <PaginationComponent
                        currentPage={currentPodcastPage}
                        totalPages={totalPodcastPages}
                        onPageChange={handlePodcastPageChange}
                      />
                    )}
                  </div>
                </TabsContent>

                {/* Tab Content - Recomendaciones */}
                <TabsContent value="recomendaciones" className="space-y-6">
                  {/* Search Bar */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                        className="pl-10 pr-4"
                      />
                    </div>
                    <Button 
                      onClick={handleUrlSubmit}
                      disabled={isProcessingUrl}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    >
                      {isProcessingUrl ? 'Procesando...' : 'Buscar'}
                    </Button>
                    {selectedPodcast && (
                      <div className="text-sm text-green-600 font-medium">
                        ✓ Podcast seleccionado
                      </div>
                    )}
                  </div>

                  {/* Selected Podcast Preview */}
                  {selectedPodcast && (
                    <Card className="bg-white border-2 border-blue-300 shadow-lg">
                      <CardContent className="p-6">
                        <div className="text-center space-y-4">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {selectedPodcast.title}
                          </h2>
                          
                          {/* Podcast Icon */}
                          <div className="flex justify-center">
                            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                              <Music className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          
                          <p className="text-gray-600">Preview</p>
                          
                          {/* Episode Info */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {selectedEpisode ? selectedEpisode.title : (selectedPodcast.episodes && selectedPodcast.episodes.length > 0 ? selectedPodcast.episodes[0].title : 'Episodio 1')}
                            </span>
                            <div className="flex items-center space-x-2">
                              <Select 
                                defaultValue={selectedEpisode?.id || (selectedPodcast.episodes && selectedPodcast.episodes.length > 0 ? selectedPodcast.episodes[0].id : 'episodio-1')}
                                onValueChange={(value) => {
                                  const episode = selectedPodcast.episodes?.find(ep => ep.id === value);
                                  if (episode) {
                                    setSelectedEpisode(episode);
                                  }
                                }}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedPodcast.episodes?.map((episode, index) => (
                                    <SelectItem key={episode.id} value={episode.id}>
                                      Episodio {index + 1}
                                    </SelectItem>
                                  )) || (
                                    <SelectItem value="episodio-1">Episodio 1</SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <Button 
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => setShowReviewsView(true)}
                              >
                                Calificar
                              </Button>
                            </div>
                          </div>
                          
                          {/* Audio Player */}
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handlePlayPause}
                                className="w-8 h-8 p-0"
                              >
                                {isPlaying ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </Button>
                              
                              {/* Progress Bar */}
                              <div className="flex-1 bg-blue-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
                              </div>
                              
                              <Volume2 className="w-4 h-4 text-gray-600" />
                              <Maximize2 className="w-4 h-4 text-gray-600" />
                            </div>
                          </div>
                          
                          {/* Action Button */}
                          <Button 
                            onClick={handleAnalyzeClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                          >
                            Analizar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Podcasts Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {allPodcasts.map((podcast) => (
                      <Card 
                        key={podcast.id}
                        className={`cursor-pointer transition-colors border-0 shadow-sm ${
                          selectedPodcast?.id === podcast.id 
                            ? 'bg-blue-100 border-blue-300' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => handlePodcastClick(podcast)}
                      >
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-32">
                          <Music className="w-8 h-8 text-gray-700 mb-3" />
                          <p className="text-sm font-medium text-gray-900">{podcast.title}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Vista de Episodios */}
          {showEpisodesView && selectedPodcast && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Episodios - {selectedPodcast.title}</h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowEpisodesView(false)}
                    className="text-sm"
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {selectedPodcast.episodes?.map((episode) => (
                    <div
                      key={episode.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedEpisode(episode);
                        setShowEpisodesView(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{episode.title}</h4>
                        <span className="text-sm text-gray-500">{episode.duration}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{episode.description}</p>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-8">No hay episodios disponibles</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Vista de Reseñas y Calificaciones */}
          {showReviewsView && selectedPodcast && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 h-[85vh] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Reseña, me gusta y calificaciones</h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewsView(false)}
                    className="text-sm"
                  >
                    ✕
                  </Button>
                </div>

                {/* Header con Estrategias y Rating - Fijo */}
                <div className="flex-shrink-0 mb-6">
                  <h4 className="text-lg font-medium mb-4">Estrategias</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="text-blue-600 text-xl">★</div>
                      ))}
                    </div>
                    <div className="text-4xl font-bold text-gray-800">
                      {selectedPodcast.rating || 5.0}
                    </div>
                  </div>
                  
                  {/* Rating Bars */}
                  <div className="mt-4 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-3">
                        <span className="text-sm w-2">{rating}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: rating === 5 ? '100%' : rating === 4 ? '80%' : '60%' }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews Grid - Con scroll */}
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[300px]">
                    {currentReviews.length > 0 ? currentReviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-4 h-fit">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {review.userName.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{review.userName}</h5>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span 
                                  key={star} 
                                  className={`text-sm ${star <= review.rating ? 'text-blue-600' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-xs text-gray-500">Fecha de publicación: {review.date}</p>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-center py-8 col-span-2">No hay reseñas disponibles</p>
                    )}
                  </div>
                </div>

                {/* Paginado de reseñas - Fijo en la parte inferior */}
                {totalReviewPages > 1 && (
                  <div className="flex-shrink-0 mt-4">
                    <PaginationComponent
                      currentPage={currentReviewPage}
                      totalPages={totalReviewPages}
                      onPageChange={handleReviewPageChange}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Componente de Análisis de Podcast */}
          {showPodcastAnalysis && selectedPodcast && (
            <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
              <PodcastAnalysis
                podcast={getPodcastAnalysisData(selectedPodcast)}
                onBack={() => setShowPodcastAnalysis(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 