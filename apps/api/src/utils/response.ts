export const responseWithData = (
  status: number,
  message: string,
  data: object | Array<any>,
) => {
  return { rc: status, success: true, message, result: data };
};

export const responseWithoutData = (
  status: number,
  isSuccess: boolean,
  message: string,
) => {
  return { rc: status, success: isSuccess, message };
};

export const responseDataWithPagination = (
  status: number,
  message: string,
  data: object | Array<any>,
  { page, limit, total }: { page: number; limit: number; total: number },
) => {
  return {
    rc: status,
    success: true,
    message,
    result: data,
    pagination: { page, limit, total },
  };
};
