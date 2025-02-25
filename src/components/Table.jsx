import { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import { SortButtons } from "./SortButtons";
import { toCamelCase } from "../utils";
/**
 * A table with pagination and sorting capabilities
 */
export default function Table({ items, sortFn }) {
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [sortedItems, setSortedItems] = useState();

  useEffect(() => {
    setSortedItems(items);
  }, [items]);

  //Populate table headers from object keys
  let headersWithSpaces = [];
  if (items.length) {
    const headers = Object.keys(items[0]);
    headersWithSpaces = headers.map((header) => {
      return header
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
    });
  }

  const handleSort = (field, direction) => {
    const key = toCamelCase(field);
    setSortField(key);
    setSortDirection(direction);
    sortFn(key, direction);
  };

  
  return (
    <table>
      <thead>
        <tr>
          {!!headersWithSpaces.length &&
            headersWithSpaces.map((header) => (
              <th key={header}>
                <span>
                  <SortButtons header={header} sortFn={handleSort} sortField={sortField} sortDirection={sortDirection} />
                  {header}
                </span>
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {sortedItems?.map((item, index) => (
          <tr key={index}>
            {Object.values(item).map((value, index) => (
              <td key={index}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

//Define proptypes
Table.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
      dateOfBirth: PropTypes.string.isRequired,
      street: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zipCode: PropTypes.string.isRequired,
    })
  ).isRequired,
  sortFn: PropTypes.func.isRequired,
};
