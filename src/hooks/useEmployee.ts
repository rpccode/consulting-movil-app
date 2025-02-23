import { useEmployeeStore } from "../store/EmployeeStore"

const useEmployee = () => {
    
    const getEmployee = useEmployeeStore((state) => state.Employee)

    const getAllEmployees = useEmployeeStore((state) => state.Employees)

    const FetchEmployee = useEmployeeStore((state) => state.getEmployee)
    const FetchEmployees = useEmployeeStore((state) => state.getEmployees)
    const AddEmployee = useEmployeeStore((state) => state.addEmployee)
    const RemoveEmployee = useEmployeeStore((state) => state.removeEmployee)
    const UpdateEmployee = useEmployeeStore((state) => state.updateEmployee)
    const SetEmployee = useEmployeeStore((state) => state.setEmployee)
    const SetEmployees = useEmployeeStore((state) => state.setEmployees)

    
    return { getAllEmployees,getEmployee, FetchEmployee, FetchEmployees, AddEmployee, RemoveEmployee, UpdateEmployee, SetEmployee, SetEmployees }

}

export default useEmployee
