import { PropTypes } from 'prop-types'
/**
 * Dropdown select component
 * @param {Object[]} options - An array of options to be displayed in the dropdown
 * @param {Function} onChange - A callback function to be called when the selected option changes
 * @returns {JSX.Element} - The rendered dropdown select component
 */

export default function DropdownSelect({options, onChange, name}) {
    return (
        <select onChange={onChange} {...(name && {name})}>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
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
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string,
};