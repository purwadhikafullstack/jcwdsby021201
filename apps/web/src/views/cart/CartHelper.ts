import { ProductBody } from '@/features/user/cart/type';

export const isStockInsufficient = (
  product: ProductBody[],
  productStocks: { [key: number]: number },
) => {
  let insufficientStock = false;
  let errorMsg = 'Insufficient stock for: ';
  product.forEach((item) => {
    const availableStock = productStocks[item.productId] || 0;
    if (item.quantity > availableStock) {
      insufficientStock = true;
      errorMsg += `${item.name}, `;
    }
  });
  return { insufficientStock, errorMsg };
};
