import prisma from '@/prisma';
import { UserDecoded } from '@/types/auth.type';
import { ProductWarehouseQueryRequired } from '@/types/productWarehouse.type';

export class ProductWarehouseRepository {
  static async findProductWarehouseByProductIdAndWarehouseId(
    productId: number,
    warehouseId: number,
  ) {
    return await prisma.productWarehouse.findUnique({
      where: { productId_warehouseId: { productId, warehouseId } },
    });
  }

  static async getProductWarehouses(
    user: UserDecoded,
    query: ProductWarehouseQueryRequired,
  ) {
    const whereClause: any = {};

    whereClause.deleted = false;
    if (user.role !== 'SUPER_ADMIN') {
      whereClause.warehouse = { user: { id: user.id } };
    }

    if (typeof query.filter === 'string' && query.filter.trim() !== '') {
      whereClause.OR = [
        { warehouse: { name: { contains: query.filter } } },
        { product: { name: { contains: query.filter } } },
      ];
    } else if (typeof query.filter === 'number') {
      whereClause.OR = [
        { stock: { gte: query.filter } },
        { product: { price: { gte: query.filter } } },
      ];
    }

    return await prisma.productWarehouse.findMany({
      where: Object.keys(whereClause).length ? whereClause : undefined,
      include: {
        warehouse: { select: { id: true, name: true } },
        product: { select: { id: true, name: true, price: true } },
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { [query.sortBy]: query.orderBy },
    });
  }

  static async countProductWarehouses(
    user: UserDecoded,
    filter: number | string,
  ) {
    const whereClause: any = {};

    if (user.role !== 'SUPER_ADMIN') {
      whereClause.warehouse = { user: { id: user.id } };
    }

    if (typeof filter === 'string' && filter.trim() !== '') {
      whereClause.OR = [
        { warehouse: { name: { contains: filter } } },
        { product: { name: { contains: filter } } },
      ];
    } else if (typeof filter === 'number') {
      whereClause.OR = [
        { stock: { gte: filter } },
        { product: { price: { gte: filter } } },
      ];
    }

    return await prisma.productWarehouse.count({
      where: Object.keys(whereClause).length ? whereClause : undefined,
    });
  }

  static async findProductWarehouseById(id: number) {
    return await prisma.productWarehouse.findUnique({
      where: { id },
      include: {
        product: { select: { id: true, name: true, price: true } },
        warehouse: {
          select: {
            id: true,
            name: true,
            user: { select: { id: true, username: true } },
          },
        },
      },
    });
  }
}
