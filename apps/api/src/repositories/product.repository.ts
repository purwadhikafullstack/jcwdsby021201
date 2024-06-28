import { Prisma } from '@prisma/client';
import prisma from '@/prisma';

export class ProductRepository {
  static async findProductByName(name: string) {
    return await prisma.product.findUnique({
      where: { name },
      include: {
        category: { select: { id: true, name: true } },
        pictures: { select: { id: true, url: true, name: true } },
      },
    });
  }

  static async createProduct(data: Prisma.ProductCreateInput) {
    return await prisma.product.create({ data });
  }

  static async getProducts(
    page: number,
    limit: number,
    filter: string | number,
    sortBy: string,
    orderBy: string,
  ) {
    const whereClause: any = {};
    if (typeof filter === 'string' && filter.trim() !== '') {
      whereClause.OR = [
        { name: { contains: filter } },
        { description: { contains: filter } },
        { category: { name: { contains: filter } } },
      ];
    } else if (typeof filter === 'number') {
      whereClause.OR = [{ price: { gte: filter } }];
    }

    return await prisma.product.findMany({
      where: Object.keys(whereClause).length ? whereClause : undefined,
      include: {
        category: { select: { id: true, name: true } },
        pictures: { select: { id: true, url: true, name: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: orderBy },
    });
  }

  static async countProducts(filter: string | number) {
    const whereClause: any = {};

    if (typeof filter === 'string' && filter.trim() !== '') {
      whereClause.OR = [
        { name: { contains: filter } },
        { description: { contains: filter } },
        { category: { name: { contains: filter } } },
      ];
    } else if (typeof filter === 'number') {
      whereClause.OR = [{ price: { gte: filter } }];
    }

    return await prisma.product.count({ where: whereClause });
  }

  static async findProductById(id: number) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        pictures: { select: { id: true, url: true, name: true } },
      },
    });
  }

  static async deleteProductById(id: number) {
    await prisma.product.delete({ where: { id } });
  }

  static async updateProductById(id: number, data: Prisma.ProductUpdateInput) {
    await prisma.product.update({ where: { id }, data });
  }
}
