import { create } from 'zustand';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  plan: 'free' | 'pro' | 'enterprise';
  credits: number;
  createdAt: Date;
  lastLogin?: Date;
}

interface AdminContent {
  id: string;
  title: string;
  type: 'post' | 'video' | 'podcast' | 'story';
  platform: 'instagram' | 'twitter' | 'youtube' | 'tiktok' | 'linkedin' | 'spotify';
  status: 'published' | 'draft' | 'flagged';
  authorId: string;
  authorName: string;
  createdAt: Date;
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
}

interface AdminTransaction {
  id: string;
  userId: string;
  userName: string;
  type: 'credit_purchase' | 'subscription' | 'usage';
  amount: number;
  credits?: number;
  description: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
}

interface SystemStats {
  totalUsers: number;
  newUsersThisMonth: number;
  totalContent: number;
  contentThisMonth: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  activeUsers: number;
}

interface AdminState {
  users: AdminUser[];
  content: AdminContent[];
  transactions: AdminTransaction[];
  systemStats: SystemStats;
  
  // Actions
  updateUserStatus: (userId: string, status: AdminUser['status']) => void;
  deleteUser: (userId: string) => void;
  updateContentStatus: (contentId: string, status: AdminContent['status']) => void;
  deleteContent: (contentId: string) => void;
  fetchAdminData: () => Promise<void>;
}

// Mock data
const mockUsers: AdminUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    plan: 'pro',
    credits: 150,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'active',
    plan: 'free',
    credits: 25,
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date('2024-01-19')
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    status: 'suspended',
    plan: 'enterprise',
    credits: 500,
    createdAt: new Date('2024-01-05'),
    lastLogin: new Date('2024-01-18')
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    status: 'pending',
    plan: 'free',
    credits: 50,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    status: 'active',
    plan: 'pro',
    credits: 200,
    createdAt: new Date('2024-01-12'),
    lastLogin: new Date('2024-01-21')
  }
];

const mockContent: AdminContent[] = [
  {
    id: '1',
    title: 'Summer Marketing Tips for Small Businesses',
    type: 'post',
    platform: 'linkedin',
    status: 'published',
    authorId: '1',
    authorName: 'John Doe',
    createdAt: new Date('2024-01-15'),
    engagement: { likes: 45, shares: 12, comments: 8, views: 234 }
  },
  {
    id: '2',
    title: 'Quick Recipe: 5-Minute Breakfast Ideas',
    type: 'video',
    platform: 'instagram',
    status: 'published',
    authorId: '2',
    authorName: 'Jane Smith',
    createdAt: new Date('2024-01-14'),
    engagement: { likes: 89, shares: 23, comments: 15, views: 456 }
  },
  {
    id: '3',
    title: 'Controversial Political Opinion',
    type: 'post',
    platform: 'twitter',
    status: 'flagged',
    authorId: '3',
    authorName: 'Mike Johnson',
    createdAt: new Date('2024-01-13'),
    engagement: { likes: 12, shares: 3, comments: 45, views: 123 }
  },
  {
    id: '4',
    title: 'Tech Trends 2024: What to Expect',
    type: 'podcast',
    platform: 'spotify',
    status: 'draft',
    authorId: '1',
    authorName: 'John Doe',
    createdAt: new Date('2024-01-12')
  },
  {
    id: '5',
    title: 'Fitness Motivation Monday',
    type: 'story',
    platform: 'instagram',
    status: 'published',
    authorId: '5',
    authorName: 'David Brown',
    createdAt: new Date('2024-01-11'),
    engagement: { likes: 67, shares: 8, comments: 12, views: 189 }
  }
];

const mockTransactions: AdminTransaction[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    type: 'subscription',
    amount: 29.99,
    description: 'Pro Plan - Suscripción Mensual',
    date: new Date('2024-01-01'),
    status: 'completed'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Smith',
    type: 'credit_purchase',
    amount: 9.99,
    credits: 100,
    description: 'Compra de Créditos Adicionales',
    date: new Date('2024-01-10'),
    status: 'completed'
  },
  {
    id: '3',
    userId: '3',
    userName: 'Mike Johnson',
    type: 'subscription',
    amount: 99.99,
    description: 'Enterprise Plan - Suscripción Mensual',
    date: new Date('2024-01-05'),
    status: 'completed'
  },
  {
    id: '4',
    userId: '5',
    userName: 'David Brown',
    type: 'subscription',
    amount: 29.99,
    description: 'Pro Plan - Suscripción Mensual',
    date: new Date('2024-01-15'),
    status: 'pending'
  },
  {
    id: '5',
    userId: '1',
    userName: 'John Doe',
    type: 'usage',
    amount: 0,
    credits: -5,
    description: 'Generación de Post para LinkedIn',
    date: new Date('2024-01-15'),
    status: 'completed'
  }
];

export const useAdminStore = create<AdminState>((set, get) => ({
  users: mockUsers,
  content: mockContent,
  transactions: mockTransactions,
  systemStats: {
    totalUsers: 1247,
    newUsersThisMonth: 89,
    totalContent: 5432,
    contentThisMonth: 234,
    monthlyRevenue: 15420,
    revenueGrowth: 12.5,
    activeUsers: 892
  },
  
  updateUserStatus: (userId, status) => {
    const users = get().users;
    set({
      users: users.map(user =>
        user.id === userId ? { ...user, status } : user
      )
    });
  },
  
  deleteUser: (userId) => {
    const users = get().users;
    set({
      users: users.filter(user => user.id !== userId)
    });
  },
  
  updateContentStatus: (contentId, status) => {
    const content = get().content;
    set({
      content: content.map(item =>
        item.id === contentId ? { ...item, status } : item
      )
    });
  },
  
  deleteContent: (contentId) => {
    const content = get().content;
    set({
      content: content.filter(item => item.id !== contentId)
    });
  },
  
  fetchAdminData: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Data is already loaded from mock data
  }
}));