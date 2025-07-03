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
        // Ya no agregamos imágenes sugeridas por defecto para permitir que Unsplash o el usuario provean imágenes.
        // Esta función se mantiene por compatibilidad, pero ahora no realiza cambios.
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
        // Antes se restauraban las 3 imágenes por defecto. Ahora simplemente se eliminan todas.
        set({ images: [] });
      },
    }),
    {
      name: 'user-images-storage',
    }
  )
) 