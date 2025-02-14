import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { HomeLayout } from "../layouts/HomeLayout";
import { ConfigSettings, Employee, Task } from "../../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TaskService } from "../services/TaskService";
import { logger } from "../../utils/logger";
import { EmployeeService } from "../services/EmployeeService";
import { TaskCard } from "../components/TaskCard";
import { TaskModal } from "../components/TaskModal";

export const STORAGE_KEYS = {
  TASKS: "@tasks",
  EMPLOYEES: "@employees",
  CONFIG: "@config",
  WORK_WEEKS: "@work_weeks",
};

const PRIORITY_OPTIONS = ["Todas", "Alta", "Media", "Baja"];
const STATUS_OPTIONS = ["Todos", "Pendiente", "En Progreso", "Completado"];


const defaultConfig: ConfigSettings = {
  workingHoursPerDay: 8,
  defaultTaskPriority: 1,
  notificationEnabled: true,
  theme: "light",
  language: "es",
  dependencyAlertEnabled: true,
};

export const TasksScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [config, setConfig] = useState<ConfigSettings>(defaultConfig);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedPriority, setSelectedPriority] = useState("Todas");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");




  const loadData = async () => {
    try {
      setLoading(true);
      const [employeesData] = await Promise.all([
        // TaskService.getTasks(),
        EmployeeService.getEmployees(),
        // TaskService.getConfig()
      ]);

      // setTasks(tasksData);
      setEmployees(employeesData);
      // setConfig(configData);

      // Cache the data locally
      await Promise.all([
        // AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasksData)),
        AsyncStorage.setItem(
          STORAGE_KEYS.EMPLOYEES,
          JSON.stringify(employeesData)
        ),
        // AsyncStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(configData))
      ]);
    } catch (error) {
      // If API fails, try to load from cache
      logger.debug("Error al optener los datos", error);
      try {
        const [cachedEmployees] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.EMPLOYEES),
        ]);

        // if (cachedTasks) setTasks(JSON.parse(cachedTasks));
        if (cachedEmployees) setEmployees(JSON.parse(cachedEmployees));
        // if (cachedConfig) setConfig(JSON.parse(cachedConfig));

        Alert.alert(
          "Conexión fallida",
          "Usando datos almacenados localmente. Por favor, verifica tu conexión a internet."
        );
      } catch (cacheError) {
        Alert.alert("Error", "No se pudieron cargar los datos");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const updatedTask = await TaskService.updateTask(taskId, {
        status,
        progress: status === "completed" ? 100 : undefined,
        completionDate:
          status === "completed" ? new Date().toISOString() : undefined,
        completed: status === "completed" ? true : false,
      });

      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? updatedTask : task
      );

      setTasks(updatedTasks);
      await AsyncStorage.setItem(
        STORAGE_KEYS.TASKS,
        JSON.stringify(updatedTasks)
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la tarea");
    }
  };

  const checkDependencies = (task: Task): boolean => {
    if (!task.dependencies) return true;

    return task.dependencies.every(
      (dep) => dep.status === "completado" || new Date(dep.endDate) > new Date()
    );
  };

  const renderTask = (task: Task) => (
    <TouchableOpacity
      key={task.id}
      style={styles.taskCard}
      onPress={() => {
        setSelectedTask(task);
        setModalVisible(true);
      }}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskPriority}>Prioridad: {task.priority}</Text>
      </View>
      <Text style={styles.taskClient}>Cliente: {task.client}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${task.progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{task.progress}%</Text>

      {task.dependencies && task.dependencies.length > 0 && (
        <View style={styles.dependenciesContainer}>
          <Text style={styles.dependenciesTitle}>Dependencias:</Text>
          {task.dependencies.map((dep, index) => (
            <Text key={index} style={styles.dependencyItem}>
              {dep.type}: {dep.status}
            </Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderTaskModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {selectedTask && (
            <>
              <Text style={styles.modalTitle}>{selectedTask.title}</Text>
              <Text>Cliente: {selectedTask.client}</Text>
              <Text>Prioridad: {selectedTask.priority}</Text>
              <Text>Progreso: {selectedTask.progress}%</Text>

              {selectedTask.dependencies && (
                <View style={styles.modalDependencies}>
                  <Text style={styles.modalSubtitle}>Dependencias:</Text>
                  {selectedTask.dependencies.map((dep, index) => (
                    <View key={index} style={styles.dependencyCard}>
                      <Text>Tipo: {dep.type}</Text>
                      <Text>Estado: {dep.status}</Text>
                      <Text>
                        Fecha límite:{" "}
                        {new Date(dep.endDate).toLocaleDateString()}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => updateTaskStatus(selectedTask.id, "completed")}
                >
                  <Text style={styles.buttonText}>Completar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.closeButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
  // Rest of your existing component code (renderTask, renderTaskModal, etc.)
  const filteredTasks = employees
    .flatMap((employee) =>
      employee.tasks.map((task) => ({
        ...task,
        employeeName: employee.name,
        employeeId: employee.id,
      }))
    )
    .filter((task) => {
      const matchesPriority =
        selectedPriority === "Todas" || task.priority === selectedPriority;
      const matchesStatus =
        selectedStatus === "Todos" || task.status === selectedStatus;
      const matchesEmployee =
        !selectedEmployee || task.employeeId === selectedEmployee;
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.client.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesPriority && matchesStatus && matchesEmployee && matchesSearch;
    });
  const FilterButton = ({ 
    label, 
    isSelected, 
    onPress 
  }: { 
    label: string; 
    isSelected: boolean; 
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
      onPress={onPress}
    >
      <Text style={[styles.filterButtonText, isSelected && styles.filterButtonTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );







  return (
    <HomeLayout>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gestión de Tareas</Text>
          <Text style={styles.taskCount}>{filteredTasks.length} tareas</Text>
        </View>

        <View style={styles.filtersContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScrollView}
          >
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Prioridad</Text>
              <View style={styles.filterButtons}>
                {PRIORITY_OPTIONS.map((priority) => (
                  <FilterButton
                    key={priority}
                    label={priority}
                    isSelected={selectedPriority === priority}
                    onPress={() => setSelectedPriority(priority)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Estado</Text>
              <View style={styles.filterButtons}>
                {STATUS_OPTIONS.map((status) => (
                  <FilterButton
                    key={status}
                    label={status}
                    isSelected={selectedStatus === status}
                    onPress={() => setSelectedStatus(status)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Empleado</Text>
              <View style={styles.filterButtons}>
                <FilterButton
                  label="Todos"
                  isSelected={selectedEmployee === null}
                  onPress={() => setSelectedEmployee(null)}
                />
                {employees.map((employee) => (
                  <FilterButton
                    key={employee.id}
                    label={employee.name}
                    isSelected={selectedEmployee === employee.id}
                    onPress={() => setSelectedEmployee(employee.id)}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        </View>

        <ScrollView
          style={styles.taskList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando tareas...</Text>
            </View>
          ) : filteredTasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No se encontraron tareas</Text>
              <Text style={styles.emptySubtext}>
                Intenta ajustar los filtros de búsqueda
              </Text>
            </View>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => {
                  setSelectedTask(task);
                  setModalVisible(true);
                }}
              />
            ))
          )}
        </ScrollView>

        <TaskModal
          visible={modalVisible}
          task={selectedTask}
          onClose={() => setModalVisible(false)}
          onComplete={(taskId) => updateTaskStatus(taskId, "completed")}
        />
      </SafeAreaView>
    </HomeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  taskCount: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  filtersContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  filterScrollView: {
    paddingHorizontal: 20,
  },
  filterSection: {
    marginRight: 24,
    minWidth: 200,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#DDE2E5",
  },
  filterButtonSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#495057",
    fontWeight: "500",
  },
  filterButtonTextSelected: {
    color: "#fff",
  },
  taskList: {
    padding: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
