import React from "react";
import { GitHubClient, GitHubRepository } from "../github-client/interfaces";
import { NavigationButtonsComponent, Pagination } from "./navigation-buttons.components";
import { SearchBarComponent } from "./search-bar.component";
import { SearchResultsComponent } from "./search-results.component ";

interface MainPageProps {
  githubClient: GitHubClient;
}
interface MainPageState {
  repositories: GitHubRepository[];
  currentSearchTerm: string;
  pagination: Pagination;
}

export class MainPage extends React.Component<MainPageProps, MainPageState> {
  private initialSearchTerm: string;

  constructor(props: MainPageProps) {
    super(props);
    const initialPagination = { currentPage: 1 };
    this.initialSearchTerm = localStorage.getItem('searchTerm') || '';
    this.state = { repositories: [], currentSearchTerm: this.initialSearchTerm, pagination: initialPagination };
  }
  componentDidMount() {
    if(this.initialSearchTerm) {
      this.changeSearchTerm(this.initialSearchTerm);
    }
  }
  public render() {
    return (
      <div>
        <div className="box">
          <div className="columns">
            <div className="column"><SearchBarComponent initialValue={this.initialSearchTerm} onNewSearch={(searchTerm) => this.changeSearchTerm(searchTerm)} /></div>
            <div className="column is-one-fifth"><NavigationButtonsComponent pagination={{...this.state.pagination}} onMoveBackward={() => this.showPreviousPage()} onMoveForward={() => this.showNextPage()} /></div>
          </div>
        </div>
        <div><SearchResultsComponent repositories={this.state.repositories} /></div>
      </div>
    );
  }
  private async changeSearchTerm(searchTerm: string) {
    this.setState({currentSearchTerm: searchTerm}, this.loadSearchResults);
    localStorage.setItem('searchTerm', searchTerm);
  }
  private showPreviousPage() {
    this.setState(state => { return {...state, pagination: { ...state.pagination, currentPage: Math.max(1, state.pagination.currentPage - 1)} }}, () => this.loadSearchResults())
  }
  private showNextPage() {
    this.setState(state => { return {...state, pagination: { ...state.pagination, currentPage: state.pagination.currentPage + 1}} }, () => this.loadSearchResults());
  }
  private async loadSearchResults() {
    console.log('loadSearchResults', this.state);
    const repositories = await this.props.githubClient.searchRepositories(this.state.currentSearchTerm, this.state.pagination.currentPage);
    console.log("response 4", repositories);
    this.setState(state => { return {...state, repositories: repositories.items, pagination: {...state.pagination, currentResultsTotal: repositories.totalCount, currentResultsPerPage: repositories.resultsPerPage}}});
  }
}