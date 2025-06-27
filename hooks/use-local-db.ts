import { useCallback } from 'react';

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  nickname?: string;
  plan: 'free' | 'pro' | 'enterprise' | 'admin';
  credits: number;
  password: string;
}

export function useLocalDB() {
  const getUsers = useCallback((): LocalUser[] => {
    try {
      const data = localStorage.getItem('users-db');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from local database:', error);
      return [];
    }
  }, []);

  const saveUsers = useCallback((users: LocalUser[]): boolean => {
    try {
      localStorage.setItem('users-db', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving to local database:', error);
      return false;
    }
  }, []);

  const getUserById = useCallback((id: string): LocalUser | null => {
    const users = getUsers();
    return users.find(user => user.id === id) || null;
  }, [getUsers]);

  const getUserByEmail = useCallback((email: string): LocalUser | null => {
    const users = getUsers();
    return users.find(user => user.email === email) || null;
  }, [getUsers]);

  const updateUser = useCallback((id: string, updates: Partial<LocalUser>): boolean => {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return false;
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    return saveUsers(users);
  }, [getUsers, saveUsers]);

  const createUser = useCallback((user: LocalUser): boolean => {
    const users = getUsers();
    
    // Verificar si el email ya existe
    if (users.some(u => u.email === user.email)) {
      return false;
    }

    users.push(user);
    return saveUsers(users);
  }, [getUsers, saveUsers]);

  const initializeDB = useCallback((initialData: LocalUser[]): boolean => {
    const users = getUsers();
    
    // Solo inicializar si la base de datos está vacía
    if (users.length === 0) {
      return saveUsers(initialData);
    }
    
    return true;
  }, [getUsers, saveUsers]);

  const exportData = useCallback((): string => {
    const users = getUsers();
    return JSON.stringify(users, null, 2);
  }, [getUsers]);

  const importData = useCallback((jsonData: string): boolean => {
    try {
      const users = JSON.parse(jsonData);
      
      // Validar que sea un array
      if (!Array.isArray(users)) {
        throw new Error('Los datos deben ser un array');
      }

      // Validar estructura básica de cada usuario
      for (const user of users) {
        if (!user.id || !user.name || !user.email) {
          throw new Error('Estructura de usuario inválida');
        }
      }

      return saveUsers(users);
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }, [saveUsers]);

  const clearDB = useCallback((): boolean => {
    try {
      localStorage.removeItem('users-db');
      return true;
    } catch (error) {
      console.error('Error clearing database:', error);
      return false;
    }
  }, []);

  return {
    getUsers,
    saveUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    createUser,
    initializeDB,
    exportData,
    importData,
    clearDB,
  };
} 