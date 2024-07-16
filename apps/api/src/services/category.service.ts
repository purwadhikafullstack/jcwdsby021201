import { CategoryRepository } from '@/repositories/category.repository';
import { CategoryBody, CategoryQuery } from '@/types/category.type';
import {
  responseDataWithPagination,
  responseWithData,
  responseWithoutData,
} from '@/utils/response';
import { generateSlug } from '@/utils/text';
import { CategoryValidation } from '@/validators/category.validation';
import { Validation } from '@/validators/validation';
import { Prisma } from '@prisma/client';

export class CategoryService {
  static async createCategory(body: CategoryBody) {
    const { name } = Validation.validate(CategoryValidation.BODY, body);
    const trimName = name.trim();

    const checkName = await CategoryRepository.findCategoryByName(trimName);
    if (checkName) return responseWithoutData(400, false, 'Name Already Exist');

    const slug = generateSlug(trimName);
    await CategoryRepository.createCategory({ name: trimName, slug });

    return responseWithoutData(201, true, 'Success Create Category');
  }

  static async getCategories(query: CategoryQuery) {
    const { filter, limit, page, sortBy, orderBy } = Validation.validate(
      Validation.QUERY,
      query,
    );

    const queryPage = page || 1;
    const queryLimit = limit || 10;
    const queryFilter = filter || '';
    const querySortBy = sortBy || 'name';
    const queryOrderBy = orderBy || 'asc';

    const response = await CategoryRepository.getCategories(
      queryPage,
      queryLimit,
      queryFilter,
      querySortBy,
      queryOrderBy,
    );

    if (!response.length) {
      return responseWithoutData(404, false, 'Data Not Found');
    }

    const total = await CategoryRepository.countCategories(queryFilter);
    return responseDataWithPagination(200, 'Success Get Categories', response, {
      page: queryPage,
      limit: queryLimit,
      total,
    });
  }

  static async updateCategory(id: string, body: CategoryBody) {
    const { name } = Validation.validate(CategoryValidation.BODY, body);
    const newId = Validation.validate(Validation.INT_ID, id);

    const trimName = name.trim();
    const checkId = await CategoryRepository.findCategoryById(Number(newId));
    if (!checkId) {
      return responseWithoutData(404, false, 'Category Not Found');
    }

    const checkName = await CategoryRepository.findCategoryByName(trimName);
    if (checkName && checkName.id !== Number(newId)) {
      return responseWithoutData(400, false, 'Name Already Exist');
    }

    const slug = generateSlug(trimName);
    await CategoryRepository.updateCategoryById(Number(newId), {
      name: trimName,
      slug,
    });

    return responseWithoutData(200, true, 'Success Update Category');
  }

  static async getCategory(id: string) {
    const newId = Validation.validate(Validation.INT_ID, id);
    const checkId = await CategoryRepository.findCategoryById(Number(newId));

    if (!checkId) {
      return responseWithoutData(404, false, 'Category Not Found');
    }

    return responseWithData(200, 'Success Get Category', checkId);
  }

  static async deleteCategory(id: string) {
    const newId = Validation.validate(Validation.INT_ID, id);

    const checkId = await CategoryRepository.findCategoryById(Number(newId));
    if (!checkId) {
      return responseWithoutData(404, false, 'Category Not Found');
    }

    try {
      await CategoryRepository.deleteCategoryById(Number(newId));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          return responseWithoutData(400, false, 'Category Has Products');
        }
      }
    }
    return responseWithoutData(200, true, 'Success Delete Category');
  }
}
