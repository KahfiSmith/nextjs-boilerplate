export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  meta?: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
  success: boolean;
}
