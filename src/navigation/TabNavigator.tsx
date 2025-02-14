import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TasksScreen } from '../screens/TasksScreen';

import { Feather } from '@expo/vector-icons';
import { HomeTabParamList } from './types';
import TeamsScreen from '../screens/TeamsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { StatisticsScreen } from '../screens/StatisticsScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          switch (route.name) {
            case 'Tasks':
              iconName = 'list';
              break;
            case 'Teams':
              iconName = 'users';
              break;
            case 'Dashboard':
              iconName = 'layers';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Tasks" 
        component={TasksScreen}
        options={{ title: 'Tareas' }}
      />
      <Tab.Screen 
        name="Teams" 
        component={TeamsScreen}
        options={{ title: 'Equipos' }}
      />
      <Tab.Screen 
        name="Dashboard" 
        component={StatisticsScreen}
        options={{ title: 'Estadisticas' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Ajustes' }}
      />
    </Tab.Navigator>
  );
};