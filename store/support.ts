import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ContactRequest {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  type: 'technical_problem' | 'configuration_assistance' | 'general_consultation';
  subject: string;
  message: string;
  status: 'pending' | 'responded';
  createdAt: Date;
  respondedAt?: Date;
  adminResponse?: string;
  adminId?: string;
}

interface SupportState {
  contactRequests: ContactRequest[];
  isSubmitting: boolean;
  submitContactRequest: (request: Omit<ContactRequest, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  getRequestById: (id: string) => ContactRequest | undefined;
  getRequestsByUserId: (userId: string) => ContactRequest[];
  respondToContactRequest: (requestId: string, response: string, adminId: string) => void;
}

export const useSupportStore = create<SupportState>()(
  persist(
    (set, get) => ({
      contactRequests: [],
      isSubmitting: false,

      submitContactRequest: async (requestData) => {
        set({ isSubmitting: true });
        
        // Simular delay de envío
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newRequest: ContactRequest = {
          ...requestData,
          id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: 'pending',
          createdAt: new Date(),
        };

        set(state => ({
          contactRequests: [...state.contactRequests, newRequest],
          isSubmitting: false
        }));
      },

      getRequestById: (id: string) => {
        return get().contactRequests.find(request => request.id === id);
      },

      getRequestsByUserId: (userId: string) => {
        return get().contactRequests.filter(request => request.userId === userId);
      },

      respondToContactRequest: (requestId: string, response: string, adminId: string) => {
        set(state => ({
          contactRequests: state.contactRequests.map(request =>
            request.id === requestId
              ? {
                  ...request,
                  status: 'responded' as const,
                  adminResponse: response,
                  adminId,
                  respondedAt: new Date()
                }
              : request
          )
        }));
      },
    }),
    {
      name: 'support-storage',
    }
  )
); 