import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native"
import { Task } from "../../types/types"

export const TaskModal = ({
  visible,
  task,
  onClose,
  onComplete,
}: {
  visible: boolean
  task: Task | null
  onClose: () => void
  onComplete: (taskId: string) => void
}) => (
  <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        {task && (
          <>
            <Text style={styles.modalTitle}>{task.title}</Text>
            <Text>Cliente: {task.client}</Text>
            <Text>Prioridad: {task.priority}</Text>
            <Text>Progreso: {task.progress}%</Text>

            {task.dependencies && (
              <View style={styles.modalDependencies}>
                <Text style={styles.modalSubtitle}>Dependencias:</Text>
                {task.dependencies.map((dep, index) => (
                  <View key={index} style={styles.dependencyCard}>
                    <Text>Tipo: {dep.type}</Text>
                    <Text>Estado: {dep.status}</Text>
                    <Text>Fecha límite: {new Date(dep.endDate).toLocaleDateString()}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.button} onPress={() => onComplete(task.id)}>
                <Text style={styles.buttonText}>Completar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  </Modal>
)

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  modalDependencies: {
    marginTop: 10,
  },
  dependencyCard: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 4,
    marginBottom: 5,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 4,
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})

