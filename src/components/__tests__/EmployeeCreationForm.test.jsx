import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmployeeCreationForm from "../EmployeeCreationForm";
import {
  saveNewEmployee,
  getStatesList,
  getDepartmentsList,
} from "../../api/api";

// Mock the API calls
vi.mock("../../api/api", () => ({
  saveNewEmployee: vi.fn(),
  getStatesList: vi.fn(),
  getDepartmentsList: vi.fn(),
}));

describe("EmployeeCreationForm", () => {
  beforeEach(() => {
    // Setup mock return values
    getStatesList.mockResolvedValue([
      { value: "AL", label: "Alabama" },
      { value: "AK", label: "Alaska" },
    ]);
    getDepartmentsList.mockResolvedValue([
      { value: "sales", label: "Sales" },
      { value: "marketing", label: "Marketing" },
    ]);
    saveNewEmployee.mockResolvedValue({});
  });

  it("renders the form with all required fields", async () => {
    render(<EmployeeCreationForm />);

    // Check if all form elements are present
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/street/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
  });

  it("updates form values when user types", async () => {
    render(<EmployeeCreationForm />);
    const user = userEvent.setup();

    // Get input fields
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);

    // Type in the inputs
    await user.type(firstNameInput, "John");
    await user.type(lastNameInput, "Doe");

    // Check if values are updated
    expect(firstNameInput.value).toBe("John");
    expect(lastNameInput.value).toBe("Doe");
  });

  it("shows success modal after successful submission", async () => {
    render(<EmployeeCreationForm />);
    const user = userEvent.setup();

    // Fill out the form
    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/street/i), "123 Main Street");
    await user.type(screen.getByLabelText(/city/i), "Somecity");
    await user.type(screen.getByLabelText(/zip/i), "12345");
    const dateOfBirth = screen.getByLabelText(/date of birth/i);
    const startDate = screen.getByLabelText(/start date/i);
    await fireEvent.change(dateOfBirth, { target: { value: "1990-01-01" } });
    await fireEvent.change(startDate, { target: { value: "2023-01-01" } });
    // Select state and department
    const stateDropdown = screen.getAllByPlaceholderText("Select...")[0];
    fireEvent.focus(stateDropdown);
    const alabamaOption = await screen.findByText("Alabama");
    await user.click(alabamaOption);
    const departmentDropdown = screen.getAllByPlaceholderText("Select...")[1];
    fireEvent.focus(departmentDropdown);
    const salesOption = await screen.findByText("Sales");
    await user.click(salesOption);
    expect(stateDropdown.value).toBe("Alabama");
    expect(departmentDropdown.value).toBe("Sales");
    const submitButton = screen.getByText(/save/i);
    expect(submitButton).toBeEnabled();
    await user.click(submitButton);
    // Verify that saveNewEmployee was called with correct data
    expect(saveNewEmployee).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "01/01/1990",
      startDate: "01/01/2023",
      street: "123 Main Street",
      city: "Somecity",
      state: "AL",
      zip: "12345",
      department: "sales",
    });
    // Check if success modal appears
    await waitFor(() => {
      expect(
        screen.getByText(/Employee created successfully!/i)
      ).toBeInTheDocument();
    });
  });

  it("handles API errors appropriately", async () => {
    // Mock API error
    const error = new Error("API Error");
    saveNewEmployee.mockResolvedValueOnce(error);  

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<EmployeeCreationForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/street/i), "123 Main Street");
    await user.type(screen.getByLabelText(/city/i), "Somecity");
    await user.type(screen.getByLabelText(/zip/i), "12345");
    const dateOfBirth = screen.getByLabelText(/date of birth/i);
    const startDate = screen.getByLabelText(/start date/i);
    await fireEvent.change(dateOfBirth, { target: { value: "1990-01-01" } });
    await fireEvent.change(startDate, { target: { value: "2023-01-01" } });
    // Select state and department
    const stateDropdown = screen.getAllByPlaceholderText("Select...")[0];
    fireEvent.focus(stateDropdown);
    const alabamaOption = await screen.findByText("Alabama");
    await user.click(alabamaOption);
    const departmentDropdown = screen.getAllByPlaceholderText("Select...")[1];
    fireEvent.focus(departmentDropdown);
    const salesOption = await screen.findByText("Sales");
    await user.click(salesOption);
    expect(stateDropdown.value).toBe("Alabama");
    expect(departmentDropdown.value).toBe("Sales");
    const submitButton = screen.getByText(/save/i);
    expect(submitButton).toBeEnabled();
    await user.click(submitButton);

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith(error);

    consoleSpy.mockRestore();
  });

  it("does not allow clicking on the save button if the form is not filled in", () => {
    render(<EmployeeCreationForm />);

    const submitButton = screen.getByText(/save/i);
    expect(submitButton).toBeDisabled();
  });
});
