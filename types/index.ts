/**
 * Shared TypeScript interfaces for the Fashion Inventory Forecast platform.
 */

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

export * from "./domain";
