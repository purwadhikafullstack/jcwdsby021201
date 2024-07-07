import { MutationRepository } from '@/repositories/mutation.repository';
import { ProductRepository } from '@/repositories/product.repository';
import { ProductWarehouseRepository } from '@/repositories/productWarehouse.repository';
import { WarehouseRepository } from '@/repositories/warehouse.repository';
import { UserDecoded } from '@/types/auth.type';
import {
  MutationBody,
  MutationQuery,
  MutationUpdate,
} from '@/types/mutation.type';
import {
  responseDataWithPagination,
  responseWithData,
  responseWithoutData,
} from '@/utils/response';
import { MutationValidation } from '@/validators/mutation.validation';
import { Validation } from '@/validators/validation';

export class MutationService {
  static async createMutation(user: UserDecoded, body: MutationBody) {
    const data = Validation.validate(MutationValidation.BODY, body);

    const product = await ProductRepository.findProductById(data.productId);
    if (!product) {
      return responseWithoutData(400, false, 'Product Not Found');
    }

    const warehouseSource = await WarehouseRepository.findWarehouseById(
      data.sourceWarehouseId,
    );
    if (!warehouseSource) {
      return responseWithoutData(400, false, 'Warehouse Source Not Found');
    }

    const warehouseDestination = await WarehouseRepository.findWarehouseById(
      data.destinationWarehouseId,
    );
    if (!warehouseDestination) {
      return responseWithoutData(400, false, 'Warehouse Destination Not Found');
    }

    if (warehouseSource.user?.id !== user.id && user.role !== 'SUPER_ADMIN') {
      return responseWithoutData(403, false, 'User Not Allowed');
    }

    await MutationRepository.createMutation(data);
    return responseWithoutData(201, true, 'Success Create Request Mutation');
  }

  static async getMutations(user: UserDecoded, query: MutationQuery) {
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

    const response = await MutationRepository.getMutations(user, {
      filter: queryFilter,
      limit: queryLimit,
      page: queryPage,
      sortBy: querySortBy,
      orderBy: queryOrderBy,
    });

    if (!response.length) {
      return responseWithoutData(404, false, 'Data Not Found');
    }

    const total = await MutationRepository.countMutations(user, queryFilter);
    return responseDataWithPagination(200, 'Success Get Mutations', response, {
      page: queryPage,
      limit: queryLimit,
      total,
    });
  }

  static async getMutation(user: UserDecoded, id: string) {
    const newId = Validation.validate(Validation.INT_ID, id);
    const mutation = await MutationRepository.findMutationById(Number(newId));

    if (!mutation) {
      return responseWithoutData(404, false, 'Mutation Not Found');
    }

    if (
      mutation.sourceWarehouse.user?.id !== user.id &&
      user.role !== 'SUPER_ADMIN'
    ) {
      return responseWithoutData(403, false, 'User Not Allowed');
    }

    const newResponse = {
      ...mutation,
      sourceWarehouse: {
        id: mutation.sourceWarehouse.id,
        name: mutation.sourceWarehouse.name,
      },
    };

    return responseWithData(200, 'Success Get Mutation', newResponse);
  }

  static async updateMutationToCancel(user: UserDecoded, id: string) {
    const newId = Validation.validate(Validation.INT_ID, id);

    const mutation = await MutationRepository.findMutationById(Number(newId));
    if (!mutation) {
      return responseWithoutData(404, false, 'Mutation Not Found');
    }

    if (
      mutation.sourceWarehouse.user?.id !== user.id &&
      user.role !== 'SUPER_ADMIN'
    ) {
      return responseWithoutData(403, false, 'User Not Allowed');
    }

    if (mutation.status !== 'PENDING') {
      return responseWithoutData(400, false, 'Mutation Already Processed');
    }

    await MutationRepository.updateStatusMutationById(
      Number(newId),
      'CANCELED',
    );

    return responseWithoutData(200, true, 'Success Cancel Mutation');
  }

  static async updateMutationToApprove(
    user: UserDecoded,
    id: string,
    body: MutationUpdate,
  ) {
    const newId = Validation.validate(Validation.INT_ID, id);
    const { stockProcess } = Validation.validate(
      MutationValidation.UPDATE,
      body,
    );

    const mutation = await MutationRepository.findMutationById(Number(newId));
    if (!mutation) {
      return responseWithoutData(404, false, 'Mutation Not Found');
    }

    if (
      mutation.sourceWarehouse.user?.id !== user.id &&
      user.role !== 'SUPER_ADMIN'
    ) {
      return responseWithoutData(403, false, 'User Not Allowed');
    }

    if (mutation.status !== 'PENDING') {
      return responseWithoutData(400, false, 'Mutation Already Processed');
    }

    const inventory =
      await ProductWarehouseRepository.findProductWarehouseByProductIdAndWarehouseId(
        mutation.productId,
        mutation.destinationWarehouseId,
      );

    if (!inventory) {
      return responseWithoutData(
        400,
        false,
        'Product Not Found in Warehouse Destination',
      );
    }

    if (stockProcess > inventory.stock) {
      return responseWithoutData(
        400,
        false,
        'Product Stock Not Enough in Warehouse Destination',
      );
    }

    if (stockProcess > mutation.stockRequest) {
      return responseWithoutData(
        400,
        false,
        'Stock Process Over Stock Request',
      );
    }

    await MutationRepository.updateMutationToApprove(
      stockProcess,
      mutation,
      inventory,
    );

    return responseWithoutData(200, true, 'Success Approve Mutation');
  }
}
