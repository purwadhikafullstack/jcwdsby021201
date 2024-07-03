export type CartCount = {
  count: number;
};

export type AddToCartBody = {
  quantity: number;
  productId: number;
};

export type CartProduct = {
  token: string;
  data: AddToCartBody;
};

export type DeleteProduct = {
  token: string;
  productId: number;
};

export type ProductBody = {
  id: number;
  quantity: number;
  productId: number;
  cartId: number;
  description: string;
  price: number;
  name: string;
  image: string;
};
