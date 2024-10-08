import prisma from '@/prisma';
import { UserDecoded } from '@/types/auth.type';
import { JournalMutationQueryRequired } from '@/types/journalMutation.type';

export class JournalMutationRepository {
  static async getInventoryHistory(
    user: UserDecoded,
    query: JournalMutationQueryRequired,
  ) {
    const whereClause: any = {};
    whereClause.warehouseId = null;

    if (user.role !== 'SUPER_ADMIN') {
      whereClause.productWarehouse = { warehouse: { user: { id: user.id } } };
    }

    if (typeof query.filter === 'string' && query.filter.trim() !== '') {
      whereClause.OR = [
        {
          productWarehouse: {
            OR: [
              { product: { name: { contains: query.filter } } },
              { warehouse: { name: { contains: query.filter } } },
            ],
          },
        },
      ];
    } else if (typeof query.filter === 'number') {
      whereClause.OR = [{ quantity: { equals: query.filter } }];
    }

    return await prisma.journalMutation.findMany({
      where: Object.keys(whereClause).length ? whereClause : undefined,
      include: {
        productWarehouse: {
          include: {
            warehouse: { select: { id: true, name: true } },
            product: { select: { id: true, name: true, price: true } },
          },
        },
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { [query.sortBy]: query.orderBy },
    });
  }

  static async countInventoryHistory(
    user: UserDecoded,
    filter: string | number,
  ) {
    const whereClause: any = {};
    whereClause.warehouseId = null;

    if (user.role !== 'SUPER_ADMIN') {
      whereClause.productWarehouse = { warehouse: { user: { id: user.id } } };
    }

    if (typeof filter === 'string' && filter.trim() !== '') {
      whereClause.OR = [{ description: { contains: filter } }];
    } else if (typeof filter === 'number') {
      whereClause.OR = [{ quantity: { equals: filter } }];
    }

    return await prisma.journalMutation.count({
      where: Object.keys(whereClause).length ? whereClause : undefined,
    });
  }

  static async getInventoryHistoryById(
    id: number,
    user: UserDecoded,
    query: JournalMutationQueryRequired,
  ) {
    const whereClause: any = {};
    whereClause.productWarehouseId = id;
    whereClause.warehouseId = null;

    if (user.role !== 'SUPER_ADMIN') {
      whereClause.productWarehouse = { warehouse: { user: { id: user.id } } };
    }

    if (typeof query.filter === 'string' && query.filter.trim() !== '') {
      whereClause.OR = [
        {
          productWarehouse: {
            OR: [
              { product: { name: { contains: query.filter } } },
              { warehouse: { name: { contains: query.filter } } },
            ],
          },
        },
      ];
    } else if (typeof query.filter === 'number') {
      whereClause.OR = [{ quantity: { equals: query.filter } }];
    }

    return await prisma.journalMutation.findMany({
      where: Object.keys(whereClause).length ? whereClause : undefined,
      include: {
        productWarehouse: {
          include: {
            warehouse: { select: { id: true, name: true } },
            product: { select: { id: true, name: true, price: true } },
          },
        },
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { [query.sortBy]: query.orderBy },
    });
  }

  static async countInventoryHistoryById(
    id: number,
    user: UserDecoded,
    filter: string | number,
  ) {
    const whereClause: any = {};
    whereClause.productWarehouseId = id;
    whereClause.warehouseId = null;

    if (user.role !== 'SUPER_ADMIN') {
      whereClause.productWarehouse = { warehouse: { user: { id: user.id } } };
    }

    if (typeof filter === 'string' && filter.trim() !== '') {
      whereClause.OR = [{ description: { contains: filter } }];
    } else if (typeof filter === 'number') {
      whereClause.OR = [{ quantity: { equals: filter } }];
    }

    return await prisma.journalMutation.count({
      where: Object.keys(whereClause).length ? whereClause : undefined,
    });
  }

  static async getMutationHistory(
    user: UserDecoded,
    query: JournalMutationQueryRequired,
  ) {
    const whereClause: any = {};
    whereClause.warehouseId = { not: null };

    if (user.role !== 'SUPER_ADMIN') {
      whereClause.warehouse = { user: { id: user.id } };
    }

    if (typeof query.filter === 'string' && query.filter.trim() !== '') {
      whereClause.OR = [
        {
          productWarehouse: {
            OR: [
              { product: { name: { contains: query.filter } } },
              { warehouse: { name: { contains: query.filter } } },
            ],
          },
        },
      ];
    } else if (typeof query.filter === 'number') {
      whereClause.OR = [{ quantity: { equals: query.filter } }];
    }

    return await prisma.journalMutation.findMany({
      where: Object.keys(whereClause).length ? whereClause : undefined,
      include: {
        productWarehouse: {
          include: {
            warehouse: { select: { id: true, name: true } },
            product: { select: { id: true, name: true, price: true } },
          },
        },
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { [query.sortBy]: query.orderBy },
    });
  }

  static async countMutationHistory(
    user: UserDecoded,
    filter: string | number,
  ) {
    const whereClause: any = {};
    whereClause.warehouseId = { not: null };

    if (user.role !== 'SUPER_ADMIN') {
      whereClause.warehouse = { user: { id: user.id } };
    }

    if (typeof filter === 'string' && filter.trim() !== '') {
      whereClause.OR = [{ description: { contains: filter } }];
    } else if (typeof filter === 'number') {
      whereClause.OR = [{ quantity: { equals: filter } }];
    }

    return await prisma.journalMutation.count({
      where: Object.keys(whereClause).length ? whereClause : undefined,
    });
  }

  static async getMutationHistoryById(
    id: number,
    user: UserDecoded,
    query: JournalMutationQueryRequired,
  ) {
    const whereClause: any = {};
    whereClause.refMutationId = id;
    whereClause.warehouseId = { not: null };

    if (user.role !== 'SUPER_ADMIN') {
      whereClause.warehouse = { user: { id: user.id } };
    }

    if (typeof query.filter === 'string' && query.filter.trim() !== '') {
      whereClause.OR = [
        {
          productWarehouse: {
            OR: [
              { product: { name: { contains: query.filter } } },
              { warehouse: { name: { contains: query.filter } } },
            ],
          },
        },
      ];
    } else if (typeof query.filter === 'number') {
      whereClause.OR = [{ quantity: { equals: query.filter } }];
    }

    return await prisma.journalMutation.findMany({
      where: Object.keys(whereClause).length ? whereClause : undefined,
      include: {
        productWarehouse: {
          include: {
            warehouse: { select: { id: true, name: true } },
            product: { select: { id: true, name: true, price: true } },
          },
        },
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { [query.sortBy]: query.orderBy },
    });
  }

  static async countMutationHistoryById(
    id: number,
    user: UserDecoded,
    filter: string | number,
  ) {
    const whereClause: any = {};
    whereClause.refMutationId = id;
    whereClause.warehouseId = { not: null };

    if (user.role !== 'SUPER_ADMIN') {
      whereClause.warehouse = { user: { id: user.id } };
    }

    if (typeof filter === 'string' && filter.trim() !== '') {
      whereClause.OR = [{ description: { contains: filter } }];
    } else if (typeof filter === 'number') {
      whereClause.OR = [{ quantity: { equals: filter } }];
    }

    return await prisma.journalMutation.count({
      where: Object.keys(whereClause).length ? whereClause : undefined,
    });
  }
}
