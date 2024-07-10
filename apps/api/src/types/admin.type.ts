export type UserBody = {
  username: string;
  email: string;
  password: string;
};

export type UserQuery = {
  page?: number;
  limit?: number;
  filter?: string;
  sortBy?: string;
  orderBy?: string;
  role?: 'ADMIN' | 'USER';
};
