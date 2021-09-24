import React from "react";

interface SearchBarComponentProps {
  onNewSearch: (searchTerm: string) => void;
}

export class SearchBarComponent extends React.Component<SearchBarComponentProps> {
  private searchInput = React.createRef<HTMLInputElement>();

  public render() {
    return (
      <div>
        <form onSubmit={(e) => { e.preventDefault(); this.triggerSearch();}}>
          <input type="text" placeholder="Start typing a repository name here" ref={this.searchInput} />
        </form>
      </div>
    );
  }
  private triggerSearch() {
    const searchTerm = this.searchInput.current?.value;
    if (searchTerm && searchTerm.length > 1) {
      this.props.onNewSearch(searchTerm);
    }
  }
}