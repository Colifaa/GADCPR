import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PaymentItem {
  id: string;
  title: string;
  amount: number;
  quantity?: number;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'stripe' | 'bank_transfer';
  transactionId: string;
  description: string;
  items: PaymentItem[];
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
  metadata?: {
    plan?: 'basic' | 'premium' | 'enterprise';
    billingPeriod?: 'monthly' | 'yearly';
    couponCode?: string;
    refundReason?: string;
  };
}

interface PaymentsState {
  payments: Payment[];
  isLoading: boolean;
  selectedPayment: Payment | null;
  
  // Actions
  setPayments: (payments: Payment[]) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePayment: (id: string, updates: Partial<Omit<Payment, 'id' | 'createdAt'>>) => void;
  setSelectedPayment: (payment: Payment | null) => void;
  getPaymentsByStatus: (status: Payment['status']) => Payment[];
  getPaymentsByUser: (userId: string) => Payment[];
  getTotalRevenue: () => number;
  getRevenueByPeriod: (startDate: Date, endDate: Date) => number;
}

// Datos iniciales de ejemplo
const initialPayments: Payment[] = [
  {
    id: '1',
    userId: 'user-1',
    userName: 'Mariam Lopez',
    userEmail: 'mariamlpz@gmail.com',
    amount: 5.50,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'credit_card',
    transactionId: 'txn_1234567890',
    description: 'Suscripción Premium - Mensual',
    items: [
      {
        id: 'item-1',
        title: 'Suscripción Premium',
        amount: 5.50,
        quantity: 1
      }
    ],
    createdAt: new Date('2024-08-15T10:30:00'),
    updatedAt: new Date('2024-08-15T10:30:00'),
    processedAt: new Date('2024-08-15T10:30:00'),
    metadata: {
      plan: 'premium',
      billingPeriod: 'monthly'
    }
  },
  {
    id: '2',
    userId: 'user-2',
    userName: 'Carlos Rodriguez',
    userEmail: 'carlos.rod@gmail.com',
    amount: 12.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'paypal',
    transactionId: 'txn_0987654321',
    description: 'Plan Enterprise - Mensual',
    items: [
      {
        id: 'item-2',
        title: 'Plan Enterprise',
        amount: 10.99,
        quantity: 1
      },
      {
        id: 'item-3',
        title: 'Funciones Adicionales',
        amount: 2.00,
        quantity: 1
      }
    ],
    createdAt: new Date('2024-08-14T15:45:00'),
    updatedAt: new Date('2024-08-14T15:45:00'),
    processedAt: new Date('2024-08-14T15:45:00'),
    metadata: {
      plan: 'enterprise',
      billingPeriod: 'monthly'
    }
  },
  {
    id: '3',
    userId: 'user-3',
    userName: 'Ana Martinez',
    userEmail: 'ana.martinez@email.com',
    amount: 8.99,
    currency: 'USD',
    status: 'pending',
    paymentMethod: 'credit_card',
    transactionId: 'txn_1122334455',
    description: 'Renovación Premium',
    items: [
      {
        id: 'item-4',
        title: 'Renovación Premium',
        amount: 8.99,
        quantity: 1
      }
    ],
    createdAt: new Date('2024-08-16T09:15:00'),
    updatedAt: new Date('2024-08-16T09:15:00'),
    metadata: {
      plan: 'premium',
      billingPeriod: 'monthly'
    }
  },
  {
    id: '4',
    userId: 'user-4',
    userName: 'Roberto Silva',
    userEmail: 'roberto.silva@company.com',
    amount: 99.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'stripe',
    transactionId: 'txn_9988776655',
    description: 'Plan Enterprise - Anual',
    items: [
      {
        id: 'item-5',
        title: 'Plan Enterprise Anual',
        amount: 89.99,
        quantity: 1
      },
      {
        id: 'item-6',
        title: 'Descuento por pago anual',
        amount: -10.00,
        quantity: 1
      },
      {
        id: 'item-7',
        title: 'Soporte Premium',
        amount: 20.00,
        quantity: 1
      }
    ],
    createdAt: new Date('2024-08-10T14:22:00'),
    updatedAt: new Date('2024-08-10T14:22:00'),
    processedAt: new Date('2024-08-10T14:22:00'),
    metadata: {
      plan: 'enterprise',
      billingPeriod: 'yearly',
      couponCode: 'ANNUAL20'
    }
  },
  {
    id: '5',
    userId: 'user-5',
    userName: 'Laura Gonzalez',
    userEmail: 'laura.gonzalez@startup.io',
    amount: 3.99,
    currency: 'USD',
    status: 'failed',
    paymentMethod: 'credit_card',
    transactionId: 'txn_5544332211',
    description: 'Plan Básico - Mensual',
    items: [
      {
        id: 'item-8',
        title: 'Plan Básico',
        amount: 3.99,
        quantity: 1
      }
    ],
    createdAt: new Date('2024-08-17T11:30:00'),
    updatedAt: new Date('2024-08-17T11:35:00'),
    metadata: {
      plan: 'basic',
      billingPeriod: 'monthly'
    }
  }
];

export const usePaymentsStore = create<PaymentsState>()(
  persist(
    (set, get) => ({
      payments: initialPayments,
      isLoading: false,
      selectedPayment: null,

      setPayments: (payments) => set({ payments }),

      addPayment: (paymentData) => {
        const newPayment: Payment = {
          ...paymentData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          payments: [newPayment, ...state.payments]
        }));
      },

      updatePayment: (id, updates) => {
        set((state) => ({
          payments: state.payments.map((payment) =>
            payment.id === id
              ? { ...payment, ...updates, updatedAt: new Date() }
              : payment
          )
        }));
      },

      setSelectedPayment: (payment) => set({ selectedPayment: payment }),

      getPaymentsByStatus: (status) => {
        const { payments } = get();
        return payments.filter((payment) => payment.status === status);
      },

      getPaymentsByUser: (userId) => {
        const { payments } = get();
        return payments.filter((payment) => payment.userId === userId);
      },

      getTotalRevenue: () => {
        const { payments } = get();
        return payments
          .filter((payment) => payment.status === 'completed')
          .reduce((total, payment) => total + payment.amount, 0);
      },

      getRevenueByPeriod: (startDate, endDate) => {
        const { payments } = get();
        return payments
          .filter((payment) => 
            payment.status === 'completed' &&
            payment.createdAt >= startDate &&
            payment.createdAt <= endDate
          )
          .reduce((total, payment) => total + payment.amount, 0);
      },
    }),
    {
      name: 'payments-storage',
    }
  )
); 