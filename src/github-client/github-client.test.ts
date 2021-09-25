import {
  GitHubClientImpl,
  OriginGitHubCommit,
  OriginGitHubFork,
  OriginGitHubRepository,
  OriginGitHubUser,
} from "./github-client";

const exampleOriginGitHubRepository = {
  id: 42,
  name: "spark",
  full_name: "spark/spark",
  owner: { login: "spark", url: "", bio: "Spark org" },
  stargazers_count: 216,
  html_url: "",
  commits_url: "",
  forks_url: "",
};

describe("GitHub client", () => {
  describe("searchRepositories", () => {
    test("should return a list of github repositories", async () => {
      const MockedFetcher = jest.fn().mockImplementation(() => {
        const items: OriginGitHubRepository[] = [
          {
            ...exampleOriginGitHubRepository,
          },
        ];

        return {
          fetch(url: string) {
            expect(url).toBe(
              "https://api.github.com/search/repositories?q=spark&sort=stars&order=desc&per_page=10&page=1"
            );
            return Promise.resolve({
              total_count: 1,
              items,
            });
          },
        };
      });

      const client = new GitHubClientImpl(
        { numberOfRepositoriesPerPage: 10 },
        new MockedFetcher()
      );
      const searchResults = await client.searchRepositories("spark", 1);
      expect(searchResults.resultsPerPage).toBe(10);
      expect(searchResults.totalCount).toBe(1);
      expect(searchResults.items.length).toBe(1);
      expect(searchResults.items[0].fullName).toBe("spark/spark");
    });
  });

  describe("getRepository", () => {
    test("should return single repository details", async () => {
      const MockedFetcher = jest.fn().mockImplementation(() => {
        return {
          fetch(url: string) {
            expect(url).toBe("https://api.github.com/repos/apache/spark");

            const repository: OriginGitHubRepository = {
              ...exampleOriginGitHubRepository,
              stargazers_count: 42,
            };
            return Promise.resolve(repository);
          },
        };
      });
      const client = new GitHubClientImpl(
        { numberOfRepositoriesPerPage: 10 },
        new MockedFetcher()
      );
      const searchResults = await client.getRepository("apache", "spark");
      expect(searchResults.stargazersCount).toBe(42);
    });
  });

  describe("getCommits", () => {
    test("should return list of commits", async () => {
      const MockedFetcher = jest.fn().mockImplementation(() => {
        return {
          fetch(url: string) {
            expect(url).toBe("https://github.api/commits");

            const commits: OriginGitHubCommit[] = [
              { author: { login: "author-login-01", url: "", bio: "" } },
              { author: { login: "author-login-02", url: "", bio: "" } },
              { author: { login: "author-login-03", url: "", bio: "" } },
            ];
            return Promise.resolve(commits);
          },
        };
      });
      const client = new GitHubClientImpl(
        { numberOfRepositoriesPerPage: 10 },
        new MockedFetcher()
      );
      const commits = await client.getCommits("https://github.api/commits");
      expect(commits.length).toBe(3);
      expect(commits[1].authorLogin).toBe("author-login-02");
    });
  });

  describe("getForks", () => {
    test("should return list of forks", async () => {
      const MockedFetcher = jest.fn().mockImplementation(() => {
        return {
          fetch(url: string) {
            expect(url).toBe("https://github.api/forks");

            const forks: OriginGitHubFork[] = [
              { owner: { login: "author-login-01", url: "", bio: "" } },
              { owner: { login: "author-login-02", url: "", bio: "" } },
              { owner: { login: "author-login-03", url: "", bio: "" } },
            ];
            return Promise.resolve(forks);
          },
        };
      });
      const client = new GitHubClientImpl(
        { numberOfRepositoriesPerPage: 10 },
        new MockedFetcher()
      );
      const commits = await client.getForks("https://github.api/forks");
      expect(commits.length).toBe(3);
      expect(commits[2].ownerLogin).toBe("author-login-03");
    });
  });

  describe("getUser", () => {
    test("should return user details", async () => {
      const MockedFetcher = jest.fn().mockImplementation(() => {
        return {
          fetch(url: string) {
            expect(url).toBe("https://github.api/user/x");

            const user: OriginGitHubUser = {
              login: "x",
              bio: "Full stack developer",
              url: "",
            };
            return Promise.resolve(user);
          },
        };
      });
      const client = new GitHubClientImpl(
        { numberOfRepositoriesPerPage: 10 },
        new MockedFetcher()
      );
      const user = await client.getUser("https://github.api/user/x");
      expect(user.bio).toBe("Full stack developer");
    });
  });
});
