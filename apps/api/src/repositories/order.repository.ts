import prisma from '@/prisma';
import { MutationStatus, PaymentStatus, TransactionType } from '@prisma/client';
import { WarehouseRepository } from './warehouse.repository';

export class OrderRepository {
  static async handleCheckout(id: number, body: any) {
    const {
      name,
      paymentStatus,
      shippingCost,
      total,
      paymentMethod,
      warehouseId,
      cartId,
      addressId,
      orderProducts,
      latitude,
      longitude,
    } = body;

    const expirePayment = new Date(Date.now() + 60 * 60 * 1000); //di 5 menit dulu

    return await prisma.$transaction(async (tx) => {
      //cari tahu nama gudangnya:

      const warehouseName = await WarehouseRepository.findNearestWarehouse({
        latitude,
        longitude,
      });

      const usernameForDesc = await tx.user.findUnique({
        where: {
          id,
        },
      });

      //buat order baru :
      const order = await tx.order.create({
        data: {
          name,
          paymentStatus,
          shippingCost,
          total,
          paymentMethod,
          expirePayment,
          warehouseId,
          cartId,
          addressId,
        },
      });

      // catat di orderProduct tabel :
      await tx.orderProduct.createMany({
        data: orderProducts.map((product: any) => ({
          ...product,
          orderId: order.id,
        })),
      });

      // update stock tiap produk :
      for (const product of orderProducts) {
        await tx.productWarehouse.updateMany({
          where: {
            productId: product.productId,
            warehouseId,
          },
          data: {
            stock: {
              decrement: product.quantity,
            },
          },
        });

        //nambah nama buat data produk
        const productInfo = await tx.product.findUnique({
          where: {
            id: product.productId,
          },
          select: { name: true },
        });

        const productWarehouse = await tx.productWarehouse.findFirst({
          where: {
            productId: product.productId,
            warehouseId,
          },
        });

        //buat jurnal keluar bahwa item sedang di order:
        if (productWarehouse) {
          await tx.journalMutation.create({
            data: {
              quantity: product.quantity,
              transactionType: 'OUT',
              description: `Stock out ${productInfo?.name} from ${warehouseName?.name} by ${usernameForDesc?.username ? usernameForDesc.username : 'Unknown'}, qty : ${product.quantity}`,
              productWarehouseId: productWarehouse.id,
              warehouseId,
            },
          });
        }
      }
      // buat cart menjadi inActive
      await tx.cart.update({
        where: { id: cartId },
        data: { isActive: false },
      });

      return order;
    });
  }

  static async cancelExpiredOrders() {
    const now = new Date();

    return await prisma.$transaction(async (tx) => {
      const expiredOrders = await tx.order.findMany({
        where: {
          paymentStatus: 'UNPAID',
          paymentProof: null,
          expirePayment: {
            lt: now,
          },
        },
        include: {
          cart: true,
        },
      });

      let canceledCount = 0;
      for (const order of expiredOrders) {
        try {
          await this.cancelOrder(order.cart.userId, order.id);
          canceledCount++;
        } catch (error) {
          console.error(`Failed to cancel order ${order.id}:`, error);
        }
      }

      return canceledCount;
    });
  }

  static async cancelOrder(id: number, orderId: number) {
    return await prisma.$transaction(async (tx) => {
      //update order
      const updatedOrder = await tx.order.update({
        where: {
          id: Number(orderId),
          paymentStatus: 'UNPAID',
          paymentProof: null,
          cart: {
            userId: id,
          },
        },
        data: {
          paymentStatus: 'CANCELED',
        },
      });

      if (!updatedOrder) {
        throw new Error('Order not found OR cannot be cancelled');
      }

      // balikin stock produk ke warehouse
      const orderProducts = await tx.orderProduct.findMany({
        where: {
          orderId: updatedOrder.id,
        },
        include: {
          product: true,
        },
      });

      // for (const orderProduct of orderProducts) {
      //   // balikin stock produk ke warehouse
      //   await tx.productWarehouse.updateMany({
      //     where: {
      //       productId: orderProduct.productId,
      //       warehouseId: updatedOrder.warehouseId,
      //     },
      //     data: {
      //       stock: {
      //         increment: orderProduct.quantity,
      //       },
      //     },
      //   });

      //   // jurnal keluar masuk
      //   await tx.journalProduct.create({
      //     data: {
      //       quantity: orderProduct.quantity,
      //       transactionType: 'IN',
      //       description: 'Stock entered due to cancel order',
      //       productWarehouseId: (await tx.productWarehouse.findFirst({
      //         where: {
      //           productId: orderProduct.productId,
      //           warehouseId: updatedOrder.warehouseId,
      //         },
      //       }))!.id,
      //     },
      //   });
      // }
      for (const orderProduct of orderProducts) {
        // Return stock to warehouse
        const productWarehouse = await tx.productWarehouse.findFirst({
          where: {
            productId: orderProduct.productId,
            warehouseId: updatedOrder.warehouseId,
          },
        });

        if (!productWarehouse) {
          throw new Error('Product not found in warehouse');
        }

        await tx.productWarehouse.update({
          where: {
            id: productWarehouse.id,
          },
          data: {
            stock: {
              increment: orderProduct.quantity,
            },
          },
        });

        // Create journal mutation
        await tx.journalMutation.create({
          data: {
            quantity: orderProduct.quantity,
            transactionType: 'IN',
            description: 'Stock returned due to order cancellation',
            productWarehouseId: productWarehouse.id,
            warehouseId: updatedOrder.warehouseId,
          },
        });
      }

      return updatedOrder;
    });
  }

  static async uploadPaymentProof(
    id: number,
    orderId: number,
    file: Express.Multer.File,
  ) {
    // Pertama, cari order yang sesuai
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        cart: {
          userId: id,
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Kemudian, update order tersebut
    return await prisma.order.update({
      where: {
        id: orderId, // Atau bisa juga menggunakan cartId: order.cartId
      },
      data: {
        paymentProof: `/assets/payment-proof/${file.filename}`,
        paymentStatus: 'PAID',
      },
    });
  }

  static async checkAndMutateStock(
    warehouseId: number,
    products: Array<{ productId: number; quantity: number }>,
  ) {
    const result = await prisma.$transaction(async (tx) => {
      for (const product of products) {
        let stockInWarehouse = await tx.productWarehouse.findFirst({
          where: { productId: product.productId, warehouseId: warehouseId },
          include: {
            product: true,
            warehouse: true,
          },
        });

        if (!stockInWarehouse || stockInWarehouse.stock < product.quantity) {
          // cari gudang lain
          const warehouseWithStock = await tx.productWarehouse.findFirst({
            where: {
              productId: product.productId,
              stock: { gte: product.quantity },
              NOT: { warehouseId: warehouseId },
            },
            include: {
              product: true,
              warehouse: true,
            },
            orderBy: { stock: 'desc' },
          });

          //belum diganti namanya jadi product.name
          if (!warehouseWithStock) {
            throw new Error(
              `Not enough stock for product ${product.productId}`,
            );
          }

          // buatin jurnal mutasi
          const mutation = await tx.mutation.create({
            data: {
              stockRequest: product.quantity,
              stockProcess: product.quantity,
              sourceWarehouseId: warehouseWithStock.warehouseId,
              destinationWarehouseId: warehouseId,
              status: 'COMPLETED',
              note: `Stock transfer for order fulfillment`,
              productId: product.productId
            },
          });

          await tx.journalMutation.create({
            data: {
              quantity: product.quantity,
              transactionType: TransactionType.OUT,
              description: `Stock OUT ${stockInWarehouse?.product.name} from ${warehouseWithStock.warehouse.name} to ${stockInWarehouse?.warehouse.name}, qty : ${product.quantity} for ORDER.`,
              productWarehouseId: warehouseWithStock.id,
              warehouseId: warehouseWithStock.warehouseId,
              refMutationId: mutation.id,
            },
          });

          // terus update ke warehouse terdekat
          await tx.productWarehouse.update({
            where: { id: warehouseWithStock.id },
            data: { stock: { decrement: product.quantity } },
          });

          if (stockInWarehouse) {
            await tx.productWarehouse.update({
              where: { id: stockInWarehouse.id },
              data: { stock: { increment: product.quantity } },
            });
          } else {
            stockInWarehouse = await tx.productWarehouse.create({
              data: {
                stock: product.quantity,
                productId: product.productId,
                warehouseId: warehouseId,
              },
              include: {
                product: true,
                warehouse: true,
              },
            });
          }

          // jurnal produk
          await tx.journalMutation.create({
            data: {
              quantity: product.quantity,
              transactionType: 'IN',
              description: `Stock IN ${stockInWarehouse?.product.name} FROM ${warehouseWithStock.warehouse.name}, qty : ${product.quantity} for ORDER.`,
              productWarehouseId: stockInWarehouse?.id,
              warehouseId: warehouseId,
              refMutationId: mutation.id,
            },
          });
        }
      }
      return true;
    });

    return result;
  }

  static async receivedOrder(id: number, orderId: number) {
    return await prisma.order.updateMany({
      where: {
        id: orderId,
        cart: {
          userId: id,
        },
        paymentStatus: 'SHIPPED',
      },
      data: {
        paymentStatus: 'DELIVERED',
      },
    });
  }

  static async getToPayOrder(
    id: number,
    page: number,
    limit: number,
    filter: string,
    sortBy: string,
    orderBy: string,
  ) {
    const orders = await prisma.order.findMany({
      where: {
        cart: {
          userId: id,
        },
        paymentStatus: 'UNPAID',
        OR: [
          { name: { contains: filter } },
          {
            orderProducts: {
              some: {
                product: {
                  name: { contains: filter },
                },
              },
            },
          },
        ],
      },
      include: {
        orderProducts: {
          include: {
            product: {
              select: {
                name: true,
                pictures: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: orderBy },
    });
    return orders.map((order) => {
      const productPhoto =
        order.orderProducts[0]?.product.pictures[0]?.url || null;

      return {
        ...order,
        product: order.orderProducts.map((product) => product.product.name),
        image: productPhoto,
        orderProducts: undefined,
      };
    });
  }
  static async countToPayOrder(id: number, filter: string) {
    return await prisma.order.count({
      where: {
        cart: { userId: id },
        paymentStatus: 'UNPAID',
        OR: [
          { name: { contains: filter } },
          {
            orderProducts: {
              some: {
                product: {
                  name: { contains: filter },
                },
              },
            },
          },
        ],
      },
    });
  }

  static async getToShipOrder(
    id: number,
    page: number,
    limit: number,
    filter: string,
    sortBy: string,
    orderBy: string,
  ) {
    const orders = await prisma.order.findMany({
      where: {
        cart: {
          userId: id,
        },
        paymentStatus: 'SHIPPED',
        OR: [
          { name: { contains: filter } },
          {
            orderProducts: {
              some: {
                product: {
                  name: { contains: filter },
                },
              },
            },
          },
        ],
      },
      include: {
        orderProducts: {
          include: {
            product: {
              select: {
                name: true,
                pictures: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: orderBy },
    });
    return orders.map((order) => {
      const productPhoto =
        order.orderProducts[0]?.product.pictures[0]?.url || null;

      return {
        ...order,
        product: order.orderProducts.map((product) => product.product.name),
        image: productPhoto,
        orderProducts: undefined,
      };
    });
  }

  static async countToShipOrder(id: number, filter: string) {
    return await prisma.order.count({
      where: {
        cart: { userId: id },
        paymentStatus: 'SHIPPED',
        OR: [
          { name: { contains: filter } },
          {
            orderProducts: {
              some: {
                product: {
                  name: { contains: filter },
                },
              },
            },
          },
        ],
      },
    });
  }

  static async getToReceive(
    id: number,
    page: number,
    limit: number,
    filter: string,
    sortBy: string,
    orderBy: string,
  ) {
    const orders = await prisma.order.findMany({
      where: {
        cart: {
          userId: id,
        },
        paymentStatus: 'DELIVERED',
        OR: [
          { name: { contains: filter } },
          {
            orderProducts: {
              some: {
                product: {
                  name: { contains: filter },
                },
              },
            },
          },
        ],
      },
      include: {
        orderProducts: {
          include: {
            product: {
              select: {
                name: true,
                pictures: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: orderBy },
    });
    return orders.map((order) => {
      const productPhoto =
        order.orderProducts[0]?.product.pictures[0]?.url || null;

      return {
        ...order,
        product: order.orderProducts.map((product) => product.product.name),
        image: productPhoto,
        orderProducts: undefined,
      };
    });
  }

  static async countToReceiveOrder(id: number, filter: string) {
    return await prisma.order.count({
      where: {
        cart: { userId: id },
        paymentStatus: 'DELIVERED',
        OR: [
          { name: { contains: filter } },
          {
            orderProducts: {
              some: {
                product: {
                  name: { contains: filter },
                },
              },
            },
          },
        ],
      },
    });
  }
}
