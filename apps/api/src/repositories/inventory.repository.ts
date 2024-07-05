import prisma from '@/prisma';
import { UserDecoded } from '@/types/auth.type';
import { InventoryBody } from '@/types/inventory.type';
import { ProductDeleteInventory, ProductResponse } from '@/types/product.type';
import { ProductWarehouseResponse } from '@/types/productWarehouse.type';
import {
  WarehouseDeleteInventory,
  WarehouseResponse,
} from '@/types/warehouse.type';
import { responseWithoutData } from '@/utils/response';

export class InventoryRepository {
  static async createInventory(
    data: InventoryBody,
    warehouse: WarehouseResponse,
    product: ProductResponse,
    user: UserDecoded,
    productWarehouse: ProductWarehouseResponse | null,
  ) {
    const { warehouseId, productId, stock } = data;
    return await prisma.$transaction(async (tx) => {
      if (productWarehouse) {
        const diff = stock - productWarehouse.stock;
        if (diff < 0) {
          await tx.journalProduct.create({
            data: {
              transactionType: 'OUT',
              quantity: Math.abs(diff),
              productWarehouse: { connect: { id: productWarehouse.id } },
              description: `Stock Out ${product.name} from ${warehouse.name} by ${user.username ? user.username : 'Unknown'} qty: ${Math.abs(diff)}`,
            },
          });

          await tx.productWarehouse.update({
            where: { id: productWarehouse.id },
            data: { stock, deleted: false },
          });
        } else if (diff > 0) {
          await tx.journalProduct.create({
            data: {
              transactionType: 'IN',
              quantity: diff,
              productWarehouse: { connect: { id: productWarehouse.id } },
              description: `Stock In ${product.name} from ${warehouse.name} by ${user.username ? user.username : 'Unknown'} qty: ${diff}`,
            },
          });

          await tx.productWarehouse.update({
            where: { id: productWarehouse.id },
            data: { stock, deleted: false },
          });
        } else {
          await tx.productWarehouse.update({
            where: { id: productWarehouse.id },
            data: { stock, deleted: false },
          });
        }

        return responseWithoutData(
          200,
          true,
          `Stock Product ${product.name} On Warehouse ${warehouse.name} Updated`,
        );
      } else {
        await tx.journalProduct.create({
          data: {
            transactionType: 'IN',
            quantity: stock,
            productWarehouse: {
              create: {
                warehouse: { connect: { id: warehouseId } },
                product: { connect: { id: productId } },
                stock,
              },
            },
            description: `Stock In ${product.name} from ${warehouse.name} by ${user.username ? user.username : 'Unknown'} qty: ${stock}`,
          },
        });

        return responseWithoutData(
          201,
          true,
          `Success Add Stock ${product.name} To Warehouse ${warehouse.name}`,
        );
      }
    });
  }

  static async deleteInventory(
    productWarehouse: ProductWarehouseResponse,
    warehouse: WarehouseDeleteInventory,
    product: ProductDeleteInventory,
    user: UserDecoded,
  ) {
    return await prisma.$transaction(async (tx) => {
      try {
        await tx.journalProduct.create({
          data: {
            transactionType: 'OUT',
            quantity: 0,
            productWarehouse: { connect: { id: productWarehouse.id } },
            description: `Stock Out ${product.name} from ${warehouse.name} by ${user.username ? user.username : 'Unknown'} qty: ${productWarehouse.stock}`,
          },
        });

        await tx.productWarehouse.delete({
          where: { id: productWarehouse.id },
        });

        return responseWithoutData(200, true, 'Success Delete Inventory');
      } catch (error) {
        return responseWithoutData(500, false, 'Internal Server Error');
      }
    });
  }
}
