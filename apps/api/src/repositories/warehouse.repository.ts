import { Prisma } from '@prisma/client';
import prisma from '@/prisma';

export class WarehouseRepository {
  static async createWarehouse(data: Prisma.WarehouseCreateInput) {
    await prisma.warehouse.create({ data });
  }

  static async getWarehouses(
    page: number,
    limit: number,
    filter: string,
    sortBy: string,
    orderBy: string,
  ) {
    return await prisma.warehouse.findMany({
      where: {
        OR: [
          { user: { username: { contains: filter } } },
          { name: { contains: filter } },
          { address: { contains: filter } },
          { postalCode: { contains: filter } },
          { province: { name: { contains: filter } } },
          { city: { name: { contains: filter } } },
        ],
      },
      include: {
        province: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        user: { select: { id: true, username: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: orderBy },
    });
  }

  static async countWarehouses(filter: string) {
    return await prisma.warehouse.count({
      where: {
        OR: [
          { user: { username: { contains: filter } } },
          { name: { contains: filter } },
          { address: { contains: filter } },
          { postalCode: { contains: filter } },
          { province: { name: { contains: filter } } },
          { city: { name: { contains: filter } } },
        ],
      },
    });
  }

  static async findWarehouseById(id: number) {
    return await prisma.warehouse.findUnique({
      where: { id },
      include: {
        province: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        user: { select: { id: true, username: true } },
      },
    });
  }

  static async deleteWarehouseById(id: number) {
    await prisma.warehouse.delete({ where: { id } });
  }

  static async updateWarehouseById(
    id: number,
    data: Prisma.WarehouseUpdateInput,
  ) {
    await prisma.warehouse.update({ where: { id }, data });
  }

  static async findNearestWarehouse(body: any) {
    const { latitude, longitude } = body;

    // Fungsi untuk menghitung jarak menggunakan formula Haversine
    function getDistance(
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number,
    ) {
      if (lat2 === null || lon2 === null) return Infinity;

      const R = 6371; // Radius bumi dalam km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Jarak dalam km
    }

    const warehouses = await prisma.warehouse.findMany({
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        city: true,
      },
    });

    if (warehouses.length === 0) {
      throw new Error('No warehouses found');
    }

    const validWarehouses = warehouses.filter(
      (w) => w.latitude !== null && w.longitude !== null,
    );

    if (validWarehouses.length === 0) {
      throw new Error('No warehouses with valid coordinates found');
    }

    let nearestWarehouse = validWarehouses[0];
    let shortestDistance = getDistance(
      latitude,
      longitude,
      nearestWarehouse.latitude,
      nearestWarehouse.longitude,
    );

    for (let i = 1; i < validWarehouses.length; i++) {
      const distance = getDistance(
        latitude,
        longitude,
        validWarehouses[i].latitude,
        validWarehouses[i].longitude,
      );
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestWarehouse = validWarehouses[i];
      }
    }

    return {
      warehouseId: nearestWarehouse.id,
      name: nearestWarehouse.name,
      distance: shortestDistance,
      city: nearestWarehouse.city,
      latitude: nearestWarehouse.latitude,
      longitude: nearestWarehouse.longitude,
    };
  }

  static async findWarehouseByUserId(id: number) {
    return await prisma.warehouse.findUnique({
      where: { userId: id },
      include: {
        province: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        user: { select: { id: true, username: true } },
      },
    });
  }
}
