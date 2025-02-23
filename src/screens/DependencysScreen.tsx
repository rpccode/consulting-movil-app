import { View, Text } from 'react-native'
import React from 'react'
import DependencyList from '../components/tasks/DependencyList'
import { HomeLayout } from '../layouts/HomeLayout'
import { useEmployeeStore } from '../store/EmployeeStore'
import { TaskService } from '../services/TaskService'
import { Task } from '../../types/types'

type DependencyStatus = "pendiente" | "completado" | "en proceso";

export default function DependencysScreen() {
  const { Employees, updateTaskInStore } = useEmployeeStore();

  const dependencies = Employees
    .flatMap((employee) => employee.tasks?.map((task) => task.dependencies || []))
    .flat();
  
  const updateDependencies = async (id: string, status: DependencyStatus, comment: string) => {
    // Busca la tarea que contiene la dependencia con el ID proporcionado
    let updatedTask:Task;
    Employees.forEach((employee) => {
      employee.tasks?.forEach((task) => {
        if (task.dependencies?.some((dep) => dep.id === id)) {
          // Actualiza la dependencia dentro de la tarea
          task.dependencies = task.dependencies.map((dep) =>
            dep.id === id ? { ...dep, status, comment } : dep
          );
  
          updatedTask = task; // Guarda la referencia de la tarea actualizada
        }
      });
    });
  
    if (!updatedTask) {
      alert("No se encontró la tarea con la dependencia proporcionada.");
      return;
    }
    const {id: taskId ,estimatedCompletionDate,workWeek,time,tags,team,...resto} = updatedTask
  
    // Actualiza la tarea en la base de datos
    const newTaskData = await TaskService.updateTask(updatedTask.id,resto );
  
    // Actualiza el estado global de la tarea en la store
    updateTaskInStore(updatedTask.id, newTaskData);
  };
  

  return (
    <HomeLayout>
      <DependencyList dependencies={dependencies} onUpdateDependency={updateDependencies}/>
    </HomeLayout>
  )
}