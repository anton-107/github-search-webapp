import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { SearchBarComponent } from "./search-bar.component";

const emptyFn = (): void => {
  // explicitly empty
};

describe("SearchBarComponent", () => {
  test("should display initial value", () => {
    render(<SearchBarComponent initialValue="spark" onNewSearch={emptyFn} />);
    expect(screen.getByRole("textbox")).toHaveValue("spark");
  });
  test("should not trigger search on empty value", () => {
    const mockNewSearch = jest.fn();
    render(<SearchBarComponent initialValue="" onNewSearch={mockNewSearch} />);
    expect(screen.getByRole("textbox")).toHaveValue("");
    fireEvent.submit(screen.getByTestId("search-form"));
    expect(mockNewSearch).not.toBeCalled();
  });
  test("should trigger search on form submit", () => {
    const mockNewSearch = jest.fn();
    render(<SearchBarComponent initialValue="" onNewSearch={mockNewSearch} />);
    expect(screen.getByRole("textbox")).toHaveValue("");
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "spark" },
    });
    fireEvent.submit(screen.getByTestId("search-form"));
    expect(mockNewSearch).toBeCalledWith("spark");
  });
});
