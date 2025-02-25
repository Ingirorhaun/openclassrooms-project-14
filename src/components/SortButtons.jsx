import { PropTypes } from "prop-types";
import { toCamelCase } from "../utils";

export const SortButtons = ({ header, sortFn, sortField, sortDirection }) => {
    const key = toCamelCase(header);
    const isActive = sortField === key;
    return (
      <div className="sort-buttons">
        <button
          className={`arrow-up ${
            isActive && sortDirection === "asc" ? "active" : ""
          }`}
          onClick={() => sortFn(header, "asc")}
        />
        <button
          className={`arrow-down ${
            isActive && sortDirection === "desc" ? "active" : ""
          }`}
          onClick={() => sortFn(header, "desc")}
        />
      </div>
    );
  };
  //Sort buttons prop types
  SortButtons.propTypes = {
    header: PropTypes.string.isRequired,
      sortFn: PropTypes.func.isRequired,
      sortField: PropTypes.string,
    sortDirection: PropTypes.string
  };