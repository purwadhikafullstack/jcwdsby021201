import { WishlistRepository } from '@/repositories/wishlist.repository';
import { WishlistBody } from '@/types/wishlist.type';
import { responseWithData, responseWithoutData } from '@/utils/response';
import { Validation } from '@/validators/validation';
import { WishlistValidation } from '@/validators/wishlist.validation';

export class WishlistService {
  static async AddToWishlist(id: number, body: WishlistBody) {
    const newBody = Validation.validate(WishlistValidation.PRODUCT_ID, body);
    await WishlistRepository.AddToWishlist(id, newBody);
    return responseWithoutData(200, true, 'Success Add Product to Wishlist');
  }

  static async removeWishlist(id: number, body: WishlistBody) {
    const newBody = Validation.validate(WishlistValidation.PRODUCT_ID, body);

    await WishlistRepository.removeWishlist(id, newBody);
    return responseWithoutData(200, true, 'Success Remove Product to Wishlist');
  }

  static async myWishlist(id: number) {
    const response = await WishlistRepository.myWishlist(id);
    const mappedProducts = response.map((item: any) => ({
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      productName: item.product.name,
      productPrice: item.product.price,
      productImage: item.product.pictures[0]?.url || '',
    }));
    return responseWithData(200, 'Success Get My Wishlist', mappedProducts);
  }

  static async getWishlistCount(id: number) {
    const response = await WishlistRepository.getWishlistCount(id);
    return responseWithData(200, 'Success get count whislist', {
      count: response,
    });
  }
}
