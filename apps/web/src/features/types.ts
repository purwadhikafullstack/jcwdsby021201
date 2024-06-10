export type ResponseWithData<T = any> = {
  rc: number;
  success: boolean;
  message: string;
  result: T;
};

export type ResponseWithoutData = {
  rc: number;
  success: boolean;
  message: string;
};

export type ResponseDataPagination<T = any> = {
  rc: number;
  success: boolean;
  message: string;
  result: T;
  pagination: { page: number; limit: number; total: number };
};

export type Pagination = {
  page?: string | number;
  limit?: string | number;
  sort_by?: string;
  order_by?: string;
};
