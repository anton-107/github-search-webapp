import { GitHubClientWithInMemoryCache } from "./github-client-inmemory-cache";

describe("GitHubClientWithInMemoryCache", () => {
  test("should not request underlying implementation for the second time", async () => {
    const mockedSearchRepositories = jest.fn().mockReturnValue([]);
    const mockedGetRepository = jest.fn().mockReturnValue({});
    const mockedGetCommits = jest.fn().mockReturnValue([]);
    const mockedGetForks = jest.fn().mockReturnValue([]);
    const mockedGetUser = jest.fn().mockReturnValue({});
    const MockedClient = jest.fn().mockImplementation(() => {
      return {
        searchRepositories: mockedSearchRepositories,
        getRepository: mockedGetRepository,
        getCommits: mockedGetCommits,
        getForks: mockedGetForks,
        getUser: mockedGetUser,
      };
    });
    const client = new GitHubClientWithInMemoryCache(new MockedClient());
    await client.searchRepositories("kafka", 1);
    await client.searchRepositories("kafka", 2);
    await client.searchRepositories("kafka", 1);
    await client.searchRepositories("kafka", 2);
    expect(mockedSearchRepositories).toHaveBeenCalledTimes(2);

    await client.getRepository("apache", "spark");
    await client.getRepository("apache", "spark");
    await client.getRepository("apache", "http2");
    expect(mockedGetRepository).toHaveBeenCalledTimes(2);

    await client.getCommits("commitsurl-01");
    await client.getCommits("commitsurl-02");
    await client.getCommits("commitsurl-01");
    expect(mockedGetCommits).toHaveBeenCalledTimes(2);

    await client.getForks("forksurl-01");
    await client.getForks("forksurl-02");
    await client.getForks("forksurl-01");
    await client.getForks("forksurl-03");
    expect(mockedGetForks).toHaveBeenCalledTimes(3);

    await client.getUser("apache");
    await client.getUser("redfox");
    await client.getUser("redfox");
    expect(mockedGetUser).toHaveBeenCalledTimes(2);
  });
});
