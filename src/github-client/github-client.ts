import { ResourceFetcher } from "../web-api/interfaces";
import { GitHubClient, GitHubSearchResult } from "./interfaces";

interface OriginGitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  stargazers_count: number;
  html_url: string;
}
interface OriginGitHubSearchResult {
  total_count: number;
  items: OriginGitHubRepository[];
}

export class GitHubClientImpl implements GitHubClient {
  constructor(private resourceFetcher: ResourceFetcher) {
  }
  public async searchRepositories(query: string): Promise<GitHubSearchResult> {
    
    const githubResults = await this.resourceFetcher.fetch<OriginGitHubSearchResult>(`https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`);
    const result = {
      totalCount: githubResults.total_count,
      items: githubResults.items.map(x => {
        return {
          id: x.id,
          name: x.name,
          fullName: x.full_name,
          owner: {
            login: x.owner.login,
          },
          stargazersCount: x.stargazers_count,
          htmlURL: x.html_url,
        }
      })
    };

    return result;
  }
}