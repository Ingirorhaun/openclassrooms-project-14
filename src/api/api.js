import { states } from "./states";
import { departments } from "./departments";

/**
 * Saves a new employee to local storage.
 */
export function saveNewEmployee(newEmployeeData) {
    const existingEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    // Check the id of the last employee in the array to give an id to the new employee
    const lastEmployee = existingEmployees[existingEmployees.length - 1];
    const lastEmployeeId = lastEmployee ? lastEmployee.id : 0;
    newEmployeeData.id = lastEmployeeId + 1;
    const updatedEmployees = [...existingEmployees, newEmployeeData];
    try {
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
        return updatedEmployees
    } catch (error) {
        return new Error('Error saving employee data:', error);
    }
}

/**
 * Retrieves all employees from local storage.
 */
export function getAllEmployees() {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    return employees;
}

/**
 * Retrieves the list of states from a JSON file.
 */
export function getStatesList() {
    return states;
}

/**
 * Retrieves the list of departments from a JSON file.
 */
export function getDepartmentsList() {
    return departments;
}