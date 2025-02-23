 // Definir los tipos de dependencias externas
 export type ExternalDependencyType =
 | "DESARROLLO I"
 | "DESARROLLO II"
 | "CALIDAD"
 | "CLIENTE"
 | "ENCARGADO DE CONSULTORÍA"
 | "FINANZAS"
 | "GERENCIA"
 | "VENTAS"
 | "IMPLEMENTACIÓN";
 
 // Nueva estructura para manejar dependencias externas con fechas
 
  
  export interface WorkWeek {
   id: string;
   startDate: string; // Fecha de inicio de la semana (lunes)
   endDate: string; // Fecha de fin de la semana (viernes)
   tasks: Task[]; // Tareas asociadas a la semana
   isClosed: boolean; // Indicador de si la semana está cerrada
   isTemporaly: boolean;
 }
 
 export interface Subtask {
   id?: string
   name: string
   startDate: string,
   endDate: string,
   duration: string,
   status: string,
   completion: number,
   assignee: string,
   department: string,
   client: string,
   taskType: string,
   completed: boolean
 }
 
 export interface ExternalDependency {
  id?: string;
  type: ExternalDependencyType;
  status: "pendiente" | "completado" | "en proceso"; // Estado de la dependencia
  comment?: string; // Comentario opcional sobre la dependencia
  startDate: string; // Fecha en que inicia la dependencia
  endDate: string; // Fecha límite para la dependencia
  createdAt: string; // Fecha en que se creó la dependencia
  updatedAt?: string; // Última modificación de la dependencia
  }
 
 export interface Task {
   id: string
   employeeId?: string
   taskType?:string
   priority: number
   weight?: number
   result?: number
   ticket?: string
   title: string
   client: string
   startDate?: string
   endDate?: string
   toDo?: boolean;
   inProgress?: boolean;
   progress: number;
   completed?: boolean;
   comment?: string;
   createDate?: string;
   time?: number;
   estimatedCompletionDate?: string;
   completionDate?: string;
   status?:string;
   hasSubtasks?: boolean,
   expanded?: boolean,
   selected?: boolean,
   tags?:string[]
   team?: Team
   subtasks?: Subtask[],
   workWeek?: WorkWeek,
   dependencies?: ExternalDependency[];
 }

 export const entyTask:Task = {
  id: "",
  priority: 0,
  title: "",
  client: "",
  progress: 0
}
 
 export interface Team {
   id:string,
   name:string,
   description:string,
   managerId:string
 }
 export interface Employee {
   id: string
   name: string
   tasks: Task[]
   leyPareto: number
   score?: number
   efficiency: number
   team?: Team
   isActive:boolean
 }
 export interface Employee2 {
   id: string
   name: string
   leyPareto: number
   score?: number
   efficiency: number
 }
 export interface User {
   id: string,
         username: string,
         password: string,
         isActive?: boolean,
         role?: {
             id: string,
             name: string
         },
         employee?: Employee,
     team?: Team
 }
 export interface TeamProgress {
   date?: string
   averageProgress?: number
 }
 
 
 // Alerta en tiempo real para Elizabeth
 export interface DependencyAlert {
   id: string;
   tasksWithDependencies: Task[]; // Lista de tareas con dependencias
   prioritySort: "taskPriority" | "recordPriority"; // Orden por prioridad de tarea o registro
   isActive: boolean; // Si la alerta está activa o no
   lastUpdated: string; // Última actualización de la alerta
   dependencies?:ExternalDependency[]
 }
 
 // Configuración de la alerta en tiempo real
 export const dependencyAlertSettings: DependencyAlert = {
   id: "",
   tasksWithDependencies: [],
   prioritySort: "taskPriority",
   isActive: true,
   lastUpdated: new Date().toISOString(),
 };
 
 export interface ConfigSettings {
   workingHoursPerDay: number
   defaultTaskPriority: number
   notificationEnabled: boolean
   theme: 'light' | 'dark'
   language: 'es' | 'en',
   dependencyAlertEnabled: boolean; 
 }
 
 
 