import { CategoryRepository } from '@/repositories/category.repository';
import { ProductRepository } from '@/repositories/product.repository';
import { ProductPictureRepository } from '@/repositories/productPicture.repository';
import { ProductBody, ProductForm } from '@/types/product.type';
import { ProductQuery } from '@/types/product.type';
import { deleteFile } from '@/utils/file';
import {
  responseDataWithPagination,
  responseWithData,
  responseWithoutData,
} from '@/utils/response';
import { generateSlug } from '@/utils/text';
import { ProductValidation } from '@/validators/product.validation';
import { Validation } from '@/validators/validation';

export class ProductService {
  static async createProduct(
    body: ProductForm,
    files: Express.Multer.File[] = [],
  ) {
    const validatedFiles = ProductValidation.filesValidation(files);
    const { name, price, description, categoryId } = Validation.validate(
      ProductValidation.FORM,
      body,
    );
    const trimName = name.trim();

    const checkName = await ProductRepository.findProductByName(trimName);
    if (checkName) return responseWithoutData(400, false, 'Name Already Exist');

    const checkCategory = await CategoryRepository.findCategoryById(
      Number(categoryId),
    );
    if (!checkCategory) {
      return responseWithoutData(400, false, 'Category Not Found');
    }

    const slug = generateSlug(trimName);
    const product = await ProductRepository.createProduct({
      name: trimName,
      slug,
      price: Number(price),
      description,
      category: { connect: { id: Number(categoryId) } },
    });

    if (validatedFiles.length) {
      for (const file of validatedFiles) {
        await ProductPictureRepository.createProductPicture({
          product: { connect: { id: product.id } },
          url: '/assets/products/' + file.filename,
          name: file.originalname,
        });
      }
    }

    return responseWithoutData(201, true, 'Success Create Product');
  }

  static async getProducts(query: ProductQuery) {
    const { filter, limit, page, sortBy, orderBy } = Validation.validate(
      Validation.QUERY,
      query,
    );

    const queryPage = page || 1;
    const queryLimit = limit || 10;
    const querySortBy = sortBy || 'name';
    const queryOrderBy = orderBy || 'asc';
    let queryFilter = filter || '';

    if (queryFilter !== '') {
      !isNaN(Number(queryFilter)) && (queryFilter = Number(queryFilter));
    }

    const response = await ProductRepository.getProducts(
      queryPage,
      queryLimit,
      queryFilter,
      querySortBy,
      queryOrderBy,
    );

    if (!response.length) {
      return responseWithoutData(404, false, 'Data Not Found');
    }

    const total = await ProductRepository.countProducts(queryFilter);
    return responseDataWithPagination(200, 'Success Get Products', response, {
      page: queryPage,
      limit: queryLimit,
      total,
    });
  }

  static async deleteProduct(id: string) {
    const newId = Validation.validate(Validation.INT_ID, id);

    const checkId = await ProductRepository.findProductById(Number(newId));
    if (!checkId) {
      return responseWithoutData(404, false, 'Product Not Found');
    }

    if (checkId.pictures.length) {
      for (const picture of checkId.pictures) {
        deleteFile('../../public', picture.url);
      }
    }

    try {
      await ProductRepository.deleteProductById(Number(newId));
    } catch (error) {
      return responseWithoutData(500, false, 'Internal Server Error');
    }

    return responseWithoutData(200, true, 'Success Delete Product');
  }

  static async getProduct(id: string) {
    const newId = Validation.validate(Validation.INT_ID, id);
    const checkId = await ProductRepository.findProductById(Number(newId));

    if (!checkId) {
      return responseWithoutData(404, false, 'Product Not Found');
    }

    return responseWithData(200, 'Success Get Product', checkId);
  }

  static async updateProduct(id: string, body: ProductBody) {
    const newId = Validation.validate(Validation.INT_ID, id);
    const { name, price, description, categoryId } = Validation.validate(
      ProductValidation.BODY,
      body,
    );

    const trimName = name.trim();
    const checkId = await ProductRepository.findProductById(Number(newId));
    if (!checkId) {
      return responseWithoutData(404, false, 'Product Not Found');
    }

    const checkName = await ProductRepository.findProductByName(trimName);
    if (checkName && checkName.id !== Number(newId)) {
      return responseWithoutData(400, false, 'Name Already Exist');
    }

    const checkCategory = await CategoryRepository.findCategoryById(categoryId);
    if (!checkCategory) {
      return responseWithoutData(400, false, 'Category Not Found');
    }

    const slug = generateSlug(trimName);
    await ProductRepository.updateProductById(Number(newId), {
      name: trimName,
      slug,
      price,
      description,
      category: { connect: { id: categoryId } },
    });

    return responseWithoutData(200, true, 'Success Update Product');
  }

  static async deleteProductImage(imageId: string) {
    const newId = Validation.validate(Validation.INT_ID, imageId);
    const checkId = await ProductPictureRepository.findProductPictureById(
      Number(newId),
    );

    if (!checkId) {
      return responseWithoutData(404, false, 'Product Image Not Found');
    }

    try {
      deleteFile('../../public', checkId.url);
      await ProductPictureRepository.deleteProductPictureById(Number(newId));
    } catch (error) {
      return responseWithoutData(500, false, 'Internal Server Error');
    }

    return responseWithoutData(200, true, 'Success Delete Product Image');
  }

  static async addProductImages(id: string, files: Express.Multer.File[] = []) {
    const validatedFiles = ProductValidation.filesValidation(files);
    const newId = Validation.validate(Validation.INT_ID, id);

    const checkId = await ProductRepository.findProductById(Number(newId));
    if (!checkId) {
      return responseWithoutData(404, false, 'Product Not Found');
    }

    if (!validatedFiles.length) {
      return responseWithoutData(400, false, 'No File Uploaded');
    }

    for (const file of validatedFiles) {
      const { id, url, name } =
        await ProductPictureRepository.createProductPicture({
          product: { connect: { id: Number(newId) } },
          url: '/assets/products/' + file.filename,
          name: file.originalname,
        });

      checkId.pictures.push({ id, name, url });
    }

    return responseWithData(200, 'Success Add Product Image', checkId);
  }

  static async getStock(productId: number) {
    const response = await ProductRepository.getStock(productId);

    return responseWithData(200, 'Success Get Product', response._sum);
  }
}
