import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DropdownSelect from '../DropdownSelect';

describe('DropdownSelect', () => {
  const mockOptions = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' }
  ];

  const mockOnSelect = vi.fn();

  const renderDropdown = (props = {}) => {
    return render(
      <DropdownSelect
        options={mockOptions}
        onSelect={mockOnSelect}
        {...props}
      />
    );
  };

  it('renders correctly', () => {
    renderDropdown();
    expect(screen.getByPlaceholderText('Select...')).toBeInTheDocument();
  });

  it('opens dropdown on input focus', () => {
    renderDropdown();
    const input = screen.getByPlaceholderText('Select...');
    fireEvent.focus(input);
    
    // Check if all options are displayed
    mockOptions.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('selects an option when clicked', () => {
    renderDropdown();
    const input = screen.getByPlaceholderText('Select...');
    fireEvent.focus(input);
    
    const option = screen.getByText('Alabama');
    fireEvent.click(option);

    // Check if the selected value is displayed
    expect(input.value).toBe('Alabama');
    
    // Check if onSelect was called with correct parameters
    expect(mockOnSelect).toHaveBeenCalledWith({
      target: {
        value: 'AL',
        label: 'Alabama',
        name: undefined
      }
    });
  });

  it('filters options based on search input', () => {
    renderDropdown();
    const input = screen.getByPlaceholderText('Select...');
    fireEvent.focus(input);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Ala' } });

    // Should only show Alabama and Alaska
    expect(screen.getByText('Alabama')).toBeInTheDocument();
    expect(screen.getByText('Alaska')).toBeInTheDocument();
    expect(screen.queryByText('Arizona')).not.toBeInTheDocument();
  });

  it('shows "No results found" when no options match search', () => {
    renderDropdown();
    const input = screen.getByPlaceholderText('Select...');
    fireEvent.focus(input);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'XYZ' } });

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', () => {
    renderDropdown();
    const input = screen.getByPlaceholderText('Select...');
    fireEvent.focus(input);
    
    // Verify dropdown is open
    expect(screen.getByText('Alabama')).toBeInTheDocument();
    
    // Click outside
    fireEvent.mouseDown(document.body);
    
    // Verify dropdown is closed
    expect(screen.queryByText('Alabama')).not.toBeInTheDocument();
  });

  it('applies custom name prop to input', () => {
    renderDropdown({ name: 'state-select' });
    const input = screen.getByPlaceholderText('Select...');
    expect(input).toHaveAttribute('id', 'state-select');
  });
});
