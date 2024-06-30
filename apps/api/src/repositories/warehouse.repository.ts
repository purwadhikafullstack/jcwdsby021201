import { Prisma } from '@prisma/client';
import prisma from '@/prisma';

export class WarehouseRepository {
  static async createWarehouse(data: Prisma.WarehouseCreateInput) {
    await prisma.warehouse.create({ data });
  }

  static async getWarehouses(
    page: number,
    limit: number,
    filter: string,
    sortBy: string,
    orderBy: string,
  ) {
    return await prisma.warehouse.findMany({
      where: {
        OR: [
          { name: { contains: filter } },
          { address: { contains: filter } },
          { postalCode: { contains: filter } },
          { province: { name: { contains: filter } } },
          { city: { name: { contains: filter } } },
        ],
      },
      include: {
        province: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: orderBy },
    });
  }

  static async countWarehouses(filter: string) {
    return await prisma.warehouse.count({
      where: {
        OR: [
          { name: { contains: filter } },
          { address: { contains: filter } },
          { postalCode: { contains: filter } },
          { province: { name: { contains: filter } } },
          { city: { name: { contains: filter } } },
        ],
      },
    });
  }

  static async findWarehouseById(id: number) {
    return await prisma.warehouse.findUnique({
      where: { id },
      include: {
        province: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
      },
    });
  }

  static async deleteWarehouseById(id: number) {
    await prisma.warehouse.delete({ where: { id } });
  }

  static async updateWarehouseById(
    id: number,
    data: Prisma.WarehouseUpdateInput,
  ) {
    await prisma.warehouse.update({ where: { id }, data });
  }
}
