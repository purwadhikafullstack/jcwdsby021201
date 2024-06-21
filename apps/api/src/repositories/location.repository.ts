import prisma from '@/prisma';

export class LocationRepository {
  static async getProvinces() {
    return await prisma.province.findMany();
  }

  static async getCities(provinceId: number) {
    return await prisma.city.findMany({
      where: {
        provinceId: provinceId,
      },
    });
  }

  static async getProvinceForProfile(provinceId: number) {
    return await prisma.province.findMany({
      where: {
        provinceId: provinceId,
      },
    });
  }

  static async getCityForProfile(cityId: number) {
    return await prisma.city.findMany({
      where: {
        cityId: cityId,
      },
    });
  }
}
