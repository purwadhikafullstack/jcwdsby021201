import prisma from '@/prisma';
import { LocationQueryRequired } from '@/types/location.type';

export class LocationRepository {
  static async getProvinces(query?: LocationQueryRequired) {
    if (query && Object.keys(query).length !== 0) {
      return await prisma.province.findMany({
        where: { OR: [{ name: { contains: query.filter } }] },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.sortBy]: query.orderBy },
      });
    }
    return await prisma.province.findMany();
  }

  static async getCities(provinceId: number, query?: LocationQueryRequired) {
    if (query && Object.keys(query).length !== 0) {
      return await prisma.city.findMany({
        where: {
          provinceId: provinceId,
          OR: [{ name: { contains: query.filter } }],
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.sortBy]: query.orderBy },
      });
    }
    return await prisma.city.findMany({ where: { provinceId: provinceId } });
  }

  static async getProvinceForProfile(provinceId: number) {
    return await prisma.province.findMany({
      where: {
        id: provinceId,
      },
    });
  }

  static async getCityForProfile(cityId: number) {
    return await prisma.city.findMany({ where: { id: cityId } });
  }

  static async getProvinceById(provinceId: number) {
    return await prisma.province.findUnique({
      where: { id: provinceId },
    });
  }

  static async getCityById(cityId: number) {
    return await prisma.city.findUnique({ where: { id: cityId } });
  }

  static async countProvinces(filter: string) {
    return await prisma.province.count({
      where: { OR: [{ name: { contains: filter } }] },
    });
  }

  static async countCities(provinceId: number, filter: string) {
    return await prisma.city.count({
      where: {
        provinceId: provinceId,
        OR: [{ name: { contains: filter } }],
      },
    });
  }
}
