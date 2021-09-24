interface GitHubUser {
  login: string;
}

interface GitHubRepository {
  id: number;
  fullName: string;
  owner: GitHubUser;
  stargazersCount: number;
}

export interface GitHubSearchResult {
  totalCount: number;
  items: GitHubRepository[];
}

export interface GitHubClient {
  searchRepositories(): Promise<GitHubSearchResult>;
}