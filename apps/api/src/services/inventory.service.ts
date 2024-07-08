import { JournalMutationRepository } from '@/repositories/journalMutation.repository';
import { ProductRepository } from '@/repositories/product.repository';
import { ProductWarehouseRepository } from '@/repositories/productWarehouse.repository';
import { WarehouseRepository } from '@/repositories/warehouse.repository';
import { UserDecoded } from '@/types/auth.type';
import { JournalMutationQuery } from '@/types/journalMutation.type';
import {
  ProductWarehouseBody,
  ProductWarehouseQuery,
  ProductWarehouseUpdate,
} from '@/types/productWarehouse.type';
import {
  responseDataWithPagination,
  responseWithData,
  responseWithoutData,
} from '@/utils/response';
import { ProductWarehouseValidation } from '@/validators/productWarehouse.validation';
import { Validation } from '@/validators/validation';

export class InventoryService {
  static async createInventory(user: UserDecoded, body: ProductWarehouseBody) {
    const data = Validation.validate(ProductWarehouseValidation.BODY, body);

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

    return await ProductWarehouseRepository.createProductWarehouse(
      data,
      productWarehouse,
      user,
    );
  }

  static async getInventories(user: UserDecoded, query: ProductWarehouseQuery) {
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

    const productWarehouse =
      await ProductWarehouseRepository.findProductWarehouseById(Number(newId));
    if (!productWarehouse) {
      return responseWithoutData(404, false, 'Inventory Not Found');
    }

    if (
      productWarehouse.warehouse.user?.id !== user.id &&
      user.role !== 'SUPER_ADMIN'
    ) {
      return responseWithoutData(403, false, 'User Not Allowed');
    }

    await ProductWarehouseRepository.deleteProductWarehouse(
      productWarehouse,
      user,
    );

    return responseWithoutData(200, true, 'Success Delete Inventory');
  }

  static async getInventory(user: UserDecoded, id: string) {
    const newId = Validation.validate(Validation.INT_ID, id);
    const productWarehouse =
      await ProductWarehouseRepository.findProductWarehouseById(Number(newId));

    if (!productWarehouse) {
      return responseWithoutData(404, false, 'Inventory Not Found');
    }

    if (
      productWarehouse.warehouse.user?.id !== user.id &&
      user.role !== 'SUPER_ADMIN'
    ) {
      return responseWithoutData(403, false, 'User Not Allowed');
    }

    const newResponse = {
      ...productWarehouse,
      warehouse: {
        id: productWarehouse.warehouse.id,
        name: productWarehouse.warehouse.name,
      },
    };

    return responseWithData(200, 'Success Get Inventory', newResponse);
  }

  static async updateInventory(
    user: UserDecoded,
    id: string,
    body: ProductWarehouseUpdate,
  ) {
    const newId = Validation.validate(Validation.INT_ID, id);
    const { stock } = Validation.validate(
      ProductWarehouseValidation.UPDATE,
      body,
    );

    const productWarehouse =
      await ProductWarehouseRepository.findProductWarehouseById(Number(newId));

    if (!productWarehouse) {
      return responseWithoutData(404, false, 'Inventory Not Found');
    }

    if (
      productWarehouse.warehouse.user?.id !== user.id &&
      user.role !== 'SUPER_ADMIN'
    ) {
      return responseWithoutData(403, false, 'User Not Allowed');
    }

    await ProductWarehouseRepository.updateProductWarehouse(
      stock,
      productWarehouse,
      user,
    );

    return responseWithoutData(200, true, 'Success Update Inventory');
  }

  static async getInventoryHistory(
    user: UserDecoded,
    query: JournalMutationQuery,
  ) {
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

    const response = await JournalMutationRepository.getInventoryHistory(user, {
      page: queryPage,
      limit: queryLimit,
      filter: queryFilter,
      sortBy: querySortBy,
      orderBy: queryOrderBy,
    });

    if (!response.length) {
      return responseWithoutData(404, false, 'Data Not Found');
    }

    const total = await JournalMutationRepository.countInventoryHistory(
      user,
      queryFilter,
    );

    return responseDataWithPagination(200, 'Success Get History', response, {
      page: queryPage,
      limit: queryLimit,
      total,
    });
  }

  static async getInventoryHistoryById(
    id: string,
    user: UserDecoded,
    query: JournalMutationQuery,
  ) {
    const newId = Validation.validate(Validation.INT_ID, id);
    const { filter, limit, page, sortBy, orderBy } = Validation.validate(
      Validation.QUERY,
      query,
    );

    const checkId = await ProductWarehouseRepository.findProductWarehouseById(
      Number(newId),
    );

    if (!checkId) {
      return responseWithoutData(404, false, 'Inventory Not Found');
    }

    if (checkId.warehouse.user?.id !== user.id && user.role !== 'SUPER_ADMIN') {
      return responseWithoutData(403, false, 'User Not Allowed');
    }

    const queryPage = page || 1;
    const queryLimit = limit || 10;
    const querySortBy = sortBy || 'id';
    const queryOrderBy = orderBy || 'asc';
    let queryFilter = filter || '';

    if (queryFilter !== '') {
      !isNaN(Number(queryFilter)) && (queryFilter = Number(queryFilter));
    }

    const response = await JournalMutationRepository.getInventoryHistoryById(
      Number(newId),
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

    const total = await JournalMutationRepository.countInventoryHistoryById(
      Number(newId),
      user,
      queryFilter,
    );

    return responseDataWithPagination(200, 'Success Get History', response, {
      page: queryPage,
      limit: queryLimit,
      total,
    });
  }
}
