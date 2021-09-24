import React from "react";
import { GitHubClient, GitHubRepository } from "../github-client/interfaces";
import { NavigationButtonsComponent } from "./navigation-buttons.components";
import { SearchBarComponent } from "./search-bar.component";
import { SearchResultsComponent } from "./search-results.component ";

interface MainPageProps {
  githubClient: GitHubClient;
}
interface MainPageState {
  repositories: GitHubRepository[];
}

export class MainPage extends React.Component<MainPageProps, MainPageState> {
  constructor(props: MainPageProps) {
    super(props);
    this.state = { repositories: [] };
  }
  public componentDidMount() {
    this.loadRepositories();
  }
  public render() {
    return (
      <div>
        <div><SearchBarComponent /></div>
        <div><NavigationButtonsComponent /></div>
        <div><SearchResultsComponent repositories={this.state.repositories} /></div>
      </div>
    )
  }
  private async loadRepositories() {
      const repositories = await this.props.githubClient.searchRepositories();
      console.log("response 3", repositories);
      this.setState({repositories: repositories.items});
  }
}