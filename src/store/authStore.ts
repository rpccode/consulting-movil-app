import { create } from 'zustand'
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types/types';
import { useNavigation } from '@react-navigation/native';
import { config } from '../config/env';
import { clearAllData } from '../helpers/ClearAllStore';

interface authStore {
    user: User;
    accessToken: string;
    sessionId: string;
    setToken: (value: string) => void;
    removeToken: () => void;
    setUser: (value: User) => void;
    removeUser: () => void;
    logout: (navigation: any) => void;


}
const persistOptions: PersistOptions<authStore> = {
  name: "auth-storage",
  storage: createJSONStorage(() => AsyncStorage),
};
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: {} as User,
      accessToken: '',
      sessionId:'',
      setToken: (value: string) => set({ accessToken: value }),
      setSessionId: (value: string) => set({ sessionId: value }),
      removeToken: () => set({ accessToken: '' }),
      setUser: (value: User) => set({ user: value }),
      removeUser: () => set({ user: { id: '', username: '', password: '' } }),
      logout: async (navigation: any) => {
        set({ user: { id: '', username: '', password: '' }, accessToken: '' });
      
        // Limpiar el almacenamiento persistente de Zustand
       await clearAllData();
        navigation.navigate('Auth');
      },
    }),
persistOptions
  )
)