import { useEffect, useState } from "react";
import { getAllEmployees } from "../api/api";
import Table from "../components/Table";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const employees = await getAllEmployees();
      setEmployees(employees);
      setFilteredEmployees(employees);
    };
    fetchEmployees();
  }, []);

  const handleSearchInputChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (searchValue === "") {
      setFilteredEmployees(employees);
      return;
    }
    const results = employees.filter((employee) => {
      return Object.values(employee).some((value) =>
        String(value).toLowerCase().includes(searchValue)
      );
    });
    setFilteredEmployees(results);
  };

  return (
    <div>
      <h1>Current Employees</h1>
      <label htmlFor="search">Search: </label>
      <input
        type="search"
        id="search"
        name="search"
        onChange={handleSearchInputChange}
      />
      <Table items={filteredEmployees} />
    </div>
  );
}
