import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../Modal";

describe("Modal Component", () => {
  it("renders with title and content", () => {
    render(
      <Modal title="Test Modal" onClose={() => {}}>
        <p>Test content</p>
      </Modal>
    );

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <Modal title="Test Modal" onClose={handleClose}>
        <p>Test content</p>
      </Modal>
    );

    const closeButton = screen.getByRole("button", { name: /×/i });
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("renders without title", async () => {
    render(
      <Modal onClose={() => {}}>
        <p>Test content</p>
      </Modal>
    );

    const header = await screen.queryByRole("heading");
    expect(header).toBeNull();
  });
});
