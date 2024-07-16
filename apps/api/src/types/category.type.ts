export type CategoryBody = {
  name: string;
};

export type CategoryQuery = {
  page?: number;
  limit?: number;
  filter?: string;
  sortBy?: string;
  orderBy?: string;
};
