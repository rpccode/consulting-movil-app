import { useEffect, useState, useCallback } from "react";
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
import { ConfigSettings, Employee, Task, User } from "../../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TaskService } from "../services/TaskService";
import { logger } from "../../utils/logger";
import { EmployeeService } from "../services/EmployeeService";
import { TaskCard } from "../components/TaskCard";
import { TaskModal } from "../components/TaskModal";
import { getPriority, getStatus } from "../helpers";
import { useEmployeeStore } from "../store/EmployeeStore";
import { AuthServices } from "../services/authServices";
import { useAuthStore } from "../store/authStore";

export const STORAGE_KEYS = {
  TASKS: "@tasks",
  EMPLOYEES: "@employees",
  CONFIG: "@config",
  WORK_WEEKS: "@work_weeks",
};

const PRIORITY_OPTIONS = [
  "Todas",
  "Critica",
  "Alta",
  "Media",
  "Normal",
  "Baja",
];
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
  const { Employees, setEmployees, addEmployee } = useEmployeeStore();
  const {user} = useAuthStore()
  const [tasks, setTasks] = useState<Task[]>([]);
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
      if (user.role?.name === "admin") {
        const data = await EmployeeService.getEmployees();
        setEmployees(data);
      } else {
        const data = await EmployeeService.getEmployees();
        addEmployee(data);
      }
    } catch (error) {
      logger.debug("Error al obtener los empleados", error);
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
      // logger.debug("Actualizando tarea", taskId, status);
      const updatedTask = await TaskService.updateTask(taskId, {
        status,
        progress: status === "completed" ? 100 : 0,
        completionDate:
          status === "completed" ? new Date().toISOString() : '',
        completed: status === "completed" ? true : false,
        toDo: status === "completed" && false ,
        inProgress: status === "completed" && false,
      });

      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? updatedTask : task
      );
      logger.debug("Tarea actualizada", updatedTask);

      setTasks(updatedTasks);
      setModalVisible(false);
    } catch (error) {
      logger.debug("Error al actualizar la tarea", error);
      Alert.alert("Error", "No se pudo actualizar la tarea");
    }
  };

  const checkDependencies = (task: Task): boolean => {
    if (!task.dependencies) return true;

    return task.dependencies.every(
      (dep) => dep.status === "completado" || new Date(dep.endDate) > new Date()
    );
  };

  // Rest of your existing component code (renderTask, renderTaskModal, etc.)
  const filteredTasks = (Employees ?? [])
    .flatMap((employee) =>
      (employee.tasks ?? []).map((task) => ({
        ...task,
        employeeName: employee.name,
        employeeId: employee.id,
      }))
    )
    .filter((task) => {
      const matchesPriority =
        selectedPriority === "Todas" ||
        getPriority(task.priority) === selectedPriority;
      const matchesStatus =
        selectedStatus === "Todos" || getStatus(task) === selectedStatus;
      const matchesEmployee =
        !selectedEmployee || task.employeeId === selectedEmployee;
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.client?.toLowerCase().includes(searchQuery.toLowerCase());

      return (
        matchesPriority && matchesStatus && matchesEmployee && matchesSearch
      );
    });

  const FilterButton = ({
    label,
    isSelected,
    onPress,
  }: {
    label: string;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterButtonText,
          isSelected && styles.filterButtonTextSelected,
        ]}
      >
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
                {Employees.map((employee) => (
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
            filteredTasks
            .sort((a, b) => Number(a.priority) - Number(b.priority)) // Convertir a número para comparar correctamente
            .map((task) => (
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
