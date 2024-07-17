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

    // ini alamat sekarang
    const currentAddress = await prisma.address.findUnique({
      where: {
        id: addressId,
        userId: id,
      },
    });

    if (!currentAddress) {
      throw new Error('Address not found');
    }

    let updateData = {
      name,
      address,
      cityId,
      provinceId,
      postalCode,
      latitude,
      longitude,
      isPrimary,
    };

    // kalo yang di update menjadi primary address :
    if (isPrimary && !currentAddress.isPrimary) {
      // disini yang lain jadi flase
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
    // kalo kondisinya si user ga update tapi ga masukin primary sama sekali
    else if (!isPrimary && currentAddress.isPrimary) {
      // bikinin alamat lain jadi primary
      const otherAddress = await prisma.address.findFirst({
        where: {
          userId: id,
          NOT: {
            id: addressId,
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      if (otherAddress) {
        await prisma.address.update({
          where: {
            id: otherAddress.id,
          },
          data: {
            isPrimary: true,
          },
        });
      } else {
        // jika engga ada alamat lain, biarin alamat ini tetap utama
        updateData.isPrimary = true;
      }
    }

    // update alamat
    const updatedAddress = await prisma.address.update({
      where: {
        id: addressId,
        userId: id,
      },
      data: updateData,
    });

    return updatedAddress;
  }
}
