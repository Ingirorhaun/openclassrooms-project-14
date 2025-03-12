import { useEffect, useState } from "react";
import { getStatesList, saveNewEmployee, getDepartmentsList } from "../api/api";
import Modal from "./Modal";
import DropdownSelect from "@ingirorhaun/oc-react-dropdown-select"

export default function EmployeeCreationForm() {
  const [states, setStates] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    startDate: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    department: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const resetEmployeeForm = () => {
    setEmployee({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      startDate: "",
      street: "",
      city: "",
      zip: "",
    });
  };

  /**
   * Convert datesf rom yyyy-mm-dd to dd/mm/yyyy
   * @param {string} dateString - Date in yyyy-mm-dd format
   * @returns {string} Date in dd/mm/yyyy format
   */
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  /**
   *
   */
  const createEmployee = async (e) => {
    e.preventDefault();

    const newEmployee = {
      firstName: employee.firstName,
      lastName: employee.lastName,
      dateOfBirth: formatDate(employee.dateOfBirth),
      startDate: formatDate(employee.startDate),
      street: employee.street,
      city: employee.city,
      state: employee.state,
      zip: employee.zip,
      department: employee.department,
    };
    const result = await saveNewEmployee(newEmployee);
    if (!(result instanceof Error)) {
      resetEmployeeForm();
      setIsModalVisible(true);
    } else {
      //Handle error
      console.error(result);
    }
  };

  useEffect(() => {
    const fetchStates = async () => {
      const states = await getStatesList();
      setStates(states);
    };
    const fetchDepartments = async () => {
      const departments = await getDepartmentsList();
      setDepartments(departments);
    };
    fetchStates();
    fetchDepartments();
  }, []);

  return (
    <div className="form-wrapper">
      {isModalVisible && (
        <Modal onClose={() => setIsModalVisible(false)}>
          <div>Employee created successfully!</div>
        </Modal>
      )}
      <form onSubmit={createEmployee}>
        <h2>Create Employee</h2>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          onChange={handleChange}
          value={employee.firstName}
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          onChange={handleChange}
          value={employee.lastName}
        />
        <label htmlFor="dateOfBirth">Date of birth</label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          onChange={handleChange}
          value={employee.dateOfBirth}
        />
        <label htmlFor="startDate">Start Date</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          onChange={handleChange}
          value={employee.startDate}
        />
        <h3>Address</h3>
        <label htmlFor="street">Street</label>
        <input
          type="text"
          id="street"
          name="street"
          onChange={handleChange}
          value={employee.street}
        />
        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          name="city"
          onChange={handleChange}
          value={employee.city}
        />
        <label htmlFor="state">State</label>
        <DropdownSelect
          id={"state"}
          options={states}
          onSelect={handleChange}
        />
        <label htmlFor="zip">Zip</label>
        <input
          type="text"
          id="zip"
          name="zip"
          onChange={handleChange}
          value={employee.zip}
        />
        <label htmlFor="department">Department</label>
        <DropdownSelect
          id={"department"}
          options={departments}
          onSelect={handleChange}
        />
        <button
          type="submit"
          disabled={Object.values(employee).some((value) => {
            return !value;
          })}
        >
          Save
        </button>
      </form>
    </div>
  );
}
