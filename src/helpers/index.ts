import { Task } from "../../types/types";

export const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 1:
      return "#FF4B4B";
    case 2:
      return "#FFA726";
    case 3:
      return "#4CAF50";
    case 4:
      return "#4CAF50";
    default:
      return "#757575";
  }
};
export const getDependencyColor = (priority:string) => {
  switch (priority.toLowerCase()) {
    case "completado":
      return "#FF4B4B";
    case 'en proceso':
      return "#FFA726";
    case 'pendiente':
      return "#4CAF50";
    default:
      return "#757575";
  }
};
export const getPriority = (priority: number) => {
  switch (priority) {
    case 1:
      return "Critica";
    case 2:
      return "Alta";
    case 3:
      return "Media";
    case 4:
      return "Normal";
    case 5:
      return "Baja";
    default:
      return "Todas";
  }
};
export const getStatus = (task: Task): string => {
  if (task.toDo) return "Pendiente";
  if (task.inProgress) return "En Progreso";
  if (task.completed) return "Completado";

  return "Todos"; // Valor por defecto en caso de que no coincida con ningún estado
};

export const getProgressColor = (progress: number) => {
  if (progress >= 80) return "#4CAF50";
  if (progress >= 40) return "#FFA726";
  if (progress >= 25) return "#FF9800";
  return "#FF4B4B";
};
