import { create } from 'zustand';

interface ContentItem {
  id: string;
  title: string;
  type: 'post' | 'video' | 'podcast' | 'story';
  platform: 'instagram' | 'twitter' | 'youtube' | 'tiktok' | 'linkedin' | 'spotify';
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  createdAt: Date;
  scheduledAt?: Date;
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
}

interface Transaction {
  id: string;
  type: 'credit_purchase' | 'subscription' | 'usage';
  amount: number;
  credits?: number;
  description: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
}

interface DashboardStats {
  totalContent: number;
  publishedThisMonth: number;
  totalEngagement: number;
  creditsUsed: number;
  creditsRemaining: number;
}

interface DashboardState {
  stats: DashboardStats;
  recentContent: ContentItem[];
  transactions: Transaction[];
  isLoading: boolean;
  
  // Actions
  fetchDashboardData: () => Promise<void>;
  generateContent: (type: ContentItem['type'], platform: ContentItem['platform']) => Promise<void>;
  deleteContent: (id: string) => void;
  scheduleContent: (id: string, scheduledAt: Date) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

// Mock data
const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Summer Marketing Tips for Small Businesses',
    type: 'post',
    platform: 'linkedin',
    status: 'published',
    createdAt: new Date('2024-01-15'),
    engagement: { likes: 45, shares: 12, comments: 8, views: 234 }
  },
  {
    id: '2',
    title: 'Quick Recipe: 5-Minute Breakfast Ideas',
    type: 'video',
    platform: 'instagram',
    status: 'scheduled',
    createdAt: new Date('2024-01-14'),
    scheduledAt: new Date('2024-01-16')
  },
  {
    id: '3',
    title: 'Tech Trends 2024: What to Expect',
    type: 'podcast',
    platform: 'spotify',
    status: 'draft',
    createdAt: new Date('2024-01-13')
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'subscription',
    amount: 29.99,
    description: 'Pro Plan - Monthly Subscription',
    date: new Date('2024-01-01'),
    status: 'completed'
  },
  {
    id: '2',
    type: 'credit_purchase',
    amount: 9.99,
    credits: 100,
    description: 'Additional Credits Purchase',
    date: new Date('2024-01-10'),
    status: 'completed'
  },
  {
    id: '3',
    type: 'usage',
    amount: 0,
    credits: -5,
    description: 'LinkedIn Post Generation',
    date: new Date('2024-01-15'),
    status: 'completed'
  }
];

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: {
    totalContent: 12,
    publishedThisMonth: 8,
    totalEngagement: 1247,
    creditsUsed: 45,
    creditsRemaining: 105
  },
  recentContent: mockContent,
  transactions: mockTransactions,
  isLoading: false,
  
  fetchDashboardData: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ isLoading: false });
  },
  
  generateContent: async (type, platform) => {
    set({ isLoading: true });
    
    // Simulate content generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newContent: ContentItem = {
      id: Date.now().toString(),
      title: `Generated ${type} for ${platform}`,
      type,
      platform,
      status: 'draft',
      createdAt: new Date()
    };
    
    const currentContent = get().recentContent;
    const currentStats = get().stats;
    
    set({
      recentContent: [newContent, ...currentContent],
      stats: {
        ...currentStats,
        totalContent: currentStats.totalContent + 1,
        creditsUsed: currentStats.creditsUsed + 5,
        creditsRemaining: currentStats.creditsRemaining - 5
      },
      isLoading: false
    });
  },
  
  deleteContent: (id) => {
    const currentContent = get().recentContent;
    set({
      recentContent: currentContent.filter(item => item.id !== id)
    });
  },
  
  scheduleContent: (id, scheduledAt) => {
    const currentContent = get().recentContent;
    set({
      recentContent: currentContent.map(item =>
        item.id === id ? { ...item, status: 'scheduled', scheduledAt } : item
      )
    });
  },
  
  addTransaction: (transaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    
    const currentTransactions = get().transactions;
    set({
      transactions: [newTransaction, ...currentTransactions]
    });
  }
}));