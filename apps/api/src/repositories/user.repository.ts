import { Prisma } from '@prisma/client';
import prisma from '@/prisma';
import { CredentialBody, UpdateEmailBody } from '@/types/user.type';

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

  static async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        warehouse: { select: { id: true, name: true } },
      },
    });
  }

  static async changeUserProfileCredential(id: number, body: CredentialBody) {
    const { password, username } = body;
    return await prisma.user.update({
      where: { id },
      data: {
        username,
        password,
      },
    });
  }

  static async changeEmailUser(
    id: number,
    body: UpdateEmailBody,
    token: string,
  ) {
    const { email } = body;

    return await prisma.user.update({
      where: { id },
      data: {
        email: email,
        isVerified: false,
        jwtToken: token,
      },
    });
  }

  static async changeProfilPicture(id: number, file: Express.Multer.File) {
    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        image: `/assets/profile/${file.filename}`,
      },
    });
  }

  static async activationAccount(email: string, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { email },
      data,
    });
  }

  static async getWarehouseAdmins(
    page: number,
    limit: number,
    filter: string,
    sortBy: string,
    orderBy: string,
  ) {
    return await prisma.user.findMany({
      where: {
        role: 'ADMIN',
        OR: [
          { username: { contains: filter } },
          { email: { contains: filter } },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: orderBy },
    });
  }

  static async countWarehouseAdmins(filter: string) {
    return await prisma.user.count({
      where: {
        role: 'ADMIN',
        OR: [
          { username: { contains: filter } },
          { email: { contains: filter } },
        ],
      },
    });
  }

  static async findUserByUsername(username: string) {
    return await prisma.user.findUnique({ where: { username } });
  }

  static async getUsersWithoutSuperAdmin(
    page: number,
    limit: number,
    filter: string,
    sortBy: string,
    orderBy: string,
  ) {
    return await prisma.user.findMany({
      where: {
        role: { not: 'SUPER_ADMIN' },
        OR: [
          { username: { contains: filter } },
          { email: { contains: filter } },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: orderBy },
    });
  }

  static async countUsersWithoutSuperAdmin(filter: string) {
    return await prisma.user.count({
      where: {
        role: { not: 'SUPER_ADMIN' },
        OR: [
          { username: { contains: filter } },
          { email: { contains: filter } },
        ],
      },
    });
  }

  static async deleteUserById(id: number) {
    return await prisma.user.delete({ where: { id } });
  }

  static async updateUserById(id: number, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({ where: { id }, data });
  }
}
