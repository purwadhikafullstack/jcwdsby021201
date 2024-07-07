import prisma from '@/prisma';
import { UserDecoded } from '@/types/auth.type';
import {
  MutationBody,
  MutationQueryRequired,
  MutationResponse,
} from '@/types/mutation.type';
import { ProductWarehouseResponse } from '@/types/productWarehouse.type';

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

    // if (user.role !== 'SUPER_ADMIN') {
    //   whereClause.sourceWarehouse = { user: { id: user.id } };
    // }
    whereClause.user = {
      user: {
        id: user.id,
      },
    };

    if (typeof query.filter === 'string' && query.filter.trim() !== '') {
      whereClause.OR = [
        { sourceWarehouse: { name: { contains: query.filter } } },
        { destinationWarehouse: { name: { contains: query.filter } } },
        { product: { name: { contains: query.filter } } },
        { note: { contains: query.filter } },
        { status: { contains: query.filter } },
      ];
    } else if (typeof query.filter === 'number') {
      whereClause.OR = [
        { stockRequest: { gte: query.filter } },
        { stockProcess: { gte: query.filter } },
      ];
    }

    return await prisma.mutation.findMany({
      where: {
        OR: [
          { destinationWarehouse: { user: { id: user.id } } },
          { sourceWarehouse: { user: { id: user.id } } },
        ],
      },
      // where: Object.keys(whereClause).length ? whereClause : undefined,
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
      whereClause.sourceWarehouse = { user: { id: user.id } };
    }

    if (typeof filter === 'string' && filter.trim() !== '') {
      whereClause.OR = [
        { sourceWarehouse: { name: { contains: filter } } },
        { destinationWarehouse: { name: { contains: filter } } },
        { product: { name: { contains: filter } } },
        { note: { contains: filter } },
        { status: { contains: filter } },
      ];
    } else if (typeof filter === 'number') {
      whereClause.OR = [
        { stockRequest: { gte: filter } },
        { stockProcess: { gte: filter } },
      ];
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
        destinationWarehouse: { select: { id: true, name: true } },
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
    productWarehouse: ProductWarehouseResponse,
    user: UserDecoded,
  ) {
    await prisma.$transaction(async (tx) => {
      const {
        id: mutationId,
        product,
        sourceWarehouse,
        destinationWarehouse,
      } = mutation;
      const { stock, id: productWarehouseId } = productWarehouse;
      const diff = stock - stockProcess;

      // update stock
      await tx.productWarehouse.update({
        where: { id: productWarehouseId },
        data: { stock: diff },
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
          productWarehouse: { connect: { id: productWarehouseId } },
          quantity: stockProcess,
          description: `Stock Out ${product.name} from ${sourceWarehouse.name} to ${destinationWarehouse.name} by ${user.username ? user.username : 'Unknown'} qty: ${diff}`,
          warehouse: { connect: { id: destinationWarehouse.id } },
          refMutation: { connect: { id: mutationId } },
        },
      });

      // create journal in for warehouse source
      await tx.journalMutation.create({
        data: {
          transactionType: 'IN',
          productWarehouse: { connect: { id: productWarehouseId } },
          quantity: stockProcess,
          description: `Stock In ${product.name} from ${sourceWarehouse.name} to ${destinationWarehouse.name} by ${user.username ? user.username : 'Unknown'} qty: ${stockProcess}`,
          warehouse: { connect: { id: sourceWarehouse.id } },
          refMutation: { connect: { id: mutationId } },
        },
      });
    });
  }
}
