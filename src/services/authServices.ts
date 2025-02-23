import AsyncStorage from "@react-native-async-storage/async-storage";
import { config } from "../config/env";
import { User } from "../../types/types";

export const AuthServices = {
    async getCurrentUser(): Promise<User | null> {
        try {
    
          const userStr = await AsyncStorage.getItem(`auth-storage`);
          
          if (!userStr) return null;
          const data = JSON.parse(userStr) 
          return data.state.user
        } catch (error) {
          console.error('Error getting current user:', error);
          return null;
        }
      },
}