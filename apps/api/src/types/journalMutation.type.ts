export type JournalMutationQuery = {
  page?: number;
  limit?: number;
  filter?: number | string;
  sortBy?: string;
  orderBy?: string;
};

export type JournalMutationQueryRequired = {
  page: number;
  limit: number;
  filter: number | string;
  sortBy: string;
  orderBy: string;
};
