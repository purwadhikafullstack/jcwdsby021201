import { Prisma } from '@prisma/client';
import prisma from '@/prisma';

export class UserRepository {
  static async findUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  static async createUser(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    });
  }

  static async updateUserByEmail(email: string, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { email },
      data,
    });
  }

  static async deleteUserByEmail(email: string) {
    return await prisma.user.delete({ where: { email } });
  }
}
