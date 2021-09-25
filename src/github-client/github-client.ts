import { ResourceFetcher } from "../web-api/interfaces";
import {
  GitHubClient,
  GitHubCommit,
  GitHubFork,
  GitHubRepository,
  GitHubSearchResult,
  GitHubUser,
} from "./interfaces";

export interface OriginGitHubUser {
  login: string;
  url: string;
  bio: string;
}

export interface OriginGitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: OriginGitHubUser;
  stargazers_count: number;
  html_url: string;
  commits_url: string;
  forks_url: string;
}
interface OriginGitHubSearchResult {
  total_count: number;
  items: OriginGitHubRepository[];
}
interface GitHubClientConfiguration {
  numberOfRepositoriesPerPage: number;
}
export interface OriginGitHubCommit {
  author: OriginGitHubUser;
}
export interface OriginGitHubFork {
  owner: OriginGitHubUser;
}

export class GitHubClientImpl implements GitHubClient {
  constructor(
    private configuation: GitHubClientConfiguration,
    private resourceFetcher: ResourceFetcher
  ) {}
  public async searchRepositories(
    query: string,
    page: number = 1
  ): Promise<GitHubSearchResult> {
    const githubResults =
      await this.resourceFetcher.fetch<OriginGitHubSearchResult>(
        `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=${this.configuation.numberOfRepositoriesPerPage}&page=${page}`
      );
    const result = {
      resultsPerPage: this.configuation.numberOfRepositoriesPerPage,
      totalCount: githubResults.total_count,
      items: githubResults.items.map((x) => this.mapFrom(x)),
    };

    return result;
  }
  public async getRepository(
    owner: string,
    name: string
  ): Promise<GitHubRepository> {
    const githubResult =
      await this.resourceFetcher.fetch<OriginGitHubRepository>(
        `https://api.github.com/repos/${owner}/${name}`
      );
    return this.mapFrom(githubResult);
  }
  public async getCommits(commitsURL: string): Promise<GitHubCommit[]> {
    const githubResult = await this.resourceFetcher.fetch<OriginGitHubCommit[]>(
      commitsURL.replace("{/sha}", "")
    );
    return githubResult.map((x) => {
      return {
        authorLogin: x.author?.login,
      };
    });
  }
  public async getForks(forksURL: string): Promise<GitHubFork[]> {
    const githubResult = await this.resourceFetcher.fetch<OriginGitHubFork[]>(
      forksURL
    );
    return githubResult.map((x) => {
      return {
        ownerLogin: x.owner?.login,
        ownerURL: x.owner?.url,
      };
    });
  }
  public async getUser(userURL: string): Promise<GitHubUser> {
    const githubResult = await this.resourceFetcher.fetch<OriginGitHubUser>(
      userURL
    );
    return githubResult;
  }
  private mapFrom(repository: OriginGitHubRepository): GitHubRepository {
    return {
      id: repository.id,
      name: repository.name,
      fullName: repository.full_name,
      owner: {
        login: repository.owner.login,
        url: repository.owner.url,
        bio: undefined,
      },
      stargazersCount: repository.stargazers_count,
      htmlURL: repository.html_url,
      commitsURL: repository.commits_url,
      forksURL: repository.forks_url,
    };
  }
}
