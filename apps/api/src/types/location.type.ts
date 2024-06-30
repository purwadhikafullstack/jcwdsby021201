export type LocationQuery = {
  page?: number;
  limit?: number;
  filter?: string;
  sortBy?: string;
  orderBy?: string;
};

export type LocationQueryRequired = {
  page: number;
  limit: number;
  filter: string;
  sortBy: string;
  orderBy: string;
};
