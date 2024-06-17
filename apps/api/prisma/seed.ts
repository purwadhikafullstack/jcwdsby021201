import { Prisma, PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { users } from './data/users';
import { SALT } from '../src/config';

const prisma = new PrismaClient();

const seed = async () => {
  const hashedPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(Number(SALT));
    return bcrypt.hashSync(password, salt);
  };

  for (const user of users) {
    const userData: Prisma.UserCreateInput = {
      ...user,
      password: hashedPassword(user.password),
      role: user.role as Role,
    };
    await prisma.user.create({ data: userData });
  }
};

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
