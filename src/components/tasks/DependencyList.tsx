
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native"
import { Clock, CheckCircle2, AlertCircle, Calendar, MessageSquare, X } from "lucide-react-native"
import type { ExternalDependency } from "../../../types/types"

interface DependencyListProps {
  dependencies?: ExternalDependency[]
  onUpdateDependency: (id: string, status: string, comment: string) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completado":
      return {
        bg: "rgba(34, 197, 94, 0.1)",
        text: "#22c55e",
      }
    case "en proceso":
      return {
        bg: "rgba(59, 130, 246, 0.1)",
        text: "#3b82f6",
      }
    case "pendiente":
      return {
        bg: "rgba(234, 179, 8, 0.1)",
        text: "#eab308",
      }
    case "vencido":
      return {
        bg: "rgba(239, 68, 68, 0.1)",
        text: "#ef4444",
      }
    default:
      return {
        bg: "rgba(107, 114, 128, 0.1)",
        text: "#6b7280",
      }
  }
}

const getStatusIcon = (status: string, color: string) => {
  const iconProps = {
    size: 18,
    color: color,
    strokeWidth: 2,
  }

  switch (status) {
    case "completado":
      return <CheckCircle2 {...iconProps} />
    case "en proceso":
      return <Clock {...iconProps} />
    case "pendiente":
    case "vencido":
      return <AlertCircle {...iconProps} />
    default:
      return null
  }
}

const Badge = ({ children, variant = "filled", style }: any) => {
  const baseStyle = {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  }

  const variantStyle =
    variant === "outline"
      ? {
          borderWidth: 1,
          borderColor: "#e5e7eb",
        }
      : {}

  return <View style={[baseStyle, variantStyle, style]}>{children}</View>
}

export const DependencyList = ({ dependencies = [], onUpdateDependency }: DependencyListProps) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedDependency, setSelectedDependency] = useState<ExternalDependency | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [newComment, setNewComment] = useState("")

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    } catch (error) {
      return "Fecha inválida"
    }
  }

  const isOverdue = (endDate: string) => {
    const today = new Date()
    const end = new Date(endDate)
    return end < today
  }

  const openModal = (dependency: ExternalDependency) => {
    setSelectedDependency(dependency)
    setNewStatus(dependency.status)
    setNewComment(dependency.comment || "")
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedDependency(null)
    setNewStatus("")
    setNewComment("")
  }

  const handleUpdateDependency = () => {
    if (selectedDependency && newStatus) {
      onUpdateDependency(selectedDependency.id, newStatus, newComment)
      closeModal()
    }
  }

  const dependencyCount = dependencies?.length || 0

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dependencias Externas</Text>
        <Badge variant="outline">
          <Text style={styles.badgeText}>
            {dependencyCount} {dependencyCount === 1 ? "Dependencia" : "Dependencias"}
          </Text>
        </Badge>
      </View>

      {!dependencies || dependencies.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No hay dependencias registradas</Text>
        </View>
      ) : (
        <View style={styles.cardList}>
          {dependencies.map((dependency, index) => {
            const overdueStatus =
              isOverdue(dependency.endDate) && dependency.status !== "completado" ? "vencido" : dependency.status
            const statusColors = getStatusColor(overdueStatus)

            return (
              <TouchableOpacity key={dependency.id || index} onPress={() => openModal(dependency)}>
                <View style={styles.card}>
                  <View style={styles.cardContent}>
                    <View>
                      <View style={styles.badgeContainer}>
                        <Badge style={{ backgroundColor: statusColors.bg }}>
                          {getStatusIcon(overdueStatus, statusColors.text)}
                          <Text style={[styles.statusText, { color: statusColors.text }]}>{overdueStatus}</Text>
                        </Badge>
                        <Badge variant="outline">
                          <Text style={styles.typeText}>{dependency.type}</Text>
                        </Badge>
                      </View>

                      {dependency.comment && (
                        <View style={styles.commentContainer}>
                          <MessageSquare size={18} color="#4b5563" />
                          <Text style={styles.commentText}>{dependency.comment}</Text>
                        </View>
                      )}

                      <View style={styles.dateContainer}>
                        <Calendar size={18} color="#4b5563" />
                        <Text style={styles.dateText}>
                          {formatDate(dependency.startDate)}
                          <Text style={styles.dateArrow}> → </Text>
                          {formatDate(dependency.endDate)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.updatedContainer}>
                      <Text style={styles.updatedText}>
                        {dependency.updatedAt ? formatDate(dependency.updatedAt) : formatDate(dependency.createdAt)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      )}

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Actualizar Dependencia</Text>
            <View style={styles.modalForm}>
              <Text style={styles.modalLabel}>Estado:</Text>
              <View style={styles.statusButtonsContainer}>
                {["pendiente", "en proceso", "completado"].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[styles.statusButton, newStatus === status && styles.statusButtonActive]}
                    onPress={() => setNewStatus(status)}
                  >
                    <Text style={[styles.statusButtonText, newStatus === status && styles.statusButtonTextActive]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.modalLabel}>Comentario:</Text>
              <TextInput
                style={styles.commentInput}
                multiline
                numberOfLines={4}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Agregar un comentario..."
              />
              <TouchableOpacity style={styles.updateButton} onPress={handleUpdateDependency}>
                <Text style={styles.updateButtonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  badgeText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
  emptyCard: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 16,
  },
  cardList: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  typeText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  commentContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    alignItems: "flex-start",
  },
  commentText: {
    fontSize: 15,
    color: "#4b5563",
    flex: 1,
    lineHeight: 22,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  dateText: {
    fontSize: 14,
    color: "#4b5563",
    fontWeight: "500",
  },
  dateArrow: {
    color: "#4b5563",
  },
  updatedContainer: {
    marginTop: 16,
    alignSelf: "flex-end",
  },
  updatedText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  modalForm: {
    gap: 16,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  statusButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  statusButtonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
    textTransform: "capitalize",
  },
  statusButtonTextActive: {
    color: "white",
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
  },
  updateButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default DependencyList

