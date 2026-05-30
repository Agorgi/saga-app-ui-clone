import type { AxiosError } from 'axios';

/**
 * API error response structure from the backend
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  stack?: string;
}

/**
 * Typed API error that extends the standard Error
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly response?: ApiErrorResponse;
  public readonly isApiError = true;

  constructor(message: string, statusCode: number, response?: ApiErrorResponse) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Type guard to check if an error is an AxiosError
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isApiError' in error &&
    (error as ApiError).isApiError === true
  );
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  // Handle ApiError
  if (isApiError(error)) {
    return error.message;
  }

  // Handle AxiosError
  if (isAxiosError(error)) {
    const response = error.response?.data as ApiErrorResponse | undefined;
    return response?.error || response?.message || error.message || 'An unexpected error occurred';
  }

  // Handle standard Error
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Fallback for unknown error types
  return 'An unexpected error occurred';
}

/**
 * Convert an unknown error to an ApiError
 */
export function toApiError(error: unknown): ApiError {
  // Already an ApiError
  if (isApiError(error)) {
    return error;
  }

  // Convert AxiosError to ApiError
  if (isAxiosError(error)) {
    const statusCode = error.response?.status || 500;
    const response = error.response?.data as ApiErrorResponse | undefined;
    const message = getErrorMessage(error);
    return new ApiError(message, statusCode, response);
  }

  // Convert standard Error to ApiError
  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }

  // Convert string to ApiError
  if (typeof error === 'string') {
    return new ApiError(error, 500);
  }

  // Fallback for unknown error types
  return new ApiError('An unexpected error occurred', 500);
}

/**
 * Handle API errors in a try-catch block with proper typing
 *
 * @example
 * try {
 *   await someApiCall();
 * } catch (error) {
 *   const apiError = handleApiError(error);
 *   const message = handleApiError(error, (err) => err.message);
 * }
 */
export function handleApiError(error: unknown): ApiError;
export function handleApiError<T>(error: unknown, handler: (error: ApiError) => T): T;
export function handleApiError<T>(error: unknown, handler?: (error: ApiError) => T): ApiError | T {
  const apiError = toApiError(error);
  return handler ? handler(apiError) : apiError;
}
