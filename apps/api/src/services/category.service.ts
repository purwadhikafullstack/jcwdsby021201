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

    const defaultPage = page || 1;
    const defaultLimit = limit || 10;
    const defaultFilter = filter || '';
    const defaultSortBy = sortBy || 'name';
    const defaultOrderBy = orderBy || 'asc';

    const response = await CategoryRepository.getCategories(
      defaultPage,
      defaultLimit,
      defaultFilter,
      defaultSortBy,
      defaultOrderBy,
    );

    if (!response.length) {
      return responseWithoutData(404, false, 'Data Not Found');
    }

    const total = await CategoryRepository.countCategories(defaultFilter);

    return responseDataWithPagination(200, 'Success Get Categories', response, {
      page: defaultPage,
      limit: defaultLimit,
      total,
    });
  }

  static async updateCategory(id: string, body: CategoryBody) {
    const { name } = Validation.validate(CategoryValidation.BODY, body);
    const newId = Validation.validate(CategoryValidation.ID, id);
    const trimName = name.trim();

    const checkId = await CategoryRepository.findCategoryById(Number(newId));
    if (!checkId) {
      return responseWithoutData(404, false, 'Category Not Found');
    }

    const checkName = await CategoryRepository.findCategoryByName(trimName);
    if (checkName) {
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
    const newId = Validation.validate(CategoryValidation.ID, id);
    const checkId = await CategoryRepository.findCategoryById(Number(newId));

    if (!checkId) {
      return responseWithoutData(404, false, 'Category Not Found');
    }

    return responseWithData(200, 'Success Get Category', checkId);
  }

  static async deleteCategory(id: string) {
    const newId = Validation.validate(CategoryValidation.ID, id);

    const checkId = await CategoryRepository.findCategoryById(Number(newId));
    if (!checkId) {
      return responseWithoutData(404, false, 'Category Not Found');
    }

    await CategoryRepository.deleteCategoryById(Number(newId));
    return responseWithoutData(200, true, 'Success Delete Category');
  }
}
