export type CategoryResponse = {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoryBody = {
  name: string;
};

export interface CategoryUpdate extends CategoryBody {
  id: string;
}
