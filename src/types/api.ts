export interface ApiMeta {
  requestId: string;
  correlationId?: string;
  timestamp: string;
}

export interface ApiResponse<Data> {
  success: true;
  meta: ApiMeta;
  data: Data;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiErrorDetails {
  [field: string]: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    messageKey?: string;
    message?: string;
    details?: ApiErrorDetails;
  };
  statusCode: number;
  path?: string;
  timestamp?: string;
  requestId?: string;
}
