export type CategoryBody = {
  name: string;
};

export type CategoryResponse = CategoryBody & {
  id: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export interface CategoryUpdate extends CategoryBody {
  id: string;
}
