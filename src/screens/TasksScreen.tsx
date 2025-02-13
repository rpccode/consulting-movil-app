// Ejemplo básico de una pantalla
import React from 'react';
import { View, Text } from 'react-native';
import { HomeLayout } from '../layouts/HomeLayout';

export const TasksScreen = () => {
  return (
    <HomeLayout>
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Contenido de la pantalla</Text>
      </View>
    </HomeLayout>
  );
};