import {
  GitHubClient,
  GitHubCommit,
  GitHubFork,
  GitHubRepository,
  GitHubSearchResult,
  GitHubUser,
} from "./interfaces";

export class GitHubClientWithInMemoryCache implements GitHubClient {
  public searchCache: Record<string, Record<number, GitHubSearchResult>> = {};
  private repositoryCache: Record<string, Record<string, GitHubRepository>> =
    {};
  private commitsCache: Record<string, GitHubCommit[]> = {};
  private forksCache: Record<string, GitHubFork[]> = {};
  private userCache: Record<string, GitHubUser> = {};

  constructor(private nonCachedClient: GitHubClient) {}

  public async searchRepositories(
    query: string,
    page: number
  ): Promise<GitHubSearchResult> {
    if (this.searchCache[query] && this.searchCache[query][page]) {
      return this.searchCache[query][page];
    }
    const results = await this.nonCachedClient.searchRepositories(query, page);
    if (!this.searchCache[query]) {
      this.searchCache[query] = {};
    }
    this.searchCache[query][page] = results;
    return results;
  }
  public async getRepository(
    owner: string,
    name: string
  ): Promise<GitHubRepository> {
    if (this.repositoryCache[owner] && this.repositoryCache[owner][name]) {
      return this.repositoryCache[owner][name];
    }
    const results = await this.nonCachedClient.getRepository(owner, name);
    if (!this.repositoryCache[owner]) {
      this.repositoryCache[owner] = {};
    }
    this.repositoryCache[owner][name] = results;
    return results;
  }
  public async getCommits(commitsURL: string): Promise<GitHubCommit[]> {
    if (this.commitsCache[commitsURL]) {
      return this.commitsCache[commitsURL];
    }
    const results = await this.nonCachedClient.getCommits(commitsURL);
    this.commitsCache[commitsURL] = results;
    return results;
  }
  public async getForks(forksURL: string): Promise<GitHubFork[]> {
    if (this.forksCache[forksURL]) {
      return this.forksCache[forksURL];
    }
    const results = await this.nonCachedClient.getForks(forksURL);
    this.forksCache[forksURL] = results;
    return results;
  }
  public async getUser(userURL: string): Promise<GitHubUser> {
    if (this.userCache[userURL]) {
      return this.userCache[userURL];
    }
    const results = await this.nonCachedClient.getUser(userURL);
    this.userCache[userURL] = results;
    return results;
  }
}
