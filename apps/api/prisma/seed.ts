import { Prisma, PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { users } from './data/users';
import { SALT, RAJAONGKIR_API_KEY, RAJAONGKIR_API_URL } from '../src/config';

const prisma = new PrismaClient();

const hashedPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(Number(SALT));
  return bcrypt.hashSync(password, salt);
};

const fetchProvinces = async () => {
  const response = await axios.get(`${RAJAONGKIR_API_URL}/province`, {
    headers: {
      key: RAJAONGKIR_API_KEY,
    },
  });
  return response.data.rajaongkir.results;
};

const fetchCities = async () => {
  const response = await axios.get(`${RAJAONGKIR_API_URL}/city`, {
    headers: {
      key: RAJAONGKIR_API_KEY,
    },
  });
  return response.data.rajaongkir.results;
};

const seedUsers = async () => {
  for (const user of users) {
    const userData: Prisma.UserCreateInput = {
      ...user,
      password: hashedPassword(user.password),
      role: user.role as Role,
    };
    await prisma.user.create({ data: userData });
  }
};

const seedProvinces = async (provinces: any[]) => {
  for (const province of provinces) {
    await prisma.province.create({
      data: {
        provinceId: Number(province.province_id),
        name: province.province,
      },
    });
  }
};

const seedCities = async (cities: any[]) => {
  for (const city of cities) {
    await prisma.city.create({
      data: {
        cityId: Number(city.city_id),
        name: city.city_name,
        province: {
          connect: {
            provinceId: Number(city.province_id),
          },
        },
      },
    });
  }
};

const seed = async () => {
  try {
    
    const provinces = await fetchProvinces();
    const cities = await fetchCities();
    
    await seedUsers();
    await seedProvinces(provinces);
    await seedCities(cities);
    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
