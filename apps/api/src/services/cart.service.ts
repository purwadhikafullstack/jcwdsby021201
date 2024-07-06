import { CartRepository } from '@/repositories/cart.repository';
import {
  AddToCartBody,
  DeleteProductCart,
  ResponseStock,
  UpdateBody,
} from '@/types/cart.type';
import { responseWithData, responseWithoutData } from '@/utils/response';
import { CartValidation } from '@/validators/cart.validation';
import { Validation } from '@/validators/validation';
import { ProductService } from './product.service';

export class CartService {
  static async addProductToCart(id: number, body: AddToCartBody) {
    const newBody = Validation.validate(CartValidation.ADD_TO_CART_BODY, body);
    const { productId, quantity } = newBody;
    const stockResponse = (await ProductService.getStock(
      productId,
    )) as ResponseStock;

    const availableStock = stockResponse.result.stock;

    if (availableStock < quantity) {
      return responseWithoutData(400, false, 'Insufficient stock');
    }

    const response = await CartRepository.addProductToCart(id, newBody);

    return responseWithData(200, 'Success add Product to cart!', {
      quantity: response?.quantity,
      productId: response?.productId,
      cartId: response?.cartId,
    });
  }

  static async getCartCount(id: number) {
    const response = await CartRepository.getCartCount(id);
    return responseWithData(200, 'Success get count cart', {
      count: response,
    });
  }

  static async getProductCart(id: number) {
    const response = await CartRepository.getProductCart(id);
    const newResponse = response[0].productCarts.map((item:any) => ({
      id: item.id,
      quantity: item.quantity,
      productId: item.productId,
      cartId: item.cartId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      description: item.Product.description,
      price: item.Product.price,
      name: item.Product.name,
      image: item.Product.pictures[0].url,
    }));
    return responseWithData(200, 'Success getProduct for Cart', newResponse);
  }

  static async deleteProductCart(id: number, productId: number) {
    const newBody = Validation.validate(
      CartValidation.DELETE_CART_BODY,
      productId,
    );
    const response = await CartRepository.deleteProductCart(id, newBody);
    return responseWithoutData(200, true, 'Success delete product in cart!');
  }

  static async updateQuantity(id: number, body: UpdateBody) {
    const newBody = Validation.validate(CartValidation.UPDATE_BODY, body);
    const { productId, quantity } = newBody;
    const stockResponse = (await ProductService.getStock(
      productId,
    )) as ResponseStock;

    const availableStock = stockResponse.result.stock;

    if (availableStock < quantity) {
      return responseWithoutData(400, false, 'Insufficient stock');
    }
    const response = await CartRepository.updateQuantity(id, newBody);
    if (response.count === 0) {
      return responseWithoutData(401, false, 'Product doesnt exist in Cart!');
    }
    return responseWithoutData(201, true, 'Success update Cart');
  }
}
