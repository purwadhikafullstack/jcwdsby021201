import prisma from '@/prisma';
import { UserDecoded } from '@/types/auth.type';
import {
  MutationBody,
  MutationQueryRequired,
  MutationResponse,
} from '@/types/mutation.type';

export class MutationRepository {
  static async createMutation(data: MutationBody) {
    const {
      sourceWarehouseId,
      destinationWarehouseId,
      productId,
      stockRequest,
      note,
    } = data;
    return await prisma.mutation.create({
      data: {
        sourceWarehouse: { connect: { id: sourceWarehouseId } },
        destinationWarehouse: { connect: { id: destinationWarehouseId } },
        product: { connect: { id: productId } },
        stockRequest,
        note,
        status: 'PENDING',
      },
    });
  }

  static async getMutations(user: UserDecoded, query: MutationQueryRequired) {
    const whereClause: any = {};

    if (user.role !== 'SUPER_ADMIN') {
      whereClause.OR = [
        { sourceWarehouse: { user: { id: user.id } } },
        { destinationWarehouse: { user: { id: user.id } } },
      ];
    }

    if (typeof query.filter === 'string' && query.filter.trim() !== '') {
      const stringFilters = [
        { sourceWarehouse: { name: { contains: query.filter } } },
        { destinationWarehouse: { name: { contains: query.filter } } },
        { product: { name: { contains: query.filter } } },
        { note: { contains: query.filter } },
        { status: { contains: query.filter } },
      ];

      if (whereClause.OR) {
        whereClause.OR.concat(stringFilters);
      } else {
        whereClause.OR = stringFilters;
      }
    } else if (typeof query.filter === 'number') {
      const numberFilters = [
        { stockRequest: { gte: query.filter } },
        { stockProcess: { gte: query.filter } },
      ];

      if (whereClause.OR) {
        whereClause.OR.concat(numberFilters);
      } else {
        whereClause.OR = numberFilters;
      }
    }

    return await prisma.mutation.findMany({
      where: Object.keys(whereClause).length ? whereClause : undefined,
      include: {
        sourceWarehouse: { select: { id: true, name: true } },
        destinationWarehouse: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { [query.sortBy]: query.orderBy },
    });
  }

  static async countMutations(user: UserDecoded, filter: number | string) {
    const whereClause: any = {};

    if (user.role !== 'SUPER_ADMIN') {
      whereClause.OR = [
        { sourceWarehouse: { user: { id: user.id } } },
        { destinationWarehouse: { user: { id: user.id } } },
      ];
    }

    if (typeof filter === 'string' && filter.trim() !== '') {
      const stringFilters = [
        { sourceWarehouse: { name: { contains: filter } } },
        { destinationWarehouse: { name: { contains: filter } } },
        { product: { name: { contains: filter } } },
        { note: { contains: filter } },
        { status: { contains: filter } },
      ];

      if (whereClause.OR) {
        whereClause.OR.concat(stringFilters);
      } else {
        whereClause.OR = stringFilters;
      }
    } else if (typeof filter === 'number') {
      const numberFilters = [
        { stockRequest: { gte: filter } },
        { stockProcess: { gte: filter } },
      ];

      if (whereClause.OR) {
        whereClause.OR.concat(numberFilters);
      } else {
        whereClause.OR = numberFilters;
      }
    }

    return await prisma.mutation.count({
      where: Object.keys(whereClause).length ? whereClause : undefined,
    });
  }

  static async findMutationById(id: number) {
    return await prisma.mutation.findUnique({
      where: { id },
      include: {
        sourceWarehouse: {
          select: {
            id: true,
            name: true,
            user: { select: { id: true, username: true } },
          },
        },
        destinationWarehouse: {
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

  static async updateStatusMutationById(
    id: number,
    status: 'PENDING' | 'CANCELED' | 'APPROVED' | 'REJECTED',
  ) {
    await prisma.mutation.update({
      where: { id },
      data: { status },
    });
  }

  static async updateMutationToApprove(
    stockProcess: number,
    mutation: MutationResponse,
    {
      inventorySourceId,
      inventoryDestinationId,
    }: { inventorySourceId: number; inventoryDestinationId: number },
    user: UserDecoded,
  ) {
    await prisma.$transaction(async (tx) => {
      const {
        id: mutationId,
        product,
        sourceWarehouse,
        destinationWarehouse,
      } = mutation;

      // update stock on warehouse destination
      await tx.productWarehouse.update({
        where: { id: inventoryDestinationId },
        data: { stock: { decrement: stockProcess } },
      });

      // update stock on warehouse source
      await tx.productWarehouse.update({
        where: { id: inventorySourceId },
        data: { stock: { increment: stockProcess } },
      });

      // update mutation
      await tx.mutation.update({
        where: { id: mutationId },
        data: { status: 'APPROVED', stockProcess: stockProcess },
      });

      // create journal out for warehouse destination
      await tx.journalMutation.create({
        data: {
          transactionType: 'OUT',
          productWarehouse: { connect: { id: inventoryDestinationId } },
          quantity: stockProcess,
          description: `Stock OUT ${product.name} from ${destinationWarehouse.name} to ${sourceWarehouse.name} by ${user.username ? user.username : 'Unknown'} qty: ${stockProcess}`,
          warehouse: { connect: { id: destinationWarehouse.id } },
          refMutation: { connect: { id: mutationId } },
        },
      });

      // create journal in for warehouse source
      await tx.journalMutation.create({
        data: {
          transactionType: 'IN',
          productWarehouse: { connect: { id: inventorySourceId } },
          quantity: stockProcess,
          description: `Stock IN ${product.name} to ${sourceWarehouse.name} from ${destinationWarehouse.name} by ${user.username ? user.username : 'Unknown'} qty: ${stockProcess}`,
          warehouse: { connect: { id: sourceWarehouse.id } },
          refMutation: { connect: { id: mutationId } },
        },
      });

      // create journal out for inventory
      await tx.journalMutation.create({
        data: {
          transactionType: 'OUT',
          productWarehouse: { connect: { id: inventoryDestinationId } },
          quantity: stockProcess,
          description: `Stock OUT ${product.name} from ${destinationWarehouse.name} to ${sourceWarehouse.name} by ${user.username ? user.username : 'Unknown'} qty: ${stockProcess}`,
          refMutation: { connect: { id: mutationId } },
        },
      });

      // create journal in for inventory
      await tx.journalMutation.create({
        data: {
          transactionType: 'IN',
          productWarehouse: { connect: { id: inventorySourceId } },
          quantity: stockProcess,
          description: `Stock IN ${product.name} to ${sourceWarehouse.name} from ${destinationWarehouse.name} by ${user.username ? user.username : 'Unknown'} qty: ${stockProcess}`,
          refMutation: { connect: { id: mutationId } },
        },
      });
    });
  }
}
