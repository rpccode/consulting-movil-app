import { Employee, Task } from "./../../types/types";
import { create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface EmployeeState {
  Employee: Employee;
  Employees: Employee[];
  addEmployee: (value: Employee) => void;
  removeEmployee: (value: Employee) => void;
  updateEmployee: (value: Employee) => void;
  getEmployee: (value: Employee) => void;
  getEmployees: () => void;
  setEmployee: (value: Employee) => void;
  setEmployees: (value: Employee[]) => void;
  updateTaskInStore: (taskId: string, updatedTask: Task) => void;
}

// Definir opciones de persistencia explícitamente
const persistOptions: PersistOptions<EmployeeState> = {
  name: "Employee-storage",
  storage: createJSONStorage(() => AsyncStorage),
};

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set) => ({
      Employee: {} as Employee,
      Employees: [],
      addEmployee: (value: Employee) => set((state) => {
        const existingIndex = state.Employees.findIndex(emp => emp.id === value.id);
      
        if (existingIndex !== -1) {
          // Si el empleado ya existe, actualizarlo
          const updatedEmployees = [...state.Employees];
          updatedEmployees[existingIndex] = value;
          return { Employees: updatedEmployees };
        } else {
          // Si el empleado no existe, agregarlo
          return { Employees: [...state.Employees, value] };
        }
      }),
      removeEmployee: (value: Employee) => set((state) => ({ Employees: state.Employees.filter(emp => emp.id !== value.id) })),
      updateEmployee: (value: Employee) => set((state) => ({
        Employees: state.Employees.map(emp => (emp.id === value.id ? value : emp))
      })),
      getEmployee: (value: Employee) => set((state) => ({
        Employee: state.Employees.find(emp => emp.id === value.id) || {} as Employee
      })),
      getEmployees: () => {}, // No es necesario modificar el estado aquí
      setEmployee: (value: Employee) => set(() => ({ Employee: value })),
      setEmployees: (value: Employee[]) => set(() => ({ Employees: value })),
      updateTaskInStore: (taskId: string, updatedTask: Task) => set((state) => ({
        Employees: state.Employees.map(employee => ({
          ...employee,
          tasks: employee.tasks?.map(task =>
            task.id === taskId ? { ...task, ...updatedTask } : task
          ) || []
        }))
      })),
    }),
    persistOptions
  )
);
