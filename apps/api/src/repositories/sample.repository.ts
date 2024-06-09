import prisma from '@/prisma';
import { SampleBody } from '@/types/sample.type';

export class SampleRepository {
  static async getSample() {
    return await prisma.sample.findMany();
  }

  static async getSampleById(id: number) {
    return await prisma.sample.findUnique({ where: { id } });
  }

  static async createSample(body: SampleBody) {
    return await prisma.sample.create({ data: body });
  }

  static async getSampleByCode(code: string) {
    return await prisma.sample.findUnique({ where: { code } });
  }
}
