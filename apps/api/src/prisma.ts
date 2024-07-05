import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function main() {
  prisma.$use(async (params, next) => {
    if (params.model == 'ProductWarehouse') {
      if (params.action == 'delete') {
        params.action = 'update';
        params.args['data'] = { stock: 0, deleted: true };
      }

      if (params.action == 'deleteMany') {
        params.action = 'updateMany';
        if (params.args.data != undefined) {
          params.args.data['stock'] = 0;
          params.args.data['deleted'] = true;
        } else {
          params.args['data'] = { stock: 0, deleted: true };
        }
      }
    }

    return next(params);
  });
}

main();

export default prisma;
