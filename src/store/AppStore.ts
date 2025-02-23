import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface AppState {
    version: number;
    incrementVersion: () => void;
    resize: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            version: 1,
            incrementVersion: () => set((state) => ({ version: state.version + 1 })),
            resize: () => set({ version: 1 }),
        }),
        {
            name: "App-storage", // Nombre en AsyncStorage
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);