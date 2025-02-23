import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './src/navigation/TabNavigator';
import { RootStackParamList } from './src/navigation/types';
import { Alert, StyleSheet } from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen';
import * as Updates from 'expo-updates';
import { logger } from './utils/logger';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export default function App() {
  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        // Notificar al usuario que hay una nueva versión
        Alert.alert(
          'Actualización disponible',
          'Hay una nueva versión de la app. ¿Quieres actualizar?',
          [
            { text: 'No', onPress: () => console.log('Usuario no actualizó'), style: 'cancel' },
            {
              text: 'Sí', 
              onPress: async () => {
                await Updates.fetchUpdateAsync(); // Descarga la actualización
                Updates.reloadAsync(); // Reinicia la app con la nueva versión
              }
            },
          ],
          { cancelable: false }
        );
      }
    } catch (e) {
      logger.error('Error al verificar actualizaciones: ', e);
    }
  };

  useEffect(() => {
    checkForUpdates(); // Llama a la función de actualización al inicio de la app
  }, []);
  
  return (
    <NavigationContainer >
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false, statusBarBackgroundColor: '#3b5998' }}>
        <Stack.Screen name="Auth" component={LoginScreen} />
        <Stack.Screen name="Home" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
