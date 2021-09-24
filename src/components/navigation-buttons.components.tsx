import React from "react";

export interface Pagination {
  currentPage: number;
  currentResultsTotal?: number;
  currentResultsPerPage?: number;
}

interface NavigationButtonsComponentProps {
  pagination: Pagination;
  onMoveForward: () => void;
  onMoveBackward: () => void;
}

class PaginatonDetails {
  constructor(private pagination: Pagination) {}
  public get isIntialized() {
    return this.pagination.currentResultsTotal !== undefined && this.pagination.currentResultsPerPage !== undefined;
  }
  public get firstDisplayedItem() {
    if (this.pagination.currentResultsPerPage === undefined) {
      throw Error('Pagination is not initialized');
    }
    return 1 + (this.pagination.currentPage - 1) * (this.pagination.currentResultsPerPage);
  }
  public get lastDisplayedItem() {
    if (this.pagination.currentResultsPerPage === undefined || this.pagination.currentResultsTotal === undefined) {
      throw Error('Pagination is not initialized');
    }
    return Math.min(this.pagination.currentPage * this.pagination.currentResultsPerPage, this.pagination.currentResultsTotal);
  }
  public get hasPreviousPage() {
    if (!this.isIntialized) {
      return false;
    }
    if (this.firstDisplayedItem > 1) {
      return true;
    }
  }
  public get hasNextPage() {
    if (!this.isIntialized) {
      return false;
    }
    if (this.pagination.currentResultsTotal === undefined) {
      throw Error('Pagination is not initialized');
    }
    if (this.lastDisplayedItem < this.pagination.currentResultsTotal) {
      return true;
    }
  }
}

export class NavigationButtonsComponent extends React.Component<NavigationButtonsComponentProps> {
  public render() {
    const paginationDetails = new PaginatonDetails(this.props.pagination);
    let paginationLine = (<span></span>);
    if (paginationDetails.isIntialized) {
      paginationLine = (
        <small>
          Showing {paginationDetails.firstDisplayedItem}-{paginationDetails.lastDisplayedItem} of {this.props.pagination.currentResultsTotal} {this.props.pagination.currentResultsTotal === 1 ? 'repository' : 'repositories'}
        </small>
      );
    }

    return (
      <div>
        <div className="columns">
          <div className="column">
            <button className="button is-fullwidth" onClick={() => this.props.onMoveBackward()} style={{visibility: paginationDetails.hasPreviousPage ? 'visible' : 'hidden'}}>Back</button>
          </div>
          <div className="column">
            <button className="button is-primary is-fullwidth" onClick={() => this.props.onMoveForward()} style={{visibility: paginationDetails.hasNextPage  ? 'visible' : 'hidden'}}>Forward</button>
          </div>
        </div>
        {paginationLine}
      </div>
    );
  }
}