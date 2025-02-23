
import { useState, useCallback } from "react"
import { Text, ScrollView, StyleSheet, RefreshControl, SafeAreaView } from "react-native"
import { Employee, Task } from "../../types/types"
import { HomeLayout } from "../layouts/HomeLayout"
import { TaskModal } from "../components/TaskModal"
import { TaskCard } from "../components/TaskCard"


export const TaskManagement = ({ employees }: { employees: Employee[] }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)




  
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    // Implement your refresh logic here
    setTimeout(() => setRefreshing(false), 2000)
  }, [])

  const updateTaskStatus = (taskId: string, status: string) => {
    // Implement your update logic here
    console.log(`Updating task ${taskId} to status: ${status}`)
    setModalVisible(false)
  }

  return (
    <HomeLayout>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Gestión de Tareas</Text>
        <ScrollView
          style={styles.taskList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {loading ? (
            <Text style={styles.loadingText}>Cargando tareas...</Text>
          ) : (
            employees.map((employee) =>
              employee.tasks
            .sort((a, b) => Number(b.priority) - Number(a.priority))
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
            )
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
    backgroundColor: "#fff",
  },
  taskList: {
    padding: 10,
  },
  loadingText: {
    textAlign: "center",
    padding: 20,
    color: "#666",
  },
})

