import  { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { HomeLayout } from "../layouts/HomeLayout";
import { Task, Employee } from "../../types/types";
import { useEmployeeStore } from "../store/EmployeeStore";
import * as dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import "dayjs/locale/es";
import { EmployeeWorkloadChart, TaskDistributionChart, TaskProgressChart } from "../components/charts/tasksChart";
dayjs.default().format();
dayjs.extend(utc);
dayjs.extend(timezone);

const TIME_RANGES = ["7D", "1M", "3M", "6M", "1A"];

export interface TaskStats {
  completed: number;
  inProgress: number;
  delayed: number;
  upcomingDeadlines: number;
  totalTasks: number;
  completionRate: number;
  averageCompletionTime: number;
}

export const StatisticsScreen = () => {
  const { Employee, Employees, getEmployees } = useEmployeeStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState("1M");
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
    if (Employees.length > 0) {
      calculateTaskProgress();
    }
  }, [Employees]);

  const calculateTaskProgress = () => {
    const now = dayjs.default();
    const months = Array.from({ length: 6 }, (_, i) =>
      dayjs.default().subtract(i, "month").format("MMM")
    ).reverse();

    const taskCounts = months.map((month) => {
      const count = Employees
        .flatMap((emp) => emp.tasks)
        .filter(
          (task) =>
            dayjs.default(task.endDate).format("MMM") === month && task.completed
        ).length;
      return count || 0;
    });

    setTaskLabels(months);
    setTaskProgress(taskCounts);
  };

  useEffect(() => {
    if (Employees.length > 0) {
      calculateTaskStats([], Employees);
    }
  }, [Employees]);

  const calculateTaskStats = (tasks: Task[], employees: Employee[]) => {
    const allTasks = employees.flatMap((emp) => emp.tasks);
    const now = dayjs.default();

    const completed = allTasks.filter((task) => task.completed === true).length;
    const inProgress = allTasks.filter(
      (task) => task.inProgress === true
    ).length;
    const delayed = allTasks.filter((task) => {
      const deadline = dayjs.default(task.endDate || "");
      return now.isAfter(deadline) && task.completed !== true;
    }).length;

    const upcomingDeadlines = allTasks.filter((task) => {
      const deadline = dayjs.default(task.endDate || "");
      const diffDays = deadline.diff(now, "day");
      return diffDays === 1 && task.completed !== true;
    }).length;

    setStats({
      completed,
      inProgress,
      delayed,
      upcomingDeadlines,
      totalTasks: allTasks.length,
      completionRate:
        allTasks.length > 0 ? (completed / allTasks.length) * 100 : 0,
      averageCompletionTime: 5.2,
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    getEmployees();
    setRefreshing(false);
  }, [Employees]);

  const StatCard = ({ title, value, subtitle, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <HomeLayout>
      <ScrollView
        style={styles.container}
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
          {/* <TaskProgressChart taskProgress={taskProgress} taskLabels={taskLabels}/> */}
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Distribución por Estado</Text>
          <TaskDistributionChart stats={stats}/>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Carga de Trabajo</Text>
          <EmployeeWorkloadChart employees={Employees}/>
        </View>

        <View style={styles.predictionsSection}>
          <Text style={styles.sectionTitle}>Predicciones y Análisis</Text>
          <View style={styles.predictionCard}>
            <Text style={styles.predictionTitle}>
              Tiempo Promedio de Finalización
            </Text>
            <Text style={styles.predictionValue}>
              {stats.averageCompletionTime} días
            </Text>
            <Text style={styles.predictionText}>
              Basado en el historial de tareas completadas
            </Text>
          </View>

          <View style={styles.predictionCard}>
            <Text style={styles.predictionTitle}>
              Proyección de Finalización
            </Text>
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
    marginBottom: 16,
  },
  timeRangeContainer: {
    flexDirection: "row",
    gap: 8,
  },
  timeRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#DDE2E5",
  },
  timeRangeButtonSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  timeRangeText: {
    fontSize: 14,
    color: "#495057",
    fontWeight: "500",
  },
  timeRangeTextSelected: {
    color: "#fff",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  chartSection: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
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
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  predictionValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4CAF50",
    marginBottom: 8,
  },
  predictionText: {
    fontSize: 14,
    color: "#666",
  },
});
