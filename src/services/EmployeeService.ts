import { AuthServices } from './authServices';
import { Employee } from "../../types/types";
import api from "../config/Api";
import { logger } from '../../utils/logger';

export const EmployeeService = {
    async getEmployees() {
      const currentUser = await AuthServices.getCurrentUser();
      try {
        if (!currentUser) {
          throw new Error('No authenticated user found');
        }
        if (currentUser.role?.name === 'admin') {
          // Admin gets all tasks
          const response = await api.get('/employees');
          // SetEmployees(response.data)
          return response.data;
        } else {
          // Regular user gets only their tasks
          const response = await api.get(`/employees/${currentUser.employee?.id}`);
          // AddEmployee(response.data)
          return response.data;
        }
      } catch (error) {
        logger.error('Get Employee',currentUser)

        logger.error('Error fetching employees:', error);
        throw error;
      }
    },
  
    async getActiveEmployees(): Promise<Employee[]> {
      try {
        const employees = await this.getEmployees();
        return employees.filter(emp => emp.isActive);
      } catch (error) {
        logger.error('Error fetching active employees:', error);
        throw error;
      }
    },
  
    async getEmployeesByTeam(teamId: string): Promise<Employee[]> {
      try {
        const employees = await this.getEmployees();
        return employees.filter(emp => emp.team?.id === teamId);
      } catch (error) {
        logger.error('Error fetching employees by team:', error);
        throw error;
      }
    }
  };