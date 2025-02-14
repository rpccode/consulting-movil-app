import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Task } from "../../types/types";

const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 1:
      return '#FF4B4B';
    case 2:
      return '#FFA726';
    case 3:
      return '#4CAF50';
    default:
      return '#757575';
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 75) return '#4CAF50';
  if (progress >= 50) return '#FFA726';
  if (progress >= 25) return '#FF9800';
  return '#FF4B4B';
};

export const TaskCard = ({ task, onPress }: { task: Task; onPress: () => void }) => (
  <TouchableOpacity style={styles.taskCard} onPress={onPress}>
    <View style={styles.taskHeader}>
      <View style={styles.titleContainer}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(task.priority) },
          ]}
        >
          <Text style={styles.priorityText}>{task.priority}</Text>
        </View>
      </View>
      <View style={styles.clientContainer}>
        <Text style={styles.label}>Cliente</Text>
        <Text style={styles.clientName}>{task.client}</Text>
      </View>
    </View>

    <View style={styles.progressContainer}>
      <View style={styles.progressInfo}>
        <Text style={styles.label}>Progreso</Text>
        <Text style={[styles.progressText, { color: getProgressColor(task.progress) }]}>
          {task.progress}%
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${task.progress}%`,
              backgroundColor: getProgressColor(task.progress),
            },
          ]}
        />
      </View>
    </View>

    {task.dependencies && task.dependencies.length > 0 && (
      <View style={styles.dependenciesContainer}>
        <Text style={styles.label}>Dependencias</Text>
        <View style={styles.dependenciesList}>
          {task.dependencies.map((dep, index) => (
            <View key={index} style={styles.dependencyItem}>
              <View style={styles.dependencyBadge}>
                <Text style={styles.dependencyType}>{dep.type}</Text>
              </View>
              <Text style={styles.dependencyStatus}>{dep.status}</Text>
            </View>
          ))}
        </View>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  taskHeader: {
    gap: 12,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priorityText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  clientContainer: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: "#757575",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  clientName: {
    fontSize: 15,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  progressContainer: {
    marginTop: 16,
    gap: 8,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  dependenciesContainer: {
    marginTop: 16,
    gap: 8,
  },
  dependenciesList: {
    gap: 8,
  },
  dependencyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dependencyBadge: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dependencyType: {
    fontSize: 12,
    color: "#757575",
    fontWeight: "500",
  },
  dependencyStatus: {
    fontSize: 14,
    color: "#1A1A1A",
  },
});