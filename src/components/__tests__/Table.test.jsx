import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Table from "../Table";

describe("Table Component", () => {
  const mockItems = [
    {
      firstName: "John",
      lastName: "Doe",
      startDate: "2021-01-01",
      department: "Engineering",
      dateOfBirth: "1990-01-01",
      street: "123 Main Street",
      city: "Somecity",
      state: "MA",
      zipCode: "12345",
      id: "1",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      startDate: "2021-02-01",
      department: "Sales",
      dateOfBirth: "1992-03-15",
      street: "456 Other Street",
      city: "Othercity",
      state: "NY",
      zipCode: "67890",
      id: "2",
    },
  ];

  const mockSortFn = vi.fn();

  it("renders without crashing", () => {
    render(<Table items={mockItems} sortFn={mockSortFn} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders correct number of rows", () => {
    render(<Table items={mockItems} sortFn={mockSortFn} />);
    const rows = screen.getAllByRole("row");
    // +1 for header row
    expect(rows).toHaveLength(mockItems.length + 1);
  });

  it("renders correct headers", () => {
    render(<Table items={mockItems} sortFn={mockSortFn} />);
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
  });

  it("renders correct data in cells", () => {
    render(<Table items={mockItems} sortFn={mockSortFn} />);
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
  });

  it("handles empty items array", () => {
    render(<Table items={[]} sortFn={mockSortFn} />);
    const rows = screen.queryAllByRole("row");
    expect(rows).toHaveLength(1); // Only header row should be present
  });

  it("calls sortFn when sort buttons are clicked", async () => {
    const user = userEvent.setup();
    render(<Table items={mockItems} sortFn={mockSortFn} />);
    
    const firstNameAscButton = screen.getAllByRole("columnheader")[0].querySelector(".arrow-up");
    await user.click(firstNameAscButton);
    
    expect(mockSortFn).toHaveBeenCalledWith("firstName", "asc");
  });
});
