import { create } from 'zustand';

export interface WebUsageData {
  date: string;
  timeSpent: number; // minutos
  sessions: number;
}

export interface UserViewsData {
  date: string;
  views: number;
  uniqueVisitors: number;
}

export interface TrendingTopicsData {
  topic: string;
  views: number;
  engagement: number;
  growth: number;
}

export interface PlatformData {
  platform: string;
  posts: number;
  engagement: number;
  reach: number;
  color: string;
}

export interface RecentUsersData {
  date: string;
  registrations: number;
  verified: number;
}

export interface UserRetentionData {
  period: string;
  retention: number;
}

export interface UserActivityData {
  hour: string;
  active: number;
}

interface MetricsState {
  // Estadísticas generales
  webUsage: WebUsageData[];
  userViews: UserViewsData[];
  
  // Contenido
  trendingTopics: TrendingTopicsData[];
  leastVisitedTopics: TrendingTopicsData[];
  platformStats: PlatformData[];
  
  // Usuarios
  recentUsers: RecentUsersData[];
  userRetention: UserRetentionData[];
  userActivity: UserActivityData[];
  
  // Actions
  fetchMetrics: () => void;
  updateTimeRange: (range: '7d' | '30d' | '90d') => void;
}

// Datos mock
const generateWebUsageData = (): WebUsageData[] => [
  { date: '2024-01-01', timeSpent: 45, sessions: 1250 },
  { date: '2024-01-02', timeSpent: 52, sessions: 1380 },
  { date: '2024-01-03', timeSpent: 38, sessions: 1100 },
  { date: '2024-01-04', timeSpent: 48, sessions: 1420 },
  { date: '2024-01-05', timeSpent: 55, sessions: 1580 },
  { date: '2024-01-06', timeSpent: 62, sessions: 1720 },
  { date: '2024-01-07', timeSpent: 58, sessions: 1650 },
];

const generateUserViewsData = (): UserViewsData[] => [
  { date: '2024-01-01', views: 2500, uniqueVisitors: 1800 },
  { date: '2024-01-02', views: 2750, uniqueVisitors: 1950 },
  { date: '2024-01-03', views: 2200, uniqueVisitors: 1600 },
  { date: '2024-01-04', views: 2900, uniqueVisitors: 2100 },
  { date: '2024-01-05', views: 3100, uniqueVisitors: 2250 },
  { date: '2024-01-06', views: 3400, uniqueVisitors: 2400 },
  { date: '2024-01-07', views: 3200, uniqueVisitors: 2300 },
];

const generateTrendingTopics = (): TrendingTopicsData[] => [
  { topic: 'Marketing Digital', views: 15420, engagement: 8.5, growth: 25.3 },
  { topic: 'Redes Sociales', views: 12350, engagement: 7.2, growth: 18.7 },
  { topic: 'E-commerce', views: 9870, engagement: 6.8, growth: 22.1 },
  { topic: 'SEO', views: 8650, engagement: 9.1, growth: 15.4 },
  { topic: 'Content Marketing', views: 7540, engagement: 7.9, growth: 12.8 },
];

const generateLeastVisitedTopics = (): TrendingTopicsData[] => [
  { topic: 'Email Marketing', views: 1250, engagement: 3.2, growth: -5.2 },
  { topic: 'Affiliate Marketing', views: 980, engagement: 2.8, growth: -8.1 },
  { topic: 'Podcast Marketing', views: 850, engagement: 4.1, growth: -2.3 },
  { topic: 'PR Digital', views: 720, engagement: 3.5, growth: -6.7 },
  { topic: 'Marketing Automation', views: 650, engagement: 2.9, growth: -10.2 },
];

const generatePlatformStats = (): PlatformData[] => [
  { platform: 'Instagram', posts: 2450, engagement: 4.8, reach: 125000, color: '#E4405F' },
  { platform: 'Facebook', posts: 1890, engagement: 3.2, reach: 98000, color: '#1877F2' },
  { platform: 'Twitter/X', posts: 3200, engagement: 2.1, reach: 85000, color: '#000000' },
  { platform: 'LinkedIn', posts: 1150, engagement: 6.3, reach: 65000, color: '#0A66C2' },
  { platform: 'TikTok', posts: 980, engagement: 8.7, reach: 155000, color: '#FF0050' },
  { platform: 'YouTube', posts: 320, engagement: 12.4, reach: 220000, color: '#FF0000' },
];

const generateRecentUsers = (): RecentUsersData[] => [
  { date: '2024-01-01', registrations: 25, verified: 18 },
  { date: '2024-01-02', registrations: 32, verified: 24 },
  { date: '2024-01-03', registrations: 18, verified: 15 },
  { date: '2024-01-04', registrations: 41, verified: 35 },
  { date: '2024-01-05', registrations: 38, verified: 29 },
  { date: '2024-01-06', registrations: 45, verified: 38 },
  { date: '2024-01-07', registrations: 52, verified: 42 },
];

const generateUserRetention = (): UserRetentionData[] => [
  { period: 'Día 1', retention: 78 },
  { period: 'Día 7', retention: 45 },
  { period: 'Día 14', retention: 32 },
  { period: 'Día 30', retention: 24 },
  { period: 'Día 60', retention: 18 },
  { period: 'Día 90', retention: 15 },
];

const generateUserActivity = (): UserActivityData[] => [
  { hour: '00:00', active: 150 },
  { hour: '04:00', active: 89 },
  { hour: '08:00', active: 420 },
  { hour: '12:00', active: 680 },
  { hour: '16:00', active: 890 },
  { hour: '20:00', active: 750 },
];

export const useMetricsStore = create<MetricsState>((set) => ({
  // Estado inicial
  webUsage: generateWebUsageData(),
  userViews: generateUserViewsData(),
  trendingTopics: generateTrendingTopics(),
  leastVisitedTopics: generateLeastVisitedTopics(),
  platformStats: generatePlatformStats(),
  recentUsers: generateRecentUsers(),
  userRetention: generateUserRetention(),
  userActivity: generateUserActivity(),

  // Actions
  fetchMetrics: () => {
    // Simular llamada a API
    setTimeout(() => {
      set({
        webUsage: generateWebUsageData(),
        userViews: generateUserViewsData(),
        trendingTopics: generateTrendingTopics(),
        leastVisitedTopics: generateLeastVisitedTopics(),
        platformStats: generatePlatformStats(),
        recentUsers: generateRecentUsers(),
        userRetention: generateUserRetention(),
        userActivity: generateUserActivity(),
      });
    }, 1000);
  },

  updateTimeRange: (range: '7d' | '30d' | '90d') => {
    // Simular actualización de datos según el rango de tiempo
    console.log(`Actualizando métricas para el rango: ${range}`);
    // Aquí se implementaría la lógica para cambiar los datos según el rango
  },
})); 