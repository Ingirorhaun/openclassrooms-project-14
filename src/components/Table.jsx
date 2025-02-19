import { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
/**
 * A table with pagination and sorting capabilities
 */
export default function Table({ items }) {
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

  const toCamelCase = (str) => {
    return str
      .split(" ")
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join("");
  };

  const sort = (field, direction) => {
    // Convert field header back to object key format
    const key = toCamelCase(field);
    setSortField(key);
    // Toggle sort direction if same field is clicked
    setSortDirection(direction);

    const parseDateString = (dateStr) => {
      const [day, month, year] = dateStr.split("/");
      return new Date(year, month - 1, day).getTime();
    };

    const updatedSortedItems = [...sortedItems].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      //Sort dates
      if (key === "startDate" || key === "dateOfBirth") {
        const dateA = parseDateString(valA);
        const dateB = parseDateString(valB);
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      }
      //Sort numbers
      if (!isNaN(valA) && !isNaN(valB)) {
        return direction === "asc"
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);
      }

      //Sort strings
      const stringA = String(valA).toLowerCase();
      const stringB = String(valB).toLowerCase();

      if (direction === "asc") {
        return stringA.localeCompare(stringB);
      }
      return stringB.localeCompare(stringA);
    });

    setSortedItems(updatedSortedItems);
  };

  //Create arrow buttons to be added to the table headers
  const ArrowButtons = ({ header, sort }) => {
    const key = toCamelCase(header);
    const isActive = sortField === key;
    return (
      <div className="sort-buttons">
        <button
          className={`arrow-up ${
            isActive && sortDirection === "asc" ? "active" : ""
          }`}
          onClick={() => sort(header, "asc")}
        />
        <button
          className={`arrow-down ${
            isActive && sortDirection === "desc" ? "active" : ""
          }`}
          onClick={() => sort(header, "desc")}
        />
      </div>
    );
  };
  //Arrow buttons prop types
  ArrowButtons.propTypes = {
    header: PropTypes.string.isRequired,
    sort: PropTypes.func.isRequired,
  };
  return (
    <table>
      <thead>
        <tr>
          {!!headersWithSpaces.length &&
            headersWithSpaces.map((header) => (
              <th key={header}>
                <span>
                  <ArrowButtons header={header} sort={sort} />
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
};
