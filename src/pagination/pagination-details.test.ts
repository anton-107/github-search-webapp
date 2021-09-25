import {PaginatonDetails} from './pagination-details';

describe('PaginatonDetails', () => {
  test('should show first page', () => {
    const pagination = new PaginatonDetails({
      currentPage: 1,
      currentResultsTotal: 8,
      currentResultsPerPage: 10
    });

    expect(pagination.firstDisplayedItem).toBe(1);
    expect(pagination.lastDisplayedItem).toBe(8);
    expect(pagination.hasNextPage).toBe(false);
    expect(pagination.hasPreviousPage).toBe(false);
  });
  test('should show last page', () => {
    const pagination = new PaginatonDetails({
      currentPage: 2,
      currentResultsTotal: 18,
      currentResultsPerPage: 10
    });

    expect(pagination.firstDisplayedItem).toBe(11);
    expect(pagination.lastDisplayedItem).toBe(18);
    expect(pagination.hasNextPage).toBe(false);
    expect(pagination.hasPreviousPage).toBe(true);
  });
  test('should show middle page', () => {
    const pagination = new PaginatonDetails({
      currentPage: 6,
      currentResultsTotal: 1845,
      currentResultsPerPage: 30
    });

    expect(pagination.firstDisplayedItem).toBe(151);
    expect(pagination.lastDisplayedItem).toBe(180);
    expect(pagination.hasNextPage).toBe(true);
    expect(pagination.hasPreviousPage).toBe(true);
  });
  test('should throw errors if not fully initialized', () => {
    const pagination = new PaginatonDetails({ currentPage: 1 });
    expect(() => pagination.firstDisplayedItem).toThrowError();
    expect(() => pagination.lastDisplayedItem).toThrowError();
  });
});