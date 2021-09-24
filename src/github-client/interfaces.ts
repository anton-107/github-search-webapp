interface GitHubUser {
  login: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  owner: GitHubUser;
  stargazersCount: number;
  htmlURL: string;
}

export interface GitHubSearchResult {
  totalCount: number;
  items: GitHubRepository[];
}

export interface GitHubClient {
  searchRepositories(): Promise<GitHubSearchResult>;
}