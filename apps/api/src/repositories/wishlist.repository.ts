import { Prisma } from '@prisma/client';
import prisma from '@/prisma';
import { WishlistBody } from '@/types/wishlist.type';

export class WishlistRepository {
  static async AddToWishlist(id: number, body: WishlistBody) {
    const { productId } = body;
    const existingWishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId: id,
        productId: productId,
      },
    });

    if (existingWishlistItem) {
      throw new Error('The product is already on your wishlist');
    } else {
      return await prisma.wishlist.create({
        data: { userId: id, productId },
      });
    }
  }

  static async removeWishlist(id: number, body: WishlistBody) {
    const { productId } = body;
    const existingWishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId: id,
        productId: Number(productId),
      },
    });
    if (!existingWishlistItem) {
      throw new Error('The product is not on your wishlist');
    } else {
      return await prisma.wishlist.deleteMany({
        where: {
          userId: id,
          productId,
        },
      });
    }
  }

  static async myWishlist(id: number) {
    return await prisma.wishlist.findMany({
      where: {
        userId: id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            pictures: {
              select: {
                url: true,
              },
              take: 1,
            },
          },
        },
      },
    });
  }

  static async getWishlistCount(id: number) {
    return await prisma.wishlist.count({
      where: {
        userId: id,
      },
    });
  }
}
