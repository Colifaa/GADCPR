import { create } from 'zustand';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  identificationNumber?: string;
  identificationType?: 'DNI' | 'CC' | 'CE' | 'RUC';
  address?: string;
  registrationDate: Date;
  lastLogin?: Date;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  plan: 'free' | 'pro' | 'enterprise';
  credits: number;
  createdAt: Date;
  password?: string; // Solo para creación/edición
}

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  planType: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  startDate: Date;
  endDate?: Date;
  price: number;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  autoRenew: boolean;
}

interface SupportRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  type: 'technical_problem' | 'configuration_assistance' | 'general_consultation';
  title: string;
  description: string;
  attachmentUrl?: string;
  status: 'pending' | 'responded';
  createdAt: Date;
  respondedAt?: Date;
  adminResponse?: string;
  adminId?: string;
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

interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  identificationNumber?: string;
  identificationType?: 'DNI' | 'CC' | 'CE' | 'RUC';
  address?: string;
  status: AdminUser['status'];
  plan: AdminUser['plan'];
  credits: number;
  password?: string;
  confirmPassword?: string;
}

interface AdminState {
  users: AdminUser[];
  subscriptions: Subscription[];
  supportRequests: SupportRequest[];
  content: AdminContent[];
  transactions: AdminTransaction[];
  systemStats: SystemStats;
  
  // Actions
  updateUserStatus: (userId: string, status: AdminUser['status']) => void;
  deleteUser: (userId: string) => void;
  createUser: (userData: UserFormData) => Promise<AdminUser>;
  updateUser: (userId: string, userData: Partial<UserFormData>) => Promise<AdminUser>;
  getUserById: (userId: string) => AdminUser | undefined;
  updateContentStatus: (contentId: string, status: AdminContent['status']) => void;
  deleteContent: (contentId: string) => void;
  cancelSubscription: (subscriptionId: string) => void;
  respondToRequest: (requestId: string, response: string, adminId: string) => void;
  fetchAdminData: () => Promise<void>;
}

// Mock data
const mockUsers: AdminUser[] = [
  {
    id: '1',
    name: 'Juan Lopez',
    email: 'juan.lopez@example.com',
    phone: '+34 612 345 678',
    identificationNumber: '12345678A',
    identificationType: 'DNI',
    address: 'Calle Mayor 123, Madrid, España',
    registrationDate: new Date('2024-01-15'),
    status: 'active',
    plan: 'pro',
    credits: 150,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Maria Fuentes',
    email: 'maria.fuentes@example.com',
    phone: '+34 687 654 321',
    identificationNumber: '87654321B',
    identificationType: 'DNI',
    address: 'Avenida del Sol 45, Barcelona, España',
    registrationDate: new Date('2024-01-10'),
    status: 'active',
    plan: 'free',
    credits: 25,
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date('2024-01-19')
  },
  {
    id: '3',
    name: 'Elena Gomez',
    email: 'elena.gomez@example.com',
    phone: '+34 654 987 123',
    identificationNumber: '11223344C',
    identificationType: 'DNI',
    address: 'Plaza de la Constitución 7, Valencia, España',
    registrationDate: new Date('2024-01-05'),
    status: 'suspended',
    plan: 'enterprise',
    credits: 500,
    createdAt: new Date('2024-01-05'),
    lastLogin: new Date('2024-01-18')
  },
  {
    id: '4',
    name: 'Rosa Jaimez',
    email: 'rosa.jaimez@example.com',
    phone: '+34 666 111 222',
    identificationNumber: '55667788D',
    identificationType: 'DNI',
    address: 'Calle de la Paz 89, Sevilla, España',
    registrationDate: new Date('2024-01-20'),
    status: 'pending',
    plan: 'free',
    credits: 50,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '5',
    name: 'Pedro Garcia',
    email: 'pedro.garcia@example.com',
    phone: '+34 677 888 999',
    identificationNumber: '99887766E',
    identificationType: 'DNI',
    address: 'Paseo de Gracia 156, Barcelona, España',
    registrationDate: new Date('2024-01-12'),
    status: 'active',
    plan: 'pro',
    credits: 200,
    createdAt: new Date('2024-01-12'),
    lastLogin: new Date('2024-01-21')
  },
  {
    id: '6',
    name: 'Lupita Perez',
    email: 'lupita.perez@example.com',
    phone: '+34 611 222 333',
    identificationNumber: '33445566F',
    identificationType: 'DNI',
    address: 'Gran Via 78, Madrid, España',
    registrationDate: new Date('2024-01-08'),
    status: 'active',
    plan: 'free',
    credits: 75,
    createdAt: new Date('2024-01-08'),
    lastLogin: new Date('2024-01-22')
  },
  {
    id: '7',
    name: 'Juana Fernández',
    email: 'juana.fernandez@example.com',
    phone: '+34 644 555 666',
    identificationNumber: '77889900G',
    identificationType: 'DNI',
    address: 'Calle del Carmen 34, Bilbao, España',
    registrationDate: new Date('2024-01-03'),
    status: 'inactive',
    plan: 'pro',
    credits: 120,
    createdAt: new Date('2024-01-03'),
    lastLogin: new Date('2024-01-10')
  },
  {
    id: '8',
    name: 'Mariam García',
    email: 'mariam.garcia@example.com',
    phone: '+34 655 777 888',
    identificationNumber: '12987654H',
    identificationType: 'DNI',
    address: 'Plaza España 12, Málaga, España',
    registrationDate: new Date('2024-01-25'),
    status: 'active',
    plan: 'enterprise',
    credits: 800,
    createdAt: new Date('2024-01-25'),
    lastLogin: new Date('2024-01-26')
  },
  {
    id: '9',
    name: 'Daniel Rojas',
    email: 'daniel.rojas@example.com',
    phone: '+34 622 333 444',
    identificationNumber: '45612378I',
    identificationType: 'DNI',
    address: 'Ronda de Toledo 90, Madrid, España',
    registrationDate: new Date('2024-01-18'),
    status: 'active',
    plan: 'free',
    credits: 30,
    createdAt: new Date('2024-01-18'),
    lastLogin: new Date('2024-01-24')
  },
  {
    id: '10',
    name: 'Daniela Castillo',
    email: 'daniela.castillo@example.com',
    phone: '+34 633 444 555',
    identificationNumber: '78945612J',
    identificationType: 'DNI',
    address: 'Alameda Principal 67, Málaga, España',
    registrationDate: new Date('2024-01-14'),
    status: 'pending',
    plan: 'pro',
    credits: 0,
    createdAt: new Date('2024-01-14')
  },
  {
    id: '11',
    name: 'Cesar Torres',
    email: 'cesar.torres@example.com',
    phone: '+34 699 111 222',
    identificationNumber: '36925814K',
    identificationType: 'DNI',
    address: 'Calle Sierpes 23, Sevilla, España',
    registrationDate: new Date('2024-01-07'),
    status: 'active',
    plan: 'free',
    credits: 45,
    createdAt: new Date('2024-01-07'),
    lastLogin: new Date('2024-01-23')
  },
  {
    id: '12',
    name: 'Camila Moreno',
    email: 'camila.moreno@example.com',
    phone: '+34 688 999 000',
    identificationNumber: '15975348L',
    identificationType: 'DNI',
    address: 'Carrer de Pelai 102, Barcelona, España',
    registrationDate: new Date('2024-01-11'),
    status: 'active',
    plan: 'enterprise',
    credits: 650,
    createdAt: new Date('2024-01-11'),
    lastLogin: new Date('2024-01-25')
  }
];

// Mock subscriptions data - based on real users
const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    userId: '1',
    userName: 'Juan Lopez',
    userEmail: 'juan.lopez@example.com',
    userPhone: '+34 612 345 678',
    planType: 'pro',
    status: 'active',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-15'),
    price: 29.99,
    paymentMethod: 'credit_card',
    autoRenew: true
  },
  {
    id: 'sub-2',
    userId: '5',
    userName: 'Pedro Garcia',
    userEmail: 'pedro.garcia@example.com',
    userPhone: '+34 677 888 999',
    planType: 'pro',
    status: 'active',
    startDate: new Date('2024-01-12'),
    endDate: new Date('2024-02-12'),
    price: 29.99,
    paymentMethod: 'paypal',
    autoRenew: true
  },
  {
    id: 'sub-3',
    userId: '3',
    userName: 'Elena Gomez',
    userEmail: 'elena.gomez@example.com',
    userPhone: '+34 654 987 123',
    planType: 'enterprise',
    status: 'active',
    startDate: new Date('2024-01-05'),
    endDate: new Date('2024-02-05'),
    price: 99.99,
    paymentMethod: 'bank_transfer',
    autoRenew: false
  },
  {
    id: 'sub-4',
    userId: '7',
    userName: 'Juana Fernández',
    userEmail: 'juana.fernandez@example.com',
    userPhone: '+34 644 555 666',
    planType: 'pro',
    status: 'expired',
    startDate: new Date('2024-01-03'),
    endDate: new Date('2024-01-10'),
    price: 29.99,
    paymentMethod: 'credit_card',
    autoRenew: false
  },
  {
    id: 'sub-5',
    userId: '8',
    userName: 'Mariam García',
    userEmail: 'mariam.garcia@example.com',
    userPhone: '+34 655 777 888',
    planType: 'enterprise',
    status: 'active',
    startDate: new Date('2024-01-25'),
    endDate: new Date('2024-02-25'),
    price: 99.99,
    paymentMethod: 'credit_card',
    autoRenew: true
  },
  {
    id: 'sub-6',
    userId: '10',
    userName: 'Daniela Castillo',
    userEmail: 'daniela.castillo@example.com',
    userPhone: '+34 633 444 555',
    planType: 'pro',
    status: 'cancelled',
    startDate: new Date('2024-01-14'),
    endDate: new Date('2024-01-20'),
    price: 29.99,
    paymentMethod: 'paypal',
    autoRenew: false
  },
  {
    id: 'sub-7',
    userId: '12',
    userName: 'Camila Moreno',
    userEmail: 'camila.moreno@example.com',
    userPhone: '+34 688 999 000',
    planType: 'enterprise',
    status: 'active',
    startDate: new Date('2024-01-11'),
    endDate: new Date('2024-02-11'),
    price: 99.99,
    paymentMethod: 'credit_card',
    autoRenew: true
  }
];

// Mock support requests data
const mockSupportRequests: SupportRequest[] = [
  {
    id: 'req-1',
    userId: '2',
    userName: 'Maria Fuentes',
    userEmail: 'maria.fuentes@example.com',
    userPhone: '+34 687 654 321',
    type: 'configuration_assistance',
    title: 'Asistencia en la configuración',
    description: 'Ve a la sección de "Plantillas", selecciona la que desees y sigue los pasos para personalizarla. Si necesitas más ayuda, contáctanos.',
    status: 'pending',
    createdAt: new Date('2024-01-26'),
  },
  {
    id: 'req-2',
    userId: '1',
    userName: 'Juan Lopez',
    userEmail: 'juan.lopez@example.com',
    userPhone: '+34 612 345 678',
    type: 'technical_problem',
    title: 'Problema técnico',
    description: 'No puedo acceder a la plataforma. Lamentamos los inconvenientes que estás experimentando. Te recomendaríamos intenta lo siguiente: Revisa la conexión a internet y asegúrate de que tus navegador, intenta cargar la página utilizando otro navegador o verifica tu conexión a Internet. Si el problema persiste, reinstala tu contraseña.',
    status: 'pending',
    createdAt: new Date('2024-01-25'),
  },
  {
    id: 'req-3',
    userId: '5',
    userName: 'Pedro Garcia',
    userEmail: 'pedro.garcia@example.com',
    userPhone: '+34 677 888 999',
    type: 'general_consultation',
    title: '¿Qué tipos de contenido puedo generar?',
    description: 'Puedes crear entradas de blog, publicaciones en redes sociales, y contenido para noticias. Consulta la guía para ejemplos específicos.',
    status: 'responded',
    createdAt: new Date('2024-01-24'),
    respondedAt: new Date('2024-01-24'),
    adminResponse: 'Puedes generar contenido para blog, redes sociales (Instagram, Facebook, Twitter), newsletters, y descripciones de productos. También tenemos plantillas específicas para cada tipo de contenido que te ayudarán a empezar.',
    adminId: 'admin-1'
  },
  {
    id: 'req-4',
    userId: '8',
    userName: 'Mariam García',
    userEmail: 'mariam.garcia@example.com',
    userPhone: '+34 655 777 888',
    type: 'general_consultation',
    title: 'Mi contenido no se publica en redes sociales',
    description: 'Verifica las conexiones de API y asegúrate de que tengas permisos para publicar. También puedes intentar reautorizar tu cuenta.',
    status: 'responded',
    createdAt: new Date('2024-01-23'),
    respondedAt: new Date('2024-01-23'),
    adminResponse: 'Para solucionar este problema, primero verifica que tienes las conexiones de API configuradas correctamente en tu perfil. También asegúrate de que tienes los permisos necesarios para publicar en cada red social. Si el problema persiste, intenta desconectar y volver a conectar tus cuentas de redes sociales.',
    adminId: 'admin-1'
  },
  {
    id: 'req-5',
    userId: '11',
    userName: 'Cesar Torres',
    userEmail: 'cesar.torres@example.com',
    userPhone: '+34 699 111 222',
    type: 'configuration_assistance',
    title: '¿Puedo programar publicaciones?',
    description: 'Por el momento el contenido no puede ser programado, será necesario que generes y subas el contenido por tu propia cuenta.',
    status: 'pending',
    createdAt: new Date('2024-01-22'),
  },
  {
    id: 'req-6',
    userId: '3',
    userName: 'Elena Gomez',
    userEmail: 'elena.gomez@example.com',
    userPhone: '+34 654 987 123',
    type: 'technical_problem',
    title: 'La página no se carga correctamente en mi navegador',
    description: 'Lamentamos los inconvenientes que estás experimentando. Te recomendamos intenta lo siguiente: Revisa la conexión a internet y asegúrate de que tus navegador está actualizado, intenta cargar la página utilizando otro navegador o verifica tu conexión a Internet. Si el problema persiste, reinstala la contraseña.',
    attachmentUrl: 'https://via.placeholder.com/400x300/e3f2fd/1976d2?text=Screenshot+Error',
    status: 'pending',
    createdAt: new Date('2024-01-21'),
  },
  {
    id: 'req-7',
    userId: '6',
    userName: 'Lupita Perez',
    userEmail: 'lupita.perez@example.com',
    userPhone: '+34 611 222 333',
    type: 'general_consultation',
    title: 'Dudas sobre el Uso de la Plataforma',
    description: '¿Podrían proporcionarme información sobre las principales características de la plataforma? Estoy interesado en saber más sobre las herramientas disponibles para gestionar contenido y mejorar mi visibilidad en línea.',
    status: 'pending',
    createdAt: new Date('2024-01-20'),
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
    authorName: 'Juan Lopez',
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
    authorName: 'Maria Fuentes',
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
    authorName: 'Elena Gomez',
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
    authorName: 'Juan Lopez',
    createdAt: new Date('2024-01-12')
  },
  {
    id: '5',
    title: 'Fitness Motivation Monday',
    type: 'story',
    platform: 'instagram',
    status: 'published',
    authorId: '5',
    authorName: 'Pedro Garcia',
    createdAt: new Date('2024-01-11'),
    engagement: { likes: 67, shares: 8, comments: 12, views: 189 }
  }
];

const mockTransactions: AdminTransaction[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Juan Lopez',
    type: 'subscription',
    amount: 29.99,
    description: 'Pro Plan - Suscripción Mensual',
    date: new Date('2024-01-01'),
    status: 'completed'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Maria Fuentes',
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
    userName: 'Elena Gomez',
    type: 'subscription',
    amount: 99.99,
    description: 'Enterprise Plan - Suscripción Mensual',
    date: new Date('2024-01-05'),
    status: 'completed'
  },
  {
    id: '4',
    userId: '5',
    userName: 'Pedro Garcia',
    type: 'subscription',
    amount: 29.99,
    description: 'Pro Plan - Suscripción Mensual',
    date: new Date('2024-01-15'),
    status: 'pending'
  },
  {
    id: '5',
    userId: '1',
    userName: 'Juan Lopez',
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
  subscriptions: mockSubscriptions,
  supportRequests: mockSupportRequests,
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
    
    // Sincronizar con la base de datos de autenticación
    try {
      const authUsers = JSON.parse(localStorage.getItem('users-db') || '[]');
      const updatedAuthUsers = authUsers.map((user: any) => {
        // Buscar por email ya que puede que los IDs no coincidan
        const adminUser = users.find(u => u.email === user.email);
        if (adminUser && adminUser.id === userId) {
          return { ...user, status };
        }
        return user;
      });
      localStorage.setItem('users-db', JSON.stringify(updatedAuthUsers));
      console.log('✅ Estado de usuario sincronizado con base de datos de autenticación');
    } catch (error) {
      console.error('❌ Error al sincronizar estado de usuario:', error);
    }
  },
  
  deleteUser: (userId) => {
    const users = get().users;
    set({
      users: users.filter(user => user.id !== userId)
    });
  },

  createUser: async (userData: UserFormData): Promise<AdminUser> => {
    const newUser: AdminUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      identificationNumber: userData.identificationNumber,
      identificationType: userData.identificationType,
      address: userData.address,
      registrationDate: new Date(),
      status: userData.status,
      plan: userData.plan,
      credits: userData.credits,
      createdAt: new Date(),
    };

    const users = get().users;
    set({ users: [...users, newUser] });
    
    return newUser;
  },

  updateUser: async (userId: string, userData: Partial<UserFormData>): Promise<AdminUser> => {
    const users = get().users;
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            ...userData,
            // No actualizar registrationDate ni createdAt
            registrationDate: user.registrationDate,
            createdAt: user.createdAt
          }
        : user
    );
    
    set({ users: updatedUsers });
    
    const updatedUser = updatedUsers.find(user => user.id === userId);
    if (!updatedUser) {
      throw new Error('Usuario no encontrado');
    }
    
    return updatedUser;
  },

  getUserById: (userId: string) => {
    return get().users.find(user => user.id === userId);
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

  cancelSubscription: (subscriptionId) => {
    const subscriptions = get().subscriptions;
    set({
      subscriptions: subscriptions.map(sub =>
        sub.id === subscriptionId ? { ...sub, status: 'cancelled' as const } : sub
      )
    });
  },

  respondToRequest: (requestId: string, response: string, adminId: string) => {
    const supportRequests = get().supportRequests;
    set({
      supportRequests: supportRequests.map(request =>
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
    });
  },
  
  fetchAdminData: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Data is already loaded from mock data
  }
}));

export type { AdminUser, UserFormData, Subscription, SupportRequest };