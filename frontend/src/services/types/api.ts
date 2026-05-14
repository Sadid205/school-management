// Generic API Response
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

// Pagination Response
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Error Response
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

// Auth Response
export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token?: string;
}
