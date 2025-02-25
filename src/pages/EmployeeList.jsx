import { useEffect, useState } from "react";
import { searchEmployees } from "../api/api";
import Table from "../components/Table";

export default function EmployeeList() {
  const [employeesData, setEmployeesData] = useState({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, [itemsPerPage, sortDirection, sortField, searchQuery]);

  const fetchEmployees = async (page = 1) => {
    const employees = await searchEmployees(
      sortField,
      sortDirection,
      searchQuery,
      page,
      itemsPerPage
    );
    setEmployeesData(employees);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
  };

  const handlePageChange = (newPage) => {
    fetchEmployees(newPage);
  };

  const renderPageButtons = () => {
    const totalPages = employeesData.totalPages;
    const currentPage = employeesData.currentPage;
    let buttons = [];

    // Always show first page
    buttons.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={currentPage == "1" ? "active" : ""}
      >
        1
      </button>
    );

    let startPage = Math.max(2, currentPage - 3);
    let endPage = Math.min(totalPages - 1, currentPage + 3);

    // Adjust the range to show up to 7 numbers between first and last
    if (currentPage - 3 <= 2) {
      endPage = Math.min(totalPages - 1, 8);
    }
    if (currentPage + 3 >= totalPages - 1) {
      startPage = Math.max(2, totalPages - 7);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      buttons.push(<span key="ellipsis1">...</span>);
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={currentPage === i}
          className={currentPage == i ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      buttons.push(<span key="ellipsis2">...</span>);
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={currentPage == totalPages ? "active" : ""}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  const handleSortChange = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  return (
    <div className="employees-list">
      <h1>Current Employees</h1>
      <div className="filters-wrapper">
        <div>
          <label htmlFor="itemsPerPage">Show </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span> entries</span>
        </div>
        <div>
          <label htmlFor="search">Search: </label>
          <input
            type="search"
            id="search"
            name="search"
            placeholder="Type to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Table items={employeesData.items} sortFn={handleSortChange} />
      <div className="total-items">
        <span>
          Showing{" "}
          {Math.min(
            (employeesData.currentPage - 1) * itemsPerPage + 1,
            employeesData.totalItems
          )}
          -
          {Math.min(
            employeesData.currentPage * itemsPerPage,
            employeesData.totalItems
          )}{" "}
          of {employeesData.totalItems} entries
        </span>
      </div>
      {employeesData.totalItems > 0 && (
        <div className="pagination">
          <button
            className="previous-btn"
            onClick={() => handlePageChange(employeesData.currentPage - 1)}
            disabled={employeesData.currentPage === 1}
          >
            Previous
          </button>
          {renderPageButtons()}
          <button
            className="next-btn"
            onClick={() => handlePageChange(employeesData.currentPage + 1)}
            disabled={employeesData.currentPage === employeesData.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
