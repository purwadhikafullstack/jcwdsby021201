import { Prisma } from '@prisma/client';
import prisma from '@/prisma';

export class CategoryRepository {
  static async findCategoryByName(name: string) {
    return await prisma.category.findUnique({ where: { name } });
  }

  static async createCategory(data: Prisma.CategoryCreateInput) {
    return await prisma.category.create({ data });
  }

  static async getCategories(
    page: number,
    limit: number,
    filter: string,
    sortBy: string,
    orderBy: string,
  ) {
    return await prisma.category.findMany({
      where: {
        OR: [{ name: { contains: filter } }, { slug: { contains: filter } }],
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: orderBy },
    });
  }

  static async countCategories(filter: string) {
    return await prisma.category.count({
      where: {
        OR: [{ name: { contains: filter } }, { slug: { contains: filter } }],
      },
    });
  }

  static async findCategoryById(id: number) {
    return await prisma.category.findUnique({ where: { id } });
  }

  static async updateCategoryById(
    id: number,
    data: Prisma.CategoryUpdateInput,
  ) {
    return await prisma.category.update({ where: { id }, data });
  }

  static async deleteCategoryById(id: number) {
    return await prisma.category.delete({ where: { id } });
  }
}
