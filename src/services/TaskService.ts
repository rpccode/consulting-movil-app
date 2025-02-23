import { ConfigSettings, Employee, Task } from "../../types/types";
import { logger } from "../../utils/logger";
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
    const response = await api.put(`/tasks/${taskId}`, updates);
    // logger.debug(`TaskService.updateTask: ${JSON.stringify(response.data)}`);
    return response.data;
  }
};