import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserImage {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedAt: string
  isSuggested?: boolean // Para identificar imágenes sugeridas
}

interface UserImagesStore {
  images: UserImage[]
  addImage: (image: Omit<UserImage, 'id' | 'uploadedAt'>) => void
  removeImage: (id: string) => void
  clearImages: () => void
  getImagesByType: (type?: string) => UserImage[]
  addSuggestedImages: () => void
  getSuggestedImages: () => UserImage[]
  getUserImages: () => UserImage[]
  getStorageInfo: () => { totalSize: number; imageCount: number; userCount: number; suggestedCount: number }
  clearUserImages: () => void
  resetToDefaultImages: () => void
}

export const useUserImagesStore = create<UserImagesStore>()(
  persist(
    (set, get) => ({
      images: [],

      addImage: (imageData) => {
        const newImage: UserImage = {
          ...imageData,
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          uploadedAt: new Date().toISOString(),
        }
        
        try {
          set((state) => ({
            images: [newImage, ...state.images]
          }))
        } catch (error) {
          // Si falla por cuota excedida, lanzar error específico
          if (error instanceof Error && error.message.includes('QuotaExceeded')) {
            throw new Error('QuotaExceeded: No hay suficiente espacio de almacenamiento');
          }
          throw error;
        }
      },

      removeImage: (id) => {
        set((state) => ({
          images: state.images.filter(img => img.id !== id)
        }))
      },

      clearImages: () => {
        set({ images: [] })
      },

      getImagesByType: (type) => {
        const state = get()
        if (!type) return state.images
        return state.images.filter(img => img.type.includes(type))
      },

      addSuggestedImages: () => {
        const suggestedImages = [
          {
            id: 'suggested-1',
            name: 'Landing 1',
            url: '/images/landing/landing.png',
            type: 'image/png',
            size: 0,
            uploadedAt: new Date().toISOString(),
            isSuggested: true
          },
          {
            id: 'suggested-2',
            name: 'Landing 2',
            url: '/images/landing/landing2.png',
            type: 'image/png',
            size: 0,
            uploadedAt: new Date().toISOString(),
            isSuggested: true
          },
          {
            id: 'suggested-3',
            name: 'Landing 3',
            url: '/images/landing/landing3.png',
            type: 'image/png',
            size: 0,
            uploadedAt: new Date().toISOString(),
            isSuggested: true
          }
        ];

        set((state) => {
          // Solo agregar las que no existan ya
          const existingIds = state.images.map(img => img.id);
          const newSuggested = suggestedImages.filter(img => !existingIds.includes(img.id));
          
          return {
            images: [...state.images, ...newSuggested]
          }
        })
      },

      getSuggestedImages: () => {
        const state = get()
        return state.images.filter(img => img.isSuggested === true)
      },

      getUserImages: () => {
        const state = get()
        return state.images.filter(img => !img.isSuggested)
      },

      getStorageInfo: () => {
        const state = get()
        const totalSize = state.images.reduce((acc, img) => acc + img.size, 0)
        const userImages = state.images.filter(img => !img.isSuggested)
        const suggestedImages = state.images.filter(img => img.isSuggested)
        
        return {
          totalSize,
          imageCount: state.images.length,
          userCount: userImages.length,
          suggestedCount: suggestedImages.length
        }
      },

      clearUserImages: () => {
        set((state) => ({
          images: state.images.filter(img => img.isSuggested)
        }))
      },

      resetToDefaultImages: () => {
        // Eliminar todas las imágenes y agregar solo las por defecto
        set({ images: [] });
        
        const suggestedImages = [
          {
            id: 'suggested-1',
            name: 'Landing 1',
            url: '/images/landing/landing.png',
            type: 'image/png',
            size: 0,
            uploadedAt: new Date().toISOString(),
            isSuggested: true
          },
          {
            id: 'suggested-2',
            name: 'Landing 2',
            url: '/images/landing/landing2.png',
            type: 'image/png',
            size: 0,
            uploadedAt: new Date().toISOString(),
            isSuggested: true
          },
          {
            id: 'suggested-3',
            name: 'Landing 3',
            url: '/images/landing/landing3.png',
            type: 'image/png',
            size: 0,
            uploadedAt: new Date().toISOString(),
            isSuggested: true
          }
        ];

        set({ images: suggestedImages });
      },
    }),
    {
      name: 'user-images-storage',
    }
  )
) 