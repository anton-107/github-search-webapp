import React from "react";

interface SearchBarComponentProps {
  initialValue: string;
  onNewSearch: (searchTerm: string) => void;
}

export class SearchBarComponent extends React.Component<SearchBarComponentProps> {
  private searchInput = React.createRef<HTMLInputElement>();

  public componentDidMount() {
    if (this.searchInput.current) {
      this.searchInput.current.value = this.props.initialValue;
      this.searchInput.current.focus();
    }
  }

  public render() {
    return (
      <div>
        <form onSubmit={(e) => { e.preventDefault(); this.triggerSearch();}}>
          <input className="input is-primary is-large" type="text" placeholder="Start typing a repository name here" ref={this.searchInput} />
          <p>Type in your search string and hit [ENTER ⏎]</p>
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