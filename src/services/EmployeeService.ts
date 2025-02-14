import { Employee } from "../../types/types";
import api from "../config/Api";

export const EmployeeService = {
    async getEmployees(): Promise<Employee[]> {
      try {
        const response = await api.get('/employees'); // Adjust endpoint as needed
        return response.data;
      } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }
    },
  
    async getActiveEmployees(): Promise<Employee[]> {
      try {
        const employees = await this.getEmployees();
        return employees.filter(emp => emp.isActive);
      } catch (error) {
        console.error('Error fetching active employees:', error);
        throw error;
      }
    },
  
    async getEmployeesByTeam(teamId: string): Promise<Employee[]> {
      try {
        const employees = await this.getEmployees();
        return employees.filter(emp => emp.team?.id === teamId);
      } catch (error) {
        console.error('Error fetching employees by team:', error);
        throw error;
      }
    }
  };