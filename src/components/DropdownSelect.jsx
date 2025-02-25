import { useEffect, useRef } from "react";
import { PropTypes } from "prop-types";
import { useState } from "react";
/**
 * Dropdown select component
 * @param {Object[]} options - An array of options to be displayed in the dropdown
 * @param {Function} onChange - A callback function to be called when the selected option changes
 * @returns {JSX.Element} - The rendered dropdown select component
 */

export default function DropdownSelect({ options, onSelect, name }) {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (e) => {
    setInputValue(e.target.label);
    setSelectedOption(e.target);
    setIsOpen(false);
    onSelect(e);
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
    setIsOpen(true);
    setFilteredOptions(
      options.filter((option) => {
        return option.label
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      })
    );
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropdown-content">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Select..."
            autoComplete="none"
            value={selectedOption?.label || ""}
            readOnly
            onFocus={() => {
              setFilteredOptions(options);
              setIsOpen(true);
            }}
            {...(name ? { id: name } : {})}
          />
          <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
        </div>
        {isOpen && filteredOptions.length === 0 && (
          <div className="dropdown-options">No results found</div>
        )}
        {isOpen && filteredOptions.length > 0 && (
          <div className="dropdown-options">
            <input
              type="search"
              autoComplete="none"
              placeholder="Search..."
              value={inputValue}
              onChange={handleInput}
            />
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className="dropdown-option"
                onClick={() => {
                  handleSelect({
                    target: {
                      value: option.value,
                      label: option.label,
                      name: name,
                    },
                  });
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

//define proptypes
DropdownSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  name: PropTypes.string,
};
