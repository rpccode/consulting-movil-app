import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { HomeLayout } from '../layouts/HomeLayout';
import { Task, Employee } from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './TasksScreen';
import moment from 'moment';

const TIME_RANGES = ['7D', '1M', '3M', '6M', '1A'];

interface TaskStats {
  completed: number;
  inProgress: number;
  delayed: number;
  upcomingDeadlines: number;
  totalTasks: number;
  completionRate: number;
  averageCompletionTime: number;
}

export const StatisticsScreen = () => {
      const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1M');
    const [refreshing, setRefreshing] = useState(false);
  
  const [stats, setStats] = useState<TaskStats>({
    completed: 0,
    inProgress: 0,
    delayed: 0,
    upcomingDeadlines: 0,
    totalTasks: 0,
    completionRate: 0,
    averageCompletionTime: 0,
  });

  const [taskProgress, setTaskProgress] = useState<number[]>([]);
const [taskLabels, setTaskLabels] = useState<string[]>([]);

useEffect(() => {
  if (employees.length > 0) {
    calculateTaskProgress();
  }
}, [employees]);

const calculateTaskProgress = () => {
  const now = moment();
  const months = Array.from({ length: 6 }, (_, i) =>
    now.clone().subtract(i, 'months').format('MMM')
  ).reverse();

  const taskCounts = months.map((month) => {
    return employees
      .flatMap((emp) => emp.tasks)
      .filter((task) => moment(task.endDate).format('MMM') === month && task.completed)
      .length;
  });

  setTaskLabels(months);
  setTaskProgress(taskCounts);
};

const loadData = async() => {
    try {
        const [cachedEmployees] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.EMPLOYEES),
        ]);
        console.log(cachedEmployees)
        // if (cachedTasks) setTasks(JSON.parse(cachedTasks));
        if (cachedEmployees) setEmployees(JSON.parse(cachedEmployees));
        // if (cachedConfig) setConfig(JSON.parse(cachedConfig));

        // Alert.alert(
        //   "Conexión fallida",
        //   "Usando datos almacenados localmente. Por favor, verifica tu conexión a internet."
        // );
      } catch (cacheError) {
        Alert.alert("Error", "No se pudieron cargar los datos");
      }
}

useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    if (employees.length > 0) {
      calculateTaskStats([], employees);
    }
  }, [employees]);
  

  const calculateTaskStats = (tasks: Task[], employees: Employee[]) => {
    // Aquí iría la lógica real de cálculo de estadísticas
    const allTasks = employees.flatMap(emp => emp.tasks);
    const now = new Date();

    const completed = allTasks.filter(task => task.completed === true).length;
    const inProgress = allTasks.filter(task => task.inProgress === true).length;
    const delayed = allTasks.filter(task => {
      const deadline = new Date(task.endDate || '');
      return   now > deadline && task.completed !== true;
    }).length;

    const upcomingDeadlines = allTasks.filter(task => {
      const deadline = new Date(task.endDate || '');
      const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays === 1 && task.completed !== true;
    }).length;

    setStats({
      completed,
      inProgress,
      delayed,
      upcomingDeadlines,
      totalTasks: allTasks.length,
      completionRate: allTasks.length > 0 ? (completed / allTasks.length) * 100 : 0,
      averageCompletionTime: 5.2, // En días, esto sería calculado realmente
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [employees]);
  

  const StatCard = ({ title, value, subtitle, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <HomeLayout>
      <ScrollView style={styles.container}
         refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Estadísticas</Text>
          <View style={styles.timeRangeContainer}>
            {TIME_RANGES.map((range) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.timeRangeButton,
                  selectedTimeRange === range && styles.timeRangeButtonSelected,
                ]}
                onPress={() => setSelectedTimeRange(range)}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    selectedTimeRange === range && styles.timeRangeTextSelected,
                  ]}
                >
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Tareas Completadas"
            value={stats.completed}
            subtitle={`${stats.completionRate.toFixed(1)}% de finalización`}
            color="#4CAF50"
          />
          <StatCard
            title="En Progreso"
            value={stats.inProgress}
            color="#2196F3"
          />
          <StatCard
            title="Tareas Atrasadas"
            value={stats.delayed}
            subtitle="Necesitan atención"
            color="#FF5252"
          />
          <StatCard
            title="Por Vencer"
            value={stats.upcomingDeadlines}
            subtitle="Próximos 7 días"
            color="#FFC107"
          />
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Progreso de Tareas</Text>
          <LineChart
            data={{
              labels: taskLabels,
              datasets: [{
                data: taskProgress,
              }],
            }}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Distribución por Estado</Text>
          <PieChart
            data={[
              {
                name: 'Completadas',
                population: stats.completed,
                color: '#4CAF50',
                legendFontColor: '#7F7F7F',
              },
              {
                name: 'En Progreso',
                population: stats.inProgress,
                color: '#2196F3',
                legendFontColor: '#7F7F7F',
              },
              {
                name: 'Atrasadas',
                population: stats.delayed,
                color: '#FF5252',
                legendFontColor: '#7F7F7F',
              },
            ]}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Carga de Trabajo por Empleado</Text>
          <BarChart
            data={{
              labels: employees.map(emp => emp.name.split(' ').map(word => word[0]).join('')),
              datasets: [{
                data:  employees.map(emp => emp.tasks.length),
              }],
            }}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={styles.chart}
          />
        </View>

        <View style={styles.predictionsSection}>
          <Text style={styles.sectionTitle}>Predicciones y Análisis</Text>
          <View style={styles.predictionCard}>
            <Text style={styles.predictionTitle}>Tiempo Promedio de Finalización</Text>
            <Text style={styles.predictionValue}>{stats.averageCompletionTime} días</Text>
            <Text style={styles.predictionText}>
              Basado en el historial de tareas completadas
            </Text>
          </View>
          
          <View style={styles.predictionCard}>
            <Text style={styles.predictionTitle}>Proyección de Finalización</Text>
            <Text style={styles.predictionValue}>15 Mayo</Text>
            <Text style={styles.predictionText}>
              Fecha estimada para completar todas las tareas actuales
            </Text>
          </View>
        </View>
      </ScrollView>
    </HomeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  timeRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DDE2E5',
  },
  timeRangeButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  timeRangeText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  timeRangeTextSelected: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  chartSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  predictionsSection: {
    padding: 20,
  },
  predictionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  predictionValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 8,
  },
  predictionText: {
    fontSize: 14,
    color: '#666',
  },
});