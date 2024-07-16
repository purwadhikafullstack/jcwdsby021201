import { Prisma } from '@prisma/client';
import prisma from '@/prisma';
import { AddressBody } from '@/types/address.type';

export class AddressRepository {
  static async getAddressById(id: number) {
    return await prisma.address.findMany({
      where: { userId: id, isDeleted: false },
    });
  }

  static async getAddressByAddressId(id: number, addressId: number) {
    return await prisma.address.findUnique({
      where: {
        id: addressId,
        userId: id,
      },
    });
  }

  static async deleteAddressByAddressId(id: number, addressId: number) {
    return await prisma.address.update({
      where: {
        id: addressId,
        userId: id,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  static async addAddress(id: number, body: AddressBody) {
    const existingAddresses = await prisma.address.findMany({
      where: {
        userId: id,
      },
    });

    const isPrimary = existingAddresses.length === 0;

    return await prisma.address.create({
      data: {
        name: body.name,
        address: body.address,
        cityId: body.cityId,
        provinceId: body.provinceId,
        postalCode: body.postalCode,
        userId: id,
        isPrimary: isPrimary,
        latitude: body.latitude,
        longitude: body.longitude,
      },
    });
  }

  static async updateAddress(id: number, addressId: number, body: AddressBody) {
    const {
      name,
      address,
      cityId,
      provinceId,
      postalCode,
      isPrimary,
      latitude,
      longitude,
    } = body;

    // cari alamat lain dengan isPrimary true
    const existingPrimaryAddress = await prisma.address.findFirst({
      where: {
        userId: id,
        isPrimary: true,
        NOT: {
          id: addressId, // tidak termasuk alamat yang sedang diupdate
        },
      },
    });

    // jika ada alamat lain dengan isPrimary: true, atur menjadi false
    if (existingPrimaryAddress) {
      await prisma.address.update({
        where: {
          id: existingPrimaryAddress.id,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Perbarui data alamat
    const updatedAddress = await prisma.address.update({
      where: {
        id: addressId,
        userId: id,
      },
      data: {
        name: name,
        address: address,
        cityId: cityId,
        provinceId: provinceId,
        postalCode: postalCode,
        isPrimary: isPrimary,
        latitude: latitude,
        longitude: longitude,
      },
    });

    // Setelah memperbarui data, pastikan hanya ada satu alamat dengan isPrimary: true
    if (isPrimary) {
      await prisma.address.updateMany({
        where: {
          userId: id,
          isPrimary: true,
          NOT: {
            id: addressId,
          },
        },
        data: {
          isPrimary: false,
        },
      });
    }

    return updatedAddress;
  }
}
