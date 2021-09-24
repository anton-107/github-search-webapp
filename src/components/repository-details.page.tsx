import React from "react";
import { Link } from "react-router-dom";
import { GitHubClient, GitHubCommit, GitHubFork } from "../github-client/interfaces";

interface RepositoryDetailsPageProps {
  owner: string;
  name: string;
  githubClient: GitHubClient;
}

interface RepositoryDetailsPageState {
  mostRecentCommits: GitHubCommit[];
  mostRecentForks: GitHubFork[];
  mostRecentForkAuthorBio: string | null;
}

export class RepositoryDetailsPage extends React.Component<RepositoryDetailsPageProps, RepositoryDetailsPageState> {
  constructor(props: RepositoryDetailsPageProps) {
    super(props);
    this.state = {mostRecentCommits: [], mostRecentForks: [], mostRecentForkAuthorBio: null};
  }

  public componentDidMount() {
    this.loadRepositoryDetails();
  }

  public render() {
    return (
      <div>
        <Link to="/">← Back to search</Link>
        <h3>{this.props.owner}/{this.props.name}</h3>
        <p>Last 3 commits by: {this.getUniqueAuthorsOfLastCommits()}</p>
        <p>Last fork created by: {this.getLastForkUserLogin()}</p>
        <p>The owner of the last fork has this in their biography: {this.state.mostRecentForkAuthorBio || '<Their BIO is empty>'}</p>
      </div>
    );
  }

  private async loadRepositoryDetails() {
    const repository = await this.props.githubClient.getRepository(this.props.owner, this.props.name);
    this.loadLastCommits(repository.commitsURL);
    this.loadLastForks(repository.forksURL);
  }

  private async loadLastCommits(commitsURL: string) {
    const commits = await this.props.githubClient.getCommits(commitsURL);
    this.setState({mostRecentCommits: commits});
  }

  private async loadLastForks(forksURL: string) {
    const forks = await this.props.githubClient.getForks(forksURL);
    this.setState({mostRecentForks: forks});

    const lastForkCreatorURL = forks.find(x => x.ownerLogin)?.ownerURL;
    if (lastForkCreatorURL) {
      this.loadLastForkCreator(lastForkCreatorURL);
    }
  }

  private async loadLastForkCreator(userURL: string) {
    const user = await this.props.githubClient.getUser(userURL);
    this.setState({mostRecentForkAuthorBio: user.bio || null});
  }

  private getUniqueAuthorsOfLastCommits(): string {
    return [...new Set(this.state.mostRecentCommits.slice(0,3).map(x => x.authorLogin).filter(x => x)).values()].join(',');
  }
  private getLastForkUserLogin(): string | undefined {
    return this.state.mostRecentForks.find(x => x.ownerLogin)?.ownerLogin;
  }
}