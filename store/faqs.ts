import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'billing' | 'technical' | 'account';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

interface FaqsState {
  faqs: Faq[];
  isLoading: boolean;
  
  // Actions
  addFaq: (faq: Omit<Faq, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFaq: (id: string, updates: Partial<Omit<Faq, 'id' | 'createdAt'>>) => void;
  deleteFaq: (id: string) => void;
  toggleFaqStatus: (id: string) => void;
  reorderFaqs: (faqs: Faq[]) => void;
  getFaqsByCategory: (category?: string) => Faq[];
  getActiveFaqs: () => Faq[];
}

// Datos iniciales basados en la imagen de referencia
const initialFaqs: Faq[] = [
  {
    id: '1',
    question: '¿Puedo acceder a la plataforma desde dispositivos móviles?',
    answer: 'Sí, nuestra plataforma es completamente compatible con dispositivos móviles. Puedes acceder a ella desde cualquier smartphone o tablet a través de tu navegador.',
    category: 'technical',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    order: 1
  },
  {
    id: '2',
    question: '¿Existen tarifas o costos ocultos?',
    answer: 'No, en nuestra plataforma no existen tarifas o costos ocultos. Nos esforzamos por ser transparentes en nuestra estructura de precios. Al registrarte, podrás ver claramente todos los costos asociados a cada plan, incluidos los servicios que se ofrecen.',
    category: 'billing',
    isActive: true,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    order: 2
  },
  {
    id: '3',
    question: '¿Cómo puedo eliminar mi cuenta?',
    answer: 'Para eliminar tu cuenta en nuestra plataforma, debes solo es necesario enviar lo mediante una solicitud.',
    category: 'account',
    isActive: true,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    order: 3
  },
  {
    id: '4',
    question: 'Olvide mi contraseña, ¿ qué debo de hacer?',
    answer: 'Para cambiar tu contraseña en nuestra plataforma, debes de realizarlo al iniciar la sesión.',
    category: 'account',
    isActive: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    order: 4
  }
];

export const useFaqsStore = create<FaqsState>()(
  persist(
    (set, get) => ({
      faqs: initialFaqs,
      isLoading: false,

      addFaq: (faqData) => {
        const newFaq: Faq = {
          ...faqData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          faqs: [...state.faqs, newFaq].sort((a, b) => a.order - b.order)
        }));
      },

      updateFaq: (id, updates) => {
        set((state) => ({
          faqs: state.faqs.map((faq) =>
            faq.id === id
              ? { ...faq, ...updates, updatedAt: new Date() }
              : faq
          )
        }));
      },

      deleteFaq: (id) => {
        set((state) => ({
          faqs: state.faqs.filter((faq) => faq.id !== id)
        }));
      },

      toggleFaqStatus: (id) => {
        set((state) => ({
          faqs: state.faqs.map((faq) =>
            faq.id === id
              ? { ...faq, isActive: !faq.isActive, updatedAt: new Date() }
              : faq
          )
        }));
      },

      reorderFaqs: (reorderedFaqs) => {
        set({ faqs: reorderedFaqs });
      },

      getFaqsByCategory: (category) => {
        const { faqs } = get();
        if (!category || category === 'all') {
          return faqs.sort((a, b) => a.order - b.order);
        }
        return faqs
          .filter((faq) => faq.category === category)
          .sort((a, b) => a.order - b.order);
      },

      getActiveFaqs: () => {
        const { faqs } = get();
        return faqs
          .filter((faq) => faq.isActive)
          .sort((a, b) => a.order - b.order);
      },
    }),
    {
      name: 'faqs-storage',
    }
  )
); 