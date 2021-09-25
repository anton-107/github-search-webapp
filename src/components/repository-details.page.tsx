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
  isRepositoryLoading: boolean;
  isLastCommitInfoLoading: boolean;
  isLastForkInfoLoading: boolean;
  isLastForkAuthorInfoLoading: boolean;
}

export class RepositoryDetailsPage extends React.Component<RepositoryDetailsPageProps, RepositoryDetailsPageState> {
  constructor(props: RepositoryDetailsPageProps) {
    super(props);
    this.state = {
      mostRecentCommits: [], mostRecentForks: [], mostRecentForkAuthorBio: null,
      isRepositoryLoading: false,
      isLastCommitInfoLoading: false,
      isLastForkInfoLoading: false,
      isLastForkAuthorInfoLoading: false,
    };
  }

  public componentDidMount() {
    this.loadRepositoryDetails();
  }

  public render() {
    const isLoading = this.state.isRepositoryLoading || this.state.isLastCommitInfoLoading || this.state.isLastForkInfoLoading || this.state.isLastForkAuthorInfoLoading;
    return (
      <div>
        <div className="columns">
          <div className="column is-one-fifth">
            <Link to="/" className="button">← Back to search</Link>
          </div>
          <div className="column">
            <div className="box">
            <progress className="progress is-small is-info" max="100" style={{visibility: isLoading ? 'visible' : 'hidden'}}></progress>
              <div className="content">
                <h3>{this.props.owner}/{this.props.name}</h3>
                <p>Last 3 commits by: {this.state.isLastCommitInfoLoading && 'Loading...'} {this.getUniqueAuthorsOfLastCommits()}</p>
                <p>Last fork created by: {this.state.isLastForkInfoLoading && 'Loading...'} {this.getLastForkUserLogin()}</p>
                <p>The owner of the last fork has this in their biography: {this.state.isLastForkAuthorInfoLoading && 'Loading...'} {!isLoading && (this.state.mostRecentForkAuthorBio || '<Their BIO is empty>')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private async loadRepositoryDetails() {
    this.setState({isRepositoryLoading: true});
    const repository = await this.props.githubClient.getRepository(this.props.owner, this.props.name);
    this.setState({isRepositoryLoading: false});
    this.loadLastCommits(repository.commitsURL);
    this.loadLastForks(repository.forksURL);
  }

  private async loadLastCommits(commitsURL: string) {
    this.setState({isLastCommitInfoLoading: true});
    const commits = await this.props.githubClient.getCommits(commitsURL);
    this.setState({mostRecentCommits: commits, isLastCommitInfoLoading: false});
  }

  private async loadLastForks(forksURL: string) {
    this.setState({isLastForkInfoLoading: true});
    const forks = await this.props.githubClient.getForks(forksURL);
    this.setState({mostRecentForks: forks, isLastForkInfoLoading: false});

    const lastForkCreatorURL = forks.find(x => x.ownerLogin)?.ownerURL;
    if (lastForkCreatorURL) {
      this.loadLastForkAuthor(lastForkCreatorURL);
    }
  }

  private async loadLastForkAuthor(userURL: string) {
    this.setState({isLastForkAuthorInfoLoading: true});
    const user = await this.props.githubClient.getUser(userURL);
    this.setState({mostRecentForkAuthorBio: user.bio || null, isLastForkAuthorInfoLoading: false});
  }

  private getUniqueAuthorsOfLastCommits(): string {
    return [...new Set(this.state.mostRecentCommits.slice(0,3).map(x => x.authorLogin).filter(x => x)).values()].join(',');
  }
  private getLastForkUserLogin(): string | undefined {
    return this.state.mostRecentForks.find(x => x.ownerLogin)?.ownerLogin;
  }
}