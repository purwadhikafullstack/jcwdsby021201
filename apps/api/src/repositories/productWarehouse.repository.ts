import prisma from '@/prisma';
import { UserDecoded } from '@/types/auth.type';
import { ProductWarehouseBody } from '@/types/productWarehouse.type';
import {
  ProductWarehouseQueryRequired,
  ProductWarehouseResponse,
} from '@/types/productWarehouse.type';
import { responseWithoutData } from '@/utils/response';

export class ProductWarehouseRepository {
  static async createProductWarehouse(
    data: ProductWarehouseBody,
    productWarehouse: ProductWarehouseResponse | null,
    user: UserDecoded,
  ) {
    const { warehouseId, productId, stock } = data;
    return await prisma.$transaction(async (tx) => {
      if (productWarehouse) {
        const {
          id,
          stock: productStock,
          warehouse,
          product,
        } = productWarehouse;

        const diff = stock - productStock;
        if (diff < 0) {
          await tx.journalMutation.create({
            data: {
              transactionType: 'OUT',
              quantity: Math.abs(diff),
              productWarehouse: { connect: { id } },
              description: `Stock Out ${product.name} from ${warehouse.name} by ${user.username ? user.username : 'Unknown'} qty: ${Math.abs(diff)}`,
            },
          });

          await tx.productWarehouse.update({
            where: { id },
            data: { stock, deleted: false },
          });
        } else if (diff > 0) {
          await tx.journalMutation.create({
            data: {
              transactionType: 'IN',
              quantity: diff,
              productWarehouse: { connect: { id } },
              description: `Stock In ${product.name} from ${warehouse.name} by ${user.username ? user.username : 'Unknown'} qty: ${diff}`,
            },
          });

          await tx.productWarehouse.update({
            where: { id },
            data: { stock, deleted: false },
          });
        } else {
          await tx.productWarehouse.update({
            where: { id },
            data: { stock, deleted: false },
          });
        }

        return responseWithoutData(
          200,
          true,
          "Success Update Product Warehouse's Stock",
        );
      } else {
        const { product, warehouse, id } = await tx.productWarehouse.create({
          data: {
            warehouse: { connect: { id: warehouseId } },
            product: { connect: { id: productId } },
            stock,
          },
          include: {
            warehouse: {
              select: {
                id: true,
                name: true,
                user: { select: { id: true, username: true } },
              },
            },
            product: { select: { id: true, name: true } },
          },
        });

        await tx.journalMutation.create({
          data: {
            transactionType: 'IN',
            quantity: stock,
            productWarehouse: { connect: { id } },
            description: `Stock In ${product.name} from ${warehouse.name} by ${user.username ? user.username : 'Unknown'} qty: ${stock}`,
          },
        });

        return responseWithoutData(
          201,
          true,
          "Success Add Product Warehouse's Stock",
        );
      }
    });
  }

  static async findProductWarehouseByProductIdAndWarehouseId(
    productId: number,
    warehouseId: number,
  ) {
    return await prisma.productWarehouse.findUnique({
      where: { productId_warehouseId: { productId, warehouseId } },
      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
            user: { select: { id: true, username: true } },
          },
        },
        product: { select: { id: true, name: true } },
      },
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

  static async deleteProductWarehouse(
    productWarehouse: ProductWarehouseResponse,
    user: UserDecoded,
  ) {
    const { warehouse, product } = productWarehouse;
    return await prisma.$transaction(async (tx) => {
      await tx.journalMutation.create({
        data: {
          transactionType: 'OUT',
          quantity: productWarehouse.stock,
          productWarehouse: { connect: { id: productWarehouse.id } },
          description: `Stock Out ${product.name} from ${warehouse.name} by ${user.username ? user.username : 'Unknown'} qty: ${productWarehouse.stock}`,
        },
      });

      await tx.productWarehouse.delete({
        where: { id: productWarehouse.id },
      });
    });
  }

  static async updateProductWarehouse(
    id: number,
    stock: number,
    productWarehouse: ProductWarehouseResponse,
    user: UserDecoded,
  ) {
    return await prisma.$transaction(async (tx) => {
      const { id, stock: productStock, warehouse, product } = productWarehouse;
      const diff = stock - productStock;

      if (diff < 0) {
        await tx.journalMutation.create({
          data: {
            transactionType: 'OUT',
            quantity: Math.abs(diff),
            productWarehouse: { connect: { id } },
            description: `Stock Out ${product.name} from ${warehouse.name} by ${user.username ? user.username : 'Unknown'} qty: ${Math.abs(diff)}`,
          },
        });

        await tx.productWarehouse.update({
          where: { id },
          data: { stock, deleted: false },
        });
      } else if (diff > 0) {
        await tx.journalMutation.create({
          data: {
            transactionType: 'IN',
            quantity: diff,
            productWarehouse: { connect: { id } },
            description: `Stock In ${product.name} to ${warehouse.name} by ${user.username ? user.username : 'Unknown'} qty: ${diff}`,
          },
        });

        await tx.productWarehouse.update({
          where: { id },
          data: { stock, deleted: false },
        });
      } else {
        await tx.productWarehouse.update({
          where: { id },
          data: { stock, deleted: false },
        });
      }
    });
  }
}
