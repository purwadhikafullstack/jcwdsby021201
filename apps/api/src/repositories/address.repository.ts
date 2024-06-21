import { Prisma } from '@prisma/client';
import prisma from '@/prisma';
import { AddressBody } from '@/types/address.type';

export class AddressRepository {
  static async getAddressById(id: number) {
    return await prisma.address.findMany({
      where: { userId: id },
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
    return await prisma.address.delete({
      where: {
        id: addressId,
        userId: id,
      },
    });
  }

  static async addAddress(id: number, body: AddressBody) {
    return await prisma.address.create({
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        province: body.province,
        postalCode: body.postalCode,
        userId: id,
        isPrimary: false,
      },
    });
  }

  static async updateAddress(id: number, addressId: number, body: AddressBody) {
    const { name, address, city, province, postalCode, isPrimary } = body;

    // Cari alamat lain dengan isPrimary: true untuk pengguna ini
    const existingPrimaryAddress = await prisma.address.findFirst({
      where: {
        userId: id,
        isPrimary: true,
        NOT: {
          id: addressId, // Tidak termasuk alamat yang sedang diupdate
        },
      },
    });

    // Jika ada alamat lain dengan isPrimary: true, atur menjadi false
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
        city: city,
        province: province,
        postalCode: postalCode,
        isPrimary: isPrimary,
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
