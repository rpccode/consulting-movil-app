
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config/env';
import { useAuthStore } from '../store/authStore';
import { useEmployeeStore } from '../store/EmployeeStore';
import { logger } from '../../utils/logger';


export const clearAllData = async () => {
  try {
    // Agrupar la eliminación de AsyncStorage en un Promise.all
    await Promise.all([
      AsyncStorage.removeItem('auth-storage'),
      AsyncStorage.removeItem('Employee-storage'),
      AsyncStorage.removeItem(`${config.storageKeyPrefix}token`),
    ]);

    // Limpiar el store de auth
    await useAuthStore.persist.clearStorage();
    await useEmployeeStore.persist.clearStorage();

    logger.info('Todos los datos han sido limpiados correctamente');
  } catch (error) {
    logger.error('Error al limpiar los datos:', error);
  }
};
