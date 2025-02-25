import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SortButtons } from "../SortButtons";

describe("SortButtons", () => {
  const mockSortFn = vi.fn();
  const defaultProps = {
    header: "First Name",
    sortFn: mockSortFn,
    sortField: "firstName",
    sortDirection: "asc"
  };

  // Reset mock function calls between tests
  beforeEach(() => {
    mockSortFn.mockClear();
  });

  it("renders both ascending and descending sort buttons", () => {
    render(<SortButtons {...defaultProps} />);
    
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveClass("arrow-up");
    expect(buttons[1]).toHaveClass("arrow-down");
  });

  it("applies active class to ascending button when sorting ascending", () => {
    render(<SortButtons {...defaultProps} />);
    
    const ascButton = screen.getAllByRole("button")[0];
    expect(ascButton).toHaveClass("active");
  });

  it("applies active class to descending button when sorting descending", () => {
    render(
      <SortButtons
        {...defaultProps}
        sortDirection="desc"
      />
    );
    
    const descButton = screen.getAllByRole("button")[1];
    expect(descButton).toHaveClass("active");
  });

  it("calls sortFn with correct parameters when ascending button is clicked", () => {
    render(<SortButtons {...defaultProps} />);
    
    const ascButton = screen.getAllByRole("button")[0];
    fireEvent.click(ascButton);
    
    expect(mockSortFn).toHaveBeenCalledTimes(1);
    expect(mockSortFn).toHaveBeenCalledWith("First Name", "asc");
  });

  it("calls sortFn with correct parameters when descending button is clicked", () => {
    render(<SortButtons {...defaultProps} />);
    
    const descButton = screen.getAllByRole("button")[1];
    fireEvent.click(descButton);
    
    expect(mockSortFn).toHaveBeenCalledTimes(1);
    expect(mockSortFn).toHaveBeenCalledWith("First Name", "desc");
  });

  it("doesn't have any button with the active class when the sort field doesn't match the header", () => {
    render(
      <SortButtons
        {...defaultProps}
        sortField="lastName"
      />
    );
    
    const ascButton = screen.getAllByRole("button")[0];
    const descButton = screen.getAllByRole("button")[1];
    
    expect(ascButton).not.toHaveClass("active");
    expect(descButton).not.toHaveClass("active");
  });
});
