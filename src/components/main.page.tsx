import React from "react";
import { GitHubClient, GitHubRepository } from "../github-client/interfaces";
import { NavigationButtonsComponent, Pagination } from "./navigation-buttons.components";
import { SearchBarComponent } from "./search-bar.component";
import { SearchResultsComponent } from "./search-results.component";

interface MainPageProps {
  githubClient: GitHubClient;
}
interface MainPageState {
  repositories: Record<string, Record<number, GitHubRepository[]>>;
  currentSearchTerm: string;
  pagination: Pagination;
  isSearching: boolean;
  isAtLeastOneSearchDone: boolean;
  searchError: string | null;
}

export class MainPage extends React.Component<MainPageProps, MainPageState> {
  private initialSearchTerm: string;

  constructor(props: MainPageProps) {
    super(props);
    const initialPagination = { currentPage: 1 };
    this.initialSearchTerm = localStorage.getItem('searchTerm') || '';
    this.state = { repositories: {}, currentSearchTerm: this.initialSearchTerm, pagination: initialPagination, isSearching: false, isAtLeastOneSearchDone: false, searchError: null };
  }
  componentDidMount() {
    if(this.initialSearchTerm) {
      this.changeSearchTerm(this.initialSearchTerm);
    }
  }
  public render() {
    let repositories: GitHubRepository[] = [];
    if (this.state.repositories[this.state.currentSearchTerm] && this.state.repositories[this.state.currentSearchTerm][this.state.pagination.currentPage]) {
      repositories = this.state.repositories[this.state.currentSearchTerm][this.state.pagination.currentPage];
    }
    
    return (
      <div>
        <div className="box">
          <div className="columns">
            <div className="column"><SearchBarComponent initialValue={this.initialSearchTerm} onNewSearch={(searchTerm) => this.changeSearchTerm(searchTerm)} /></div>
            <div className="column is-one-fifth"><NavigationButtonsComponent pagination={{...this.state.pagination}} onMoveBackward={() => this.showPreviousPage()} onMoveForward={() => this.showNextPage()} /></div>
          </div>
        </div>
        <div><SearchResultsComponent isAtLeastOneSearchDone={this.state.isAtLeastOneSearchDone} repositories={repositories} isLoading={this.state.isSearching} searchError={this.state.searchError} onRetry={() => this.loadSearchResults()} /></div>
      </div>
    );
  }
  private async changeSearchTerm(searchTerm: string) {
    this.setState({currentSearchTerm: searchTerm, pagination: {currentPage: 1, currentResultsTotal: undefined, currentResultsPerPage: undefined}}, this.loadSearchResults);
    localStorage.setItem('searchTerm', searchTerm);
  }
  private showPreviousPage() {
    this.setState(state => { return {...state, pagination: { ...state.pagination, currentPage: Math.max(1, state.pagination.currentPage - 1)} }}, () => this.loadSearchResults())
  }
  private showNextPage() {
    this.setState(state => { return {...state, pagination: { ...state.pagination, currentPage: state.pagination.currentPage + 1}} }, () => this.loadSearchResults());
  }
  private async loadSearchResults() {
    this.setState({isSearching: true});
    try {
      const searchTerm = this.state.currentSearchTerm;
      const currentPage = this.state.pagination.currentPage;
      const repositories = await this.props.githubClient.searchRepositories(searchTerm, currentPage);
      this.setState((state) => {
        const savedRepositories = {...state.repositories};
        if (!savedRepositories[searchTerm]) {
          savedRepositories[searchTerm] = {};
        }
        savedRepositories[searchTerm][currentPage] = repositories.items;
        return {
          ...state, isSearching: false, isAtLeastOneSearchDone: true, repositories: savedRepositories, searchError: null, pagination: {...state.pagination, currentResultsTotal: repositories.totalCount, currentResultsPerPage: repositories.resultsPerPage}}
        }
      );
    } catch (err) {
      console.log('Error loading: ', err);
      this.setState(state => { return {...state, isSearching: false, searchError: (err as Error).message, pagination: {...state.pagination, currentResultsTotal: undefined, currentResultsPerPage: undefined}}});
    }
  }
}