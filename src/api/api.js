import departmentsData from './data/departments.json';
import statesData from './data/states.json';

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
        return newEmployeeData
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
 * Returns a sub
 * @param {number} page - The page number (starting from 1)
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Object} - Contains items, totalItems, totalPages and currentPage
 */
export function getPaginatedItems(items, page = 1, itemsPerPage = 10) {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Calculate start and end index for the requested page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice the array to get only the items for the current page
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
        items: paginatedItems,
        totalItems,
        totalPages,
        currentPage: page
    };
}

/**
 * Retrieves sorted and filtered employees
 * @param {string} sortField - Field to sort by
 * @param {string} sortDirection - 'asc' or 'desc'
 * @param {string} searchQuery
 * @returns {Array} - A filtered and sorted array of employees
 */
export function searchEmployees(sortField = '', sortDirection = '', searchQuery = '', page, itemsPerPage) {
    let employees = getAllEmployees();

    // Apply search filter
    if (searchQuery) {
        employees = employees.filter(employee => {
            return Object.values(employee).some(value =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    }

    // Sort only if sortField is specified
    if (sortField) {
        employees.sort((a, b) => {
            const valA = a[sortField];
            const valB = b[sortField];

            // Sort dates
            if (sortField === "startDate" || sortField === "dateOfBirth") {
                const parseDateString = (dateStr) => {
                    const [day, month, year] = dateStr.split("/");
                    return new Date(year, month - 1, day).getTime();
                };
                const dateA = parseDateString(valA);
                const dateB = parseDateString(valB);
                return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
            }

            // Sort numbers
            if (!isNaN(valA) && !isNaN(valB)) {
                return sortDirection === "asc"
                    ? Number(valA) - Number(valB)
                    : Number(valB) - Number(valA);
            }

            // Sort strings
            const stringA = String(valA).toLowerCase();
            const stringB = String(valB).toLowerCase();
            return sortDirection === "asc"
                ? stringA.localeCompare(stringB)
                : stringB.localeCompare(stringA);
        });
    }
    const response = { ...getPaginatedItems(employees, page, itemsPerPage) }
    response.searchQuery = searchQuery;
    response.sortField = sortField;
    response.sortDirection = sortDirection;
    return response;
}


/**
 * Retrieves the list of states from a JSON file.
 */
export function getStatesList() {
    return statesData;
}

/**
 * Retrieves the list of departments from a JSON file.
 */
export async function getDepartmentsList() {
    return departmentsData;
}

