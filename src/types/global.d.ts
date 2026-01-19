// global에서 공통으로 사용하는 타입 정의

declare global {
  interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp: string;
  }

  interface PaginatedApiResponse<T = unknown> extends ApiResponse<T[]> {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
}

export {};
