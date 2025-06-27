import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  nickname?: string;
  plan: 'free' | 'pro' | 'enterprise' | 'admin';
  credits: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, nickname?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  initializeDefaultUsers: () => void;
}

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

// Función para guardar usuarios en localStorage
const saveLocalUsers = (users: any[]) => {
  try {
    localStorage.setItem('users-db', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving to local database:', error);
    return false;
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
        credits: 150
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        plan: 'free',
        credits: 25
      },
      {
        id: 'admin',
        name: 'Admin User',
        email: 'admin@contentai.com',
        password: 'admin123',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150',
        plan: 'admin',
        credits: 9999
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
          
          if (user.password === password) {
            // Convertir el usuario a la interfaz User (sin password)
            const { password: _, ...userWithoutPassword } = user;
            set({ user: userWithoutPassword, isAuthenticated: true });
            console.log('✅ Login exitoso');
            return true;
          } else {
            console.log('❌ Contraseña incorrecta');
            console.log('🔑 Contraseña esperada:', `"${user.password}"`);
            console.log('🔑 Contraseña ingresada:', `"${password}"`);
            return false;
          }
        } else {
          console.log('❌ Usuario no encontrado');
          return false;
        }
      },
      
      register: async (name: string, email: string, password: string, nickname?: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('📝 Registrando usuario:', { name, email, nickname, password: '***' });
        
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
          plan: 'free' as const,
          credits: 50
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