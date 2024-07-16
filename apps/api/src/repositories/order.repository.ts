import prisma from '@/prisma';
import { WarehouseRepository } from './warehouse.repository';
import {
  CancellationSource,
  CancellationStatus,
  CheckoutBody,
} from '@/types/order.type';

export class OrderRepository {
  static async handleCheckout(id: number, body: CheckoutBody) {
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

    const expirePayment = new Date(Date.now() + 2 * 60 * 1000); //di 2 menit dulu

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
              description: `Stock OUT ${productInfo?.name} from ${warehouseName?.name} by ${usernameForDesc?.username ? usernameForDesc.username : 'Unknown'}, qty : ${product.quantity}`,
              productWarehouseId: productWarehouse.id,
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
          // ini sudah melakukan pencatatan jurnalnya juga
          await this.cancelOrder(
            order.cart.userId,
            order.id,
            CancellationStatus.SYSTEM,
          );
          canceledCount++;
        } catch (error) {
          console.error(`Failed to cancel order ${order.id}:`, error);
        }
      }

      return canceledCount;
    });
  }

  static async cancelOrder(
    id: number,
    orderId: number,
    source: CancellationSource,
  ) {
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
          cancellationSource: source,
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

      for (const orderProduct of orderProducts) {
        // baliki stock ke gudang
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

        // buat jurnal mutationnya :
        await tx.journalMutation.create({
          data: {
            quantity: orderProduct.quantity,
            transactionType: 'IN',
            description: 'Stock returned due to order cancellation',
            productWarehouseId: productWarehouse.id,
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
    const now = new Date();
    const shippedAtLimit = new Date(Date.now() + 2 * 60 * 1000); //di 2 menit dulu
    //cari order yang sesuai
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

    // update order tersebut
    return await prisma.order.update({
      where: {
        id: orderId, // Atau bisa juga menggunakan cartId: order.cartId
      },
      data: {
        paymentProof: `/assets/payment-proof/${file.filename}`,
        paymentStatus: 'SHIPPED',
        shippedAt: shippedAtLimit,
      },
    });
  }

  static async checkAndMutateStock(
    warehouseId: number,
    products: Array<{ productId: number; quantity: number }>,
    latitude: number,
    longitude: number,
  ) {
    const result = await prisma.$transaction(async (tx) => {
      //mapping permintaan produknya apa saja :
      for (const product of products) {
        // data gudang yang didapatkan untuk gudang terdekat
        let stockInWarehouse = await tx.productWarehouse.findFirst({
          where: { productId: product.productId, warehouseId: warehouseId },
          include: {
            product: true,
            warehouse: true,
          },
        });
        // jumlah permintaan
        let remainingQuantity = product.quantity;

        // stock yang ada di gudang sekarang
        const availableStock = stockInWarehouse ? stockInWarehouse.stock : 0;
        // kurangin dulu
        const deficitQuantity = remainingQuantity - availableStock;

        // kalo kurang stock digudang yang terdekat, maka lakukan mutasi :
        if (deficitQuantity > 0) {
          //cari gudang yang memiliki stock untuk produk tertentu
          const warehousesWithStock = await tx.productWarehouse.findMany({
            where: {
              productId: product.productId,
              stock: { gt: 0 },
              NOT: { warehouseId: warehouseId },
            },
            include: {
              product: true,
              warehouse: true,
            },
          });

          // setelah itu dapet gudang yang memiliki stock, maka urutkan dari gudang terdekat
          const sortedWarehouses = warehousesWithStock.sort((a, b) => {
            const distanceA = WarehouseRepository.getDistance(
              latitude,
              longitude,
              a.warehouse.latitude,
              a.warehouse.longitude,
            );
            const distanceB = WarehouseRepository.getDistance(
              latitude,
              longitude,
              b.warehouse.latitude,
              b.warehouse.longitude,
            );
            return distanceA - distanceB;
          });
          let currentDeficit = deficitQuantity;
          // buatin mutasi dan jurnal keluar masuk untuk setiap gudang
          for (const warehouseWithStock of sortedWarehouses) {
            if (currentDeficit <= 0) break;
            //cari jumlah yang di tranfer
            const transferQuantity = Math.min(
              warehouseWithStock.stock,
              currentDeficit,
            );
            // buatin jurnal mutasi
            const mutation = await tx.mutation.create({
              data: {
                stockRequest: transferQuantity,
                stockProcess: transferQuantity,
                sourceWarehouseId: warehouseId,
                destinationWarehouseId: warehouseWithStock.warehouseId,
                status: 'APPROVED',
                note: `Stock transfer for order fulfillment`,
                productId: product.productId,
              },
            });

            await tx.journalMutation.create({
              data: {
                quantity: transferQuantity,
                transactionType: 'OUT',
                description: `Stock OUT ${warehouseWithStock.product.name} from ${warehouseWithStock.warehouse.name} to ${stockInWarehouse?.warehouse.name}, qty : ${transferQuantity} for ORDER. (Automatic Mutation)`, // UPDATED
                productWarehouseId: warehouseWithStock.id,
                warehouseId: warehouseWithStock.warehouseId,
                refMutationId: mutation.id,
              },
            });


            // terus update ke warehouse terdekat
            await tx.productWarehouse.update({
              where: { id: warehouseWithStock.id },
              data: { stock: { decrement: transferQuantity } },
            });
            if (stockInWarehouse) {
              await tx.productWarehouse.update({
                where: { id: stockInWarehouse.id },
                data: { stock: { increment: transferQuantity } },
              });
            } else {
              stockInWarehouse = await tx.productWarehouse.create({
                data: {
                  stock: transferQuantity,
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
                quantity: transferQuantity,
                transactionType: 'IN',
                description: `Stock IN ${stockInWarehouse.product.name} to ${stockInWarehouse.warehouse.name} from ${warehouseWithStock.warehouse.name}, qty : ${transferQuantity} for ORDER. (Automatic Mutation)`, // UPDATED
                productWarehouseId: stockInWarehouse.id,
                warehouseId: warehouseId,
                refMutationId: mutation.id,
              },
            });

            // IN inventory
            await tx.journalMutation.create({
              data: {
                quantity: transferQuantity,
                transactionType: 'IN',
                description: `Stock IN ${stockInWarehouse.product.name} to ${stockInWarehouse.warehouse.name}, qty : ${transferQuantity} `, // UPDATED
                productWarehouseId: stockInWarehouse.id,
                refMutationId: mutation.id,
              },
            });

            //setelah setiap proses pencatatan jurnal, kurangin --
            currentDeficit -= transferQuantity;
            // remainingQuantity -= transferQuantity;
          }

          // jika ga cukup :
          if (currentDeficit > 0) {
            throw new Error(
              `Not enough stock for product ${product.productId}`,
            );
          } else {
            console.log(` No transfer needed.`);
          }
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

  static async autoReceiveOrders() {
    const now = new Date();

    return await prisma.$transaction(async (tx) => {
      const ordersToAutoReceive = await tx.order.findMany({
        where: {
          paymentStatus: 'SHIPPED',
          //ini seharusnya pake shippedAtnya :
          shippedAt: {
            lt: now,
          },
        },
      });

      let autoReceivedCount = 0;
      for (const order of ordersToAutoReceive) {
        try {
          await tx.order.update({
            where: {
              id: order.id,
            },
            data: {
              paymentStatus: 'DELIVERED',
            },
          });
          autoReceivedCount++;
        } catch (error) {
          console.error(`Failed to auto-receive order ${order.id}:`, error);
        }
      }

      return autoReceivedCount;
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

  static async getOrderDetailByOrderId(id: number, orderId: number) {
    return await prisma.order.findUnique({
      where: {
        id: orderId,
        cart: {
          userId: id,
        },
      },
      include: {
        orderProducts: {
          select: {
            price: true,
            total: true,
            quantity: true,
            product: {
              select: {
                name: true,
                pictures: {
                  select: {
                    url: true,
                  },
                },
              },
            },
          },
        },
        address: {
          select: {
            address: true,
          },
        },
        cart: {
          select: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
  }

  static async countToCancelOrder(id: number, filter: string) {
    return await prisma.order.count({
      where: {
        cart: { userId: id },
        paymentStatus: 'CANCELED',
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

  static async getCancelOrder(
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
        paymentStatus: 'CANCELED',
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
}
