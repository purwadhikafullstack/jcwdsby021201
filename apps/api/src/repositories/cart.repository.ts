import { Prisma } from '@prisma/client';
import prisma from '@/prisma';
import {
  AddToCartBody,
  DeleteProductCart,
  UpdateBody,
} from '@/types/cart.type';

export class CartRepository {
  static async addProductToCart(id: number, body: AddToCartBody) {
    const { productId, quantity } = body;

    let activeCart = await prisma.cart.findFirst({
      where: {
        userId: id,
        isActive: true,
      },
    });

    if (!activeCart) {
      activeCart = await prisma.cart.create({
        data: { userId: id, isActive: true },
      });
    }

    //periksa keranjang untuk produk apakah sudah ada?
    const checkCart = await prisma.productCart.findFirst({
      where: {
        cartId: activeCart.id,
        productId,
      },
    });

    if (checkCart) {
      await prisma.productCart.update({
        where: {
          id: checkCart.id,
          productId: productId,
        },
        data: { quantity: checkCart.quantity + quantity },
      });
    } else {
      return await prisma.productCart.create({
        data: {
          cartId: activeCart.id,
          productId,
          quantity,
        },
      });
    }
  }

  static async getCartCount(id: number) {
    return await prisma.productCart.count({
      where: {
        cart: {
          userId: id,
          isActive: true,
        },
      },
    });
  }

  static async getProductCart(id: number) {
    return await prisma.cart.findMany({
      where: {
        userId: id,
        isActive: true,
      },
      select: {
        productCarts: {
          include: {
            Product: {
              select: {
                id: true,
                description: true,
                price: true,
                name: true,
                pictures: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
  }

  static async deleteProductCart(id: number, productId: number) {
    return await prisma.productCart.deleteMany({
      where: {
        productId: productId,
        cart: {
          userId: id,
          isActive: true,
        },
      },
    });
  }

  static async updateQuantity(id: number, body: UpdateBody) {
    const { productId, quantity } = body;

    return await prisma.productCart.updateMany({
      where: {
        productId,
        cart: {
          userId: id,
          isActive: true,
        },
      },
      data: {
        quantity: quantity,
      },
    });
  }
}
