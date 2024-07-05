import prisma from '@/prisma';
import { InventoryRepository } from '@/repositories/inventory.repository';
import { ProductRepository } from '@/repositories/product.repository';
import { ProductWarehouseRepository } from '@/repositories/productWarehouse.repository';
import { UserRepository } from '@/repositories/user.repository';
import { WarehouseRepository } from '@/repositories/warehouse.repository';
import { UserDecoded } from '@/types/auth.type';
import { InventoryBody, InventoryQuery } from '@/types/inventory.type';
import {
  responseDataWithPagination,
  responseWithData,
  responseWithoutData,
} from '@/utils/response';
import { InventoryValidation } from '@/validators/inventory.validation';
import { Validation } from '@/validators/validation';

export class InventoryService {
  static async createInventory(user: UserDecoded, body: InventoryBody) {
    const data = Validation.validate(InventoryValidation.BODY, body);

    const warehouse = await WarehouseRepository.findWarehouseById(
      data.warehouseId,
    );
    if (!warehouse) {
      return responseWithoutData(400, false, 'Warehouse Not Found');
    }

    if (warehouse.user?.id !== user.id && user.role !== 'SUPER_ADMIN') {
      return responseWithoutData(403, false, 'User Not Allowed');
    }

    const product = await ProductRepository.findProductById(data.productId);
    if (!product) {
      return responseWithoutData(400, false, 'Product Not Found');
    }

    const productWarehouse =
      await ProductWarehouseRepository.findProductWarehouseByProductIdAndWarehouseId(
        data.productId,
        data.warehouseId,
      );

    return await InventoryRepository.createInventory(
      data,
      warehouse,
      product,
      user,
      productWarehouse,
    );
  }

  static async getInventories(user: UserDecoded, query: InventoryQuery) {
    const { filter, limit, page, sortBy, orderBy } = Validation.validate(
      Validation.QUERY,
      query,
    );

    const queryPage = page || 1;
    const queryLimit = limit || 10;
    const querySortBy = sortBy || 'id';
    const queryOrderBy = orderBy || 'asc';
    let queryFilter = filter || '';

    if (queryFilter !== '') {
      !isNaN(Number(queryFilter)) && (queryFilter = Number(queryFilter));
    }

    const response = await ProductWarehouseRepository.getProductWarehouses(
      user,
      {
        page: queryPage,
        limit: queryLimit,
        filter: queryFilter,
        sortBy: querySortBy,
        orderBy: queryOrderBy,
      },
    );

    if (!response.length) {
      return responseWithoutData(404, false, 'Data Not Found');
    }

    const total = await ProductWarehouseRepository.countProductWarehouses(
      user,
      queryFilter,
    );

    return responseDataWithPagination(
      200,
      'Success Get Inventories',
      response,
      { page: queryPage, limit: queryLimit, total },
    );
  }

  static async deleteInventory(user: UserDecoded, id: string) {
    const newId = Validation.validate(Validation.INT_ID, id);

    const checkId = await ProductWarehouseRepository.findProductWarehouseById(
      Number(newId),
    );
    if (!checkId) {
      return responseWithoutData(404, false, 'Inventory Not Found');
    }

    if (checkId.warehouse.user?.id !== user.id && user.role !== 'SUPER_ADMIN') {
      return responseWithoutData(403, false, 'User Not Allowed');
    }

    return await InventoryRepository.deleteInventory(
      checkId,
      checkId.warehouse,
      checkId.product,
      user,
    );
  }

  static async getInventory(user: UserDecoded, id: string) {
    const newId = Validation.validate(Validation.INT_ID, id);
    const checkId = await ProductWarehouseRepository.findProductWarehouseById(
      Number(newId),
    );

    if (!checkId) {
      return responseWithoutData(404, false, 'Inventory Not Found');
    }

    if (checkId.warehouse.user?.id !== user.id && user.role !== 'SUPER_ADMIN') {
      return responseWithoutData(403, false, 'User Not Allowed');
    }

    return responseWithData(200, 'Success Get Inventory', checkId);
  }
}
