import React from "react";
import { GitHubSearchApp } from "./main.app";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/dom";
import {
  GitHubCommit,
  GitHubFork,
  GitHubRepository,
  GitHubSearchResult,
  GitHubUser,
} from "../github-client/interfaces";
import "@testing-library/jest-dom";

export const buildExampleGitHubRepository: (
  name: string,
  id: number
) => GitHubRepository = (name: string, id: number) => {
  return {
    id: id,
    name: `${name}-${id}`,
    fullName: "",
    owner: { login: `owner-${id}`, url: "", bio: "" },
    stargazersCount: 0,
    htmlURL: "",
    commitsURL: "commitsURL",
    forksURL: "forksURL",
  };
};

describe("GitHubSearchApp", () => {
  test("should implement scenario: listing repositories, navigating through pages and clicking on details", async () => {
    const MockedGitHubClient = jest.fn().mockImplementation(() => {
      return {
        searchRepositories(
          query: string,
          page: number
        ): Promise<GitHubSearchResult> {
          return Promise.resolve({
            totalCount: 215,
            resultsPerPage: 10,
            items: Array.from({ length: 10 }, (x, i) =>
              buildExampleGitHubRepository(query, i + 10 * (page - 1))
            ),
          });
        },
        getRepository(): Promise<GitHubRepository> {
          return Promise.resolve({
            ...buildExampleGitHubRepository("repo", 6),
          });
        },
        getCommits(): Promise<GitHubCommit[]> {
          return Promise.resolve([{ authorLogin: "commit-author-01" }]);
        },
        getForks(): Promise<GitHubFork[]> {
          return Promise.resolve([
            { ownerLogin: "fork-owner-01", ownerURL: "path/to/owner" },
          ]);
        },
        getUser(): Promise<GitHubUser> {
          return Promise.resolve({
            login: "fork-owner-01",
            url: "",
            bio: "Fork enthusiast",
          });
        },
      };
    });
    const mockedClient = new MockedGitHubClient();

    localStorage.setItem("searchTerm", "spark");

    render(<GitHubSearchApp githubClient={mockedClient} />);
    expect(screen.getByRole("heading").innerHTML).toMatch(
      "GitHub repository list"
    );

    // waiting for search results to appear:
    await waitFor(() =>
      screen.getByText("Show details", {
        selector: 'a[href="/repository/owner-6/spark-6"]',
      })
    );

    // navigating to details page:
    fireEvent.click(
      screen.getByText("Show details", {
        selector: 'a[href="/repository/owner-6/spark-6"]',
      })
    );
    await waitFor(() =>
      screen.getByText("owner-6/spark-6", { selector: "h3" })
    );
    expect(
      screen.getByText("owner-6/spark-6", { selector: "h3" })
    ).toBeVisible();

    // navigating back to results:
    fireEvent.click(screen.getByTestId("back-to-search-button"));
    await waitFor(() =>
      screen.getByText("Show details", {
        selector: 'a[href="/repository/owner-6/spark-6"]',
      })
    );
    expect(screen.getByText("Backward")).not.toBeVisible();
    expect(screen.getByText("Forward")).toBeVisible();

    // navigating to page forward:
    fireEvent.click(screen.getByText("Forward"));
    await waitFor(() =>
      screen.getByText("Show details", {
        selector: 'a[href="/repository/owner-18/spark-18"]',
      })
    );
    expect(
      screen.getByText("Show details", {
        selector: 'a[href="/repository/owner-18/spark-18"]',
      })
    ).toBeVisible();
    expect(screen.getByText("Backward")).toBeVisible();

    // navigating to page backward:
    fireEvent.click(screen.getByText("Backward"));
    await waitFor(() =>
      screen.getByText("Show details", {
        selector: 'a[href="/repository/owner-6/spark-6"]',
      })
    );
    expect(screen.getByText("Backward")).not.toBeVisible();

    // search for another term:
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "kafka" },
    });
    fireEvent.submit(screen.getByTestId("search-form"));
    await waitFor(() =>
      screen.getByText("Show details", {
        selector: 'a[href="/repository/owner-1/kafka-1"]',
      })
    );
    expect(
      screen.getByText("Show details", {
        selector: 'a[href="/repository/owner-1/kafka-1"]',
      })
    ).toBeVisible();
  });

  test("Error scenario: show error message and retry on button click", async () => {
    let attemptCounter = 0;
    const MockedGitHubClient = jest.fn().mockImplementation(() => {
      return {
        searchRepositories(): Promise<GitHubSearchResult> {
          attemptCounter += 1;
          throw Error(
            `Could not load repositories (attempt #${attemptCounter})`
          );
        },
      };
    });
    const mockedClient = new MockedGitHubClient();
    render(<GitHubSearchApp githubClient={mockedClient} />);
    await waitFor(() =>
      screen.getByText("Could not load repositories (attempt #1)")
    );
    expect(
      screen.getByText("Could not load repositories (attempt #1)")
    ).toBeVisible();

    fireEvent.click(screen.getByTestId("retry-button"));
    await waitFor(() =>
      screen.getByText("Could not load repositories (attempt #2)")
    );
    expect(
      screen.getByText("Could not load repositories (attempt #2)")
    ).toBeVisible();
  });
});
