/**
 * Standard JSON response wrapper used by all API endpoints
 */
export type JsonResponse<T> = {
  message: string;
  data: T;
  status: boolean;
};

/**
 * Pagination metadata for paginated responses
 */
export interface PaginationMetadata {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Cursor-based pagination metadata
 */
export interface CursorPaginationMetadata {
  nextCursor: string | null;
  hasMore: boolean;
  pageSize: number;
}

/**
 * Paginated response wrapper for list endpoints
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  pagination: CursorPaginationMetadata;
}
