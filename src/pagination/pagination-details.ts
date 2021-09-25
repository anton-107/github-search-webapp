export interface Pagination {
  currentPage: number;
  currentResultsTotal?: number;
  currentResultsPerPage?: number;
}
export class PaginatonDetails {
  constructor(private pagination: Pagination) {}
  public get isIntialized(): boolean {
    return this.pagination.currentResultsTotal !== undefined && this.pagination.currentResultsPerPage !== undefined;
  }
  public get firstDisplayedItem(): number {
    if (this.pagination.currentResultsPerPage === undefined) {
      throw Error('Pagination is not initialized');
    }
    return 1 + (this.pagination.currentPage - 1) * (this.pagination.currentResultsPerPage);
  }
  public get lastDisplayedItem(): number {
    if (this.pagination.currentResultsPerPage === undefined || this.pagination.currentResultsTotal === undefined) {
      throw Error('Pagination is not initialized');
    }
    return Math.min(this.pagination.currentPage * this.pagination.currentResultsPerPage, this.pagination.currentResultsTotal);
  }
  public get hasPreviousPage(): boolean {
    if (!this.isIntialized) {
      return false;
    }
    if (this.firstDisplayedItem > 1) {
      return true;
    }
    return false;
  }
  public get hasNextPage(): boolean {
    if (!this.isIntialized || this.pagination.currentResultsTotal === undefined) {
      return false;
    }
    if (this.lastDisplayedItem < this.pagination.currentResultsTotal) {
      return true;
    }
    return false;
  }
}