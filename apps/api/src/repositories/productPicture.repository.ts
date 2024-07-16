import { Prisma } from '@prisma/client';
import prisma from '@/prisma';

export class ProductPictureRepository {
  static async createProductPicture(data: Prisma.ProductPictureCreateInput) {
    return await prisma.productPicture.create({ data });
  }

  static async findProductPictureById(id: number) {
    return await prisma.productPicture.findUnique({ where: { id } });
  }

  static async deleteProductPictureById(id: number) {
    return await prisma.productPicture.delete({ where: { id } });
  }
}
