import React, { ReactNode } from "react";

interface SearchBarComponentProps {
  initialValue: string;
  onNewSearch: (searchTerm: string) => void;
}

export class SearchBarComponent extends React.Component<SearchBarComponentProps> {
  private searchInput = React.createRef<HTMLInputElement>();

  public componentDidMount(): void {
    if (this.searchInput.current) {
      this.searchInput.current.value = this.props.initialValue;
      this.searchInput.current.focus();
    }
  }

  public render(): ReactNode {
    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.triggerSearch();
          }}
          data-testid="search-form"
        >
          <div className="field">
            <div className="control is-large is-not-loading">
              <input
                className="input is-primary is-large"
                type="text"
                placeholder="Start typing a repository name here"
                ref={this.searchInput}
              />
            </div>
            <p>Type in your search string and hit [ENTER ⏎]</p>
          </div>
        </form>
      </div>
    );
  }
  private triggerSearch() {
    const searchTerm = this.searchInput.current?.value;
    if (searchTerm && searchTerm.length >= 1) {
      this.props.onNewSearch(searchTerm);
    }
  }
}
