/**
 * Pagination utility for consistent list endpoint responses
 */

export interface PaginationParams {
  limit: number;
  offset: number;
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

/**
 * Extract and validate pagination params from query
 * @param limit - Items per page (max 100)
 * @param offset - Starting index
 * @returns Normalized pagination params
 */
export const getPaginationParams = (
  limit?: string | number,
  offset?: string | number
): PaginationParams => {
  let pageSize = DEFAULT_PAGE_SIZE;
  let pageOffset = 0;

  if (limit) {
    pageSize = Math.min(Number(limit), MAX_PAGE_SIZE);
    pageSize = Math.max(pageSize, 1);
  }

  if (offset) {
    pageOffset = Math.max(Number(offset), 0);
  }

  const page = Math.floor(pageOffset / pageSize) + 1;

  return {
    limit: pageSize,
    offset: pageOffset,
    page,
    pageSize,
  };
};

/**
 * Format list response with pagination metadata
 * @param data - Array of items
 * @param total - Total count of items
 * @param pagination - Pagination params
 * @returns Formatted paginated response
 */
export const formatPaginatedResponse = <T>(
  data: T[],
  total: number,
  pagination: PaginationParams
): PaginatedResponse<T> => {
  const totalPages = Math.ceil(total / pagination.pageSize);
  const hasNextPage = pagination.offset + pagination.limit < total;

  return {
    data,
    pagination: {
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages,
      hasNextPage,
    },
  };
};

export default {
  getPaginationParams,
  formatPaginatedResponse,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
};
