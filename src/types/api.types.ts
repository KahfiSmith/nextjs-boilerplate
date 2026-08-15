export interface ApiResponse<T = unknown> {
  code?: string;
  data: T;
  error?: unknown;
  message: string;
  success: boolean;
}
