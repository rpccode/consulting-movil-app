import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, Text, FlatList, RefreshControl, 
  StyleSheet, TouchableOpacity, Alert 
} from 'react-native';
import { HomeLayout } from '../layouts/HomeLayout';
import { Employee } from '../../types/types';
import { EmployeeService } from '../services/EmployeeService';


export const EmployeesScreen = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await EmployeeService.getEmployees();
      setEmployees(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los empleados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEmployees();
    setRefreshing(false);
  }, []);

  const renderEmployee = ({ item }: { item: Employee }) => (
    <TouchableOpacity style={styles.employeeCard}>
      <Text style={styles.employeeName}>{item.name}</Text>
      <Text style={styles.teamName}>{item.team?.name}</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Eficiencia</Text>
          <Text style={styles.statValue}>{item.efficiency}%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>{item.score}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Pareto</Text>
          <Text style={styles.statValue}>{item.leyPareto}%</Text>
        </View>
      </View>
      <Text style={[styles.status, item.isActive ? styles.activeStatus : styles.inactiveStatus]}>
        {item.isActive ? 'Activo' : 'Inactivo'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <HomeLayout>
      <View style={styles.container}>
        <Text style={styles.header}>Empleados</Text>
        <FlatList
          data={employees}
          renderItem={renderEmployee}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {loading ? 'Cargando empleados...' : 'No hay empleados disponibles'}
            </Text>
          }
        />
      </View>
    </HomeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  employeeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  teamName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  activeStatus: {
    backgroundColor: '#e6f4ea',
    color: '#137333',
  },
  inactiveStatus: {
    backgroundColor: '#fce8e6',
    color: '#c5221f',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
});