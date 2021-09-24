export interface GitHubUser {
  login: string;
  url: string;
  bio: string | null | undefined;
}

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  owner: GitHubUser;
  stargazersCount: number;
  htmlURL: string;
  commitsURL: string;
  forksURL: string;
}

export interface GitHubSearchResult {
  totalCount: number;
  resultsPerPage: number;
  items: GitHubRepository[];
}

export interface GitHubCommit {
  authorLogin: string;
}
export interface GitHubFork {
  ownerLogin: string;
  ownerURL: string;
}

export interface GitHubClient {
  searchRepositories(query: string, page: number): Promise<GitHubSearchResult>;
  getRepository(owner: string, name: string): Promise<GitHubRepository>;
  getCommits(commitsURL: string): Promise<GitHubCommit[]>;
  getForks(forksURL: string): Promise<GitHubFork[]>;
  getUser(userURL: string): Promise<GitHubUser>;
}