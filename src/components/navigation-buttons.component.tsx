import React from "react";
import { Pagination, PaginatonDetails } from "../pagination/pagination-details";

interface NavigationButtonsComponentProps {
  pagination: Pagination;
  onMoveForward: () => void;
  onMoveBackward: () => void;
}

export class NavigationButtonsComponent extends React.Component<NavigationButtonsComponentProps> {
  public render() {
    const paginationDetails = new PaginatonDetails(this.props.pagination);
    let paginationLine = <span></span>;
    if (
      paginationDetails.isIntialized &&
      this.props.pagination.currentResultsTotal &&
      this.props.pagination.currentResultsTotal > 0
    ) {
      paginationLine = (
        <small>
          Showing {paginationDetails.firstDisplayedItem}-
          {paginationDetails.lastDisplayedItem} of{" "}
          {this.props.pagination.currentResultsTotal}{" "}
          {this.props.pagination.currentResultsTotal === 1
            ? "repository"
            : "repositories"}
        </small>
      );
    }

    return (
      <div>
        <div className="columns">
          <div className="column">
            <button
              className="button is-fullwidth"
              onClick={() => this.props.onMoveBackward()}
              style={{
                visibility: paginationDetails.hasPreviousPage
                  ? "visible"
                  : "hidden",
              }}
            >
              Backward
            </button>
          </div>
          <div className="column">
            <button
              className="button is-primary is-fullwidth"
              onClick={() => this.props.onMoveForward()}
              style={{
                visibility: paginationDetails.hasNextPage
                  ? "visible"
                  : "hidden",
              }}
            >
              Forward
            </button>
          </div>
        </div>
        {paginationLine}
      </div>
    );
  }
}
