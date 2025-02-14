import { ConfigSettings, Employee, Task } from "../../types/types";
import api from "../config/Api";

export const TaskService = {
  async getTasks(): Promise<Task[]> {
    const response = await api.get('/tasks');
    return response.data;
  },

  async getTasksByEmployee(employeeId: string): Promise<Task[]> {
    const response = await api.get(`/employees/${employeeId}/tasks`);
    return response.data;
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const response = await api.patch(`/tasks/${taskId}`, updates);
    return response.data;
  }
};