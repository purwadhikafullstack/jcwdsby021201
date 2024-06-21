import { Prisma, PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { SALT } from '../src/config';
import { users } from './data/users';
import { categories } from './data/categories';

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

  for (const category of categories) {
    const categoryData: Prisma.CategoryCreateInput = {
      ...category,
    };
    await prisma.category.create({ data: categoryData });
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
