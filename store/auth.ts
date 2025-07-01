import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Importar las preferencias del usuario
export interface UserPreferences {
  interestTopics: string[];
  contentFormat: string[];
  tone: string;
  frequency: string;
  targetAudience: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  nickname?: string;
  plan: 'free' | 'pro' | 'enterprise' | 'admin';
  credits: number;
  preferences?: UserPreferences;
  hasCompletedOnboarding?: boolean;
  phone?: string;
  document?: string;
  country?: string;
  subscription?: 'gratuita' | 'paga' | 'equipo';
  role: 'user' | 'admin';
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, nickname?: string, role?: 'user' | 'admin') => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateUserPreferences: (preferences: UserPreferences) => Promise<boolean>;
  completeOnboarding: () => Promise<boolean>;
  updateSubscription: (subscription: 'gratuita' | 'paga' | 'equipo') => Promise<boolean>;
  initializeDefaultUsers: () => void;
}

// Función para limpiar localStorage cuando esté lleno
const cleanupLocalStorage = () => {
  try {
    // Limpiar notificaciones antiguas
    localStorage.removeItem('notifications-storage');
    
    // Limpiar datos temporales
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.includes('temp-') || key.includes('cache-'))) {
        localStorage.removeItem(key);
      }
    }
    
    console.log('🧹 LocalStorage limpiado por falta de espacio');
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
  }
};

// Función para guardar usuarios con manejo de errores
const saveLocalUsers = (users: any[]) => {
  try {
    // Limpiar avatares base64 muy grandes para ahorrar espacio
    const cleanUsers = users.map(user => ({
      ...user,
      avatar: user.avatar && user.avatar.startsWith('data:') && user.avatar.length > 50000 
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&size=200&background=3b82f6&color=ffffff`
        : user.avatar
    }));
    
    localStorage.setItem('users-db', JSON.stringify(cleanUsers));
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('⚠️ LocalStorage lleno, limpiando...');
      cleanupLocalStorage();
      
      // Intentar guardar de nuevo después de limpiar
      try {
        const cleanUsers = users.map(user => ({
          ...user,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&size=200&background=3b82f6&color=ffffff`
        }));
        localStorage.setItem('users-db', JSON.stringify(cleanUsers));
        return true;
      } catch (secondError) {
        console.error('❌ Error al guardar después de limpiar:', secondError);
        return false;
      }
    }
    console.error('Error saving to local database:', error);
    return false;
  }
};

// Función para obtener usuarios de localStorage
const getLocalUsers = () => {
  try {
    const data = localStorage.getItem('users-db');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from local database:', error);
    return [];
  }
};

// Función para inicializar usuarios por defecto
const initializeDefaultUsers = () => {
  const existingUsers = getLocalUsers();
  
  // Solo inicializar si no hay usuarios
  if (existingUsers.length === 0) {
    const defaultUsers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150',
        plan: 'pro',
        credits: 150,
        subscription: 'paga',
        status: 'active',
        role: 'user'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        plan: 'free',
        credits: 25,
        subscription: 'gratuita',
        status: 'active',
        role: 'user'
      },
      {
        id: 'admin',
        name: 'Admin User',
        email: 'admin@contentai.com',
        password: 'admin123',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150',
        plan: 'admin',
        credits: 9999,
        subscription: 'equipo',
        status: 'active',
        role: 'admin'
      }
    ];
    
    saveLocalUsers(defaultUsers);
    console.log('✅ Usuarios por defecto inicializados');
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('🔍 Intentando login con:', { email, password });
        
        const users = getLocalUsers();
        console.log('📊 Usuarios en BD:', users);
        
        // Debug: mostrar todos los emails en la BD
        console.log('📧 Emails en BD:', users.map((u: any) => u.email));
        console.log('📧 Email buscado:', `"${email}"`);
        
        const user = users.find((u: any) => {
          console.log(`🔍 Comparando: "${u.email}" === "${email}"`, u.email === email);
          return u.email === email;
        });
        
        if (user) {
          console.log('👤 Usuario encontrado:', { ...user, password: '***' });
          
          // Verificar si la cuenta está suspendida o inactiva
          if (user.status === 'suspended') {
            console.log('🚫 Cuenta suspendida por el administrador');
            return false;
          }
          
          if (user.status === 'inactive') {
            console.log('⏸️ Cuenta inactiva');
            return false;
          }
          
          if (user.password === password) {
            // Convertir el usuario a la interfaz User (sin password)
            const { password: _, ...userWithoutPassword } = user;
            set({ user: userWithoutPassword, isAuthenticated: true });
            console.log('✅ Login exitoso para:', email);
            console.log('👤 Usuario logueado:', { ...userWithoutPassword, password: '***' });
            return true;
          } else {
            console.log('❌ Contraseña incorrecta para:', email);
            console.log('🔑 Contraseña en BD:', `"${user.password}"`);
            console.log('🔑 Contraseña ingresada:', `"${password}"`);
            console.log('🔍 Longitud BD:', user.password?.length);
            console.log('🔍 Longitud ingresada:', password?.length);
            return false;
          }
        } else {
          console.log('❌ Usuario no encontrado');
          return false;
        }
      },
      
      register: async (name: string, email: string, password: string, nickname?: string, role?: 'user' | 'admin') => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('📝 Registrando usuario:', { name, email, nickname, password: '***', role });
        const users = getLocalUsers();
        // Verificar si el email ya existe
        const existingUser = users.find((u: any) => u.email === email);
        if (existingUser) {
          console.log('❌ Email ya registrado');
          return false;
        }
        const newUserWithPassword = {
          id: Date.now().toString(),
          name,
          email,
          password, // ¡IMPORTANTE: Guardar la contraseña!
          nickname,
          plan: (role === 'admin' ? 'admin' : 'free') as 'free' | 'pro' | 'enterprise' | 'admin',
          role: role || 'user',
          credits: 50,
          status: 'active' as 'active' | 'inactive' | 'suspended' | 'pending'
        };
        users.push(newUserWithPassword);
        const saved = saveLocalUsers(users);
        if (saved) {
          // Crear usuario sin contraseña para el estado
          const { password: _, ...newUser } = newUserWithPassword;
          set({ user: newUser, isAuthenticated: true });
          console.log('✅ Usuario registrado exitosamente');
          return true;
        } else {
          console.log('❌ Error al guardar usuario');
          return false;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
          
          // También actualizar en la base de datos local
          const users = getLocalUsers();
          const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            saveLocalUsers(users);
          }
        }
      },
      
      updateProfile: async (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
          
          // También actualizar en la base de datos local
          const users = getLocalUsers();
          const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            saveLocalUsers(users);
          }
          return true;
        } else {
          console.log('❌ Usuario no autenticado');
          return false;
        }
      },
      
      changePassword: async (currentPassword: string, newPassword: string) => {
        const currentUser = get().user;
        if (currentUser) {
          const users = getLocalUsers();
          const user = users.find((u: any) => u.id === currentUser.id);
          
          if (user && user.password === currentPassword) {
            // Solo actualizar en la base de datos local, no en el estado
            const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
            if (userIndex !== -1) {
              users[userIndex] = { ...users[userIndex], password: newPassword };
              saveLocalUsers(users);
            }
            return true;
          } else {
            console.log('❌ Contraseña actual incorrecta');
            return false;
          }
        } else {
          console.log('❌ Usuario no autenticado');
          return false;
        }
      },

      updateUserPreferences: async (preferences: UserPreferences) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, preferences };
          set({ user: updatedUser });
          
          // También actualizar en la base de datos local
          const users = getLocalUsers();
          const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], preferences };
            saveLocalUsers(users);
          }
          
          console.log('✅ Preferencias actualizadas');
          return true;
        } else {
          console.log('❌ Usuario no autenticado');
          return false;
        }
      },

      completeOnboarding: async () => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, hasCompletedOnboarding: true };
          set({ user: updatedUser });
          
          // También actualizar en la base de datos local
          const users = getLocalUsers();
          const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], hasCompletedOnboarding: true };
            saveLocalUsers(users);
          }
          
          console.log('✅ Onboarding completado');
          return true;
        } else {
          console.log('❌ Usuario no autenticado');
          return false;
        }
      },

      updateSubscription: async (subscription: 'gratuita' | 'paga' | 'equipo') => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, subscription };
          set({ user: updatedUser });
          
          // También actualizar en la base de datos local
          const users = getLocalUsers();
          const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], subscription };
            saveLocalUsers(users);
          }
          
          console.log('✅ Suscripción actualizada a:', subscription);
          return true;
        } else {
          console.log('❌ Usuario no autenticado');
          return false;
        }
      },
      
      initializeDefaultUsers: () => {
        initializeDefaultUsers();
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Inicializar usuarios por defecto cuando se carga el módulo
if (typeof window !== 'undefined') {
  initializeDefaultUsers();
}