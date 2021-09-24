import { ResourceFetcher } from "../web-api/interfaces";
import { GitHubClient, GitHubSearchResult } from "./interfaces";

export class GitHubClientImpl implements GitHubClient {
  constructor(private resourceFetcher: ResourceFetcher) {
  }
  public async searchRepositories(): Promise<GitHubSearchResult> {
    return await this.resourceFetcher.fetch('https://api.github.com/search/repositories?q=apache+language:scala&sort=stars&order=desc');
  }
}