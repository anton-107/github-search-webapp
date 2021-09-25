import React from "react";
import { buildExampleGitHubRepository } from "./main.app.test";
import { SearchResultsComponent } from "./search-results.component";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

const emptyFn = (): void => {
  // explicitly empty
};

describe("SearchResultsComponent", () => {
  test("should show list of repositories", () => {
    const repositories = Array.from({ length: 10 }, (x, i) =>
      buildExampleGitHubRepository("repo", i)
    );
    render(
      <BrowserRouter>
        <SearchResultsComponent
          onRetry={emptyFn}
          repositories={repositories}
          isLoading={false}
          isAtLeastOneSearchDone={true}
          searchError={null}
        />
      </BrowserRouter>
    );
    expect(screen.getByText("repo-0")).toBeVisible();
    expect(screen.getByText("repo-1")).toBeVisible();
    expect(screen.getByText("repo-2")).toBeVisible();
    expect(screen.getByText("repo-3")).toBeVisible();
    expect(screen.getByText("repo-4")).toBeVisible();
    expect(screen.getByText("repo-5")).toBeVisible();
    expect(screen.getByText("repo-6")).toBeVisible();
    expect(screen.getByText("repo-7")).toBeVisible();
    expect(screen.getByText("repo-8")).toBeVisible();
    expect(screen.getByText("repo-9")).toBeVisible();
  });
  test("should show error and call retry method", () => {
    const mockRetry = jest.fn();
    render(
      <SearchResultsComponent
        onRetry={mockRetry}
        repositories={[]}
        isLoading={false}
        isAtLeastOneSearchDone={true}
        searchError={"Error fetching repositories"}
      />
    );
    expect(screen.getByRole("button").innerHTML).toMatch("try again");
    fireEvent.click(screen.getByRole("button"));
    expect(mockRetry).toBeCalledTimes(1);
  });
  test("should zero results message", () => {
    render(
      <SearchResultsComponent
        onRetry={emptyFn}
        repositories={[]}
        isLoading={false}
        isAtLeastOneSearchDone={true}
        searchError={null}
      />
    );
    expect(screen.getByText("No repositories found")).toBeVisible();
  });
});
