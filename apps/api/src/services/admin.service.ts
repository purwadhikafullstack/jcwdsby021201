import { UserRepository } from '@/repositories/user.repository';
import { UserBody, UserQuery } from '@/types/admin.type';
import { hashPassword } from '@/utils/hash';
import {
  responseDataWithPagination,
  responseWithData,
  responseWithoutData,
} from '@/utils/response';
import { AdminValidation } from '@/validators/admin.validation';
import { Validation } from '@/validators/validation';

export class AdminService {
  static async getWarehouseAdmins(query: UserQuery) {
    const { page, limit, filter, sortBy, orderBy } = Validation.validate(
      Validation.QUERY,
      query,
    );

    const queryPage = page || 1;
    const queryLimit = limit || 10;
    const queryFilter = filter || '';
    const querySortBy = sortBy || 'username';
    const queryOrderBy = orderBy || 'asc';

    const response = await UserRepository.getWarehouseAdmins(
      queryPage,
      queryLimit,
      queryFilter,
      querySortBy,
      queryOrderBy,
    );

    if (!response.length) {
      return responseWithoutData(404, false, 'Data Not Found');
    }

    const newResponse = response.map((user) => {
      const { password, ...res } = user;
      return res;
    });

    const total = await UserRepository.countWarehouseAdmins(queryFilter);
    return responseDataWithPagination(
      200,
      'Success Get Warehouse Admins',
      newResponse,
      { page: queryPage, limit: queryLimit, total },
    );
  }
  static async createAdmin(body: UserBody) {
    const { email, password, username } = Validation.validate(
      AdminValidation.USER_BODY,
      body,
    );

    const trimUsername = username.trim();
    const checkUsername = await UserRepository.findUserByUsername(trimUsername);
    if (checkUsername) {
      return responseWithoutData(400, false, 'Username Already Exists');
    }

    const checkMail = await UserRepository.findUserByEmail(email);
    if (checkMail) {
      return responseWithoutData(400, false, 'Email Already Exists');
    }

    const hashedPassword = await hashPassword(password);
    await UserRepository.createUser({
      username: trimUsername,
      email,
      password: hashedPassword,
      isVerified: true,
      provider: 'credentials',
      role: 'ADMIN',
    });

    return responseWithoutData(201, true, 'Success Create Admin');
  }

  static async getUsersWithoutSuperAdmin(query: UserQuery) {
    const { page, limit, filter, sortBy, orderBy, role } = Validation.validate(
      AdminValidation.QUERY,
      query,
    );

    const queryPage = page || 1;
    const queryLimit = limit || 10;
    const queryFilter = filter || '';
    const querySortBy = sortBy || 'email';
    const queryOrderBy = orderBy || 'asc';
    const queryRole = role || 'ADMIN';

    const response = await UserRepository.getUsersWithoutSuperAdmin(
      queryPage,
      queryLimit,
      queryFilter,
      querySortBy,
      queryOrderBy,
      queryRole,
    );

    if (!response.length) {
      return responseWithoutData(404, false, 'Data Not Found');
    }

    const newResponse = response.map((user) => {
      const { password, ...res } = user;
      return res;
    });

    const total = await UserRepository.countUsersWithoutSuperAdmin(
      queryRole,
      queryFilter,
    );
    return responseDataWithPagination(200, 'Success Get Users', newResponse, {
      page: queryPage,
      limit: queryLimit,
      total,
    });
  }

  static async deleteAdmin(id: string) {
    const newId = Validation.validate(Validation.INT_ID, id);
    const checkId = await UserRepository.getUserById(Number(newId));

    if (!checkId) {
      return responseWithoutData(404, false, 'User Not Found');
    }

    if (checkId.warehouse) {
      return responseWithoutData(
        400,
        false,
        'Admin Has Warehouse, Cannot Be Deleted',
      );
    }

    if (checkId.role === 'ADMIN') {
      try {
        await UserRepository.deleteUserById(Number(newId));
      } catch (error) {
        return responseWithoutData(500, false, 'Internal Server Error');
      }

      return responseWithoutData(200, true, 'Success Delete Admin');
    } else {
      return responseWithoutData(
        400,
        false,
        'Cannot Delete Super Admin or User',
      );
    }
  }

  static async getUser(id: string) {
    const newId = Validation.validate(Validation.INT_ID, id);
    const checkId = await UserRepository.getUserById(Number(newId));

    if (!checkId) {
      return responseWithoutData(404, false, 'User Not Found');
    }

    const { password, ...res } = checkId;
    return responseWithData(200, 'Success Get User', res);
  }

  static async updateAdmin(id: string, body: UserBody) {
    const newId = Validation.validate(Validation.INT_ID, id);
    const { email, password, username } = Validation.validate(
      AdminValidation.USER_BODY,
      body,
    );

    const trimUsername = username.trim();
    const checkId = await UserRepository.getUserById(Number(newId));
    if (!checkId) {
      return responseWithoutData(404, false, 'User Not Found');
    }

    if (checkId.role === 'USER') {
      return responseWithoutData(400, false, 'Cannot Update User');
    }

    const checkUsername = await UserRepository.findUserByUsername(trimUsername);
    if (checkUsername && checkUsername.id !== Number(newId)) {
      return responseWithoutData(400, false, 'Username Already Exists');
    }

    const checkMail = await UserRepository.findUserByEmail(email);
    if (checkMail && checkMail.id !== Number(newId)) {
      return responseWithoutData(400, false, 'Email Already Exists');
    }

    const hashedPassword = await hashPassword(password);
    await UserRepository.updateUserById(Number(newId), {
      username: trimUsername,
      email,
      password: hashedPassword,
    });

    return responseWithoutData(200, true, 'Success Update Admin');
  }
}
