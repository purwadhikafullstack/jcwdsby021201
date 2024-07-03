// backend/cron/orderCron.ts

import { OrderRepository } from '@/repositories/order.repository';
import cron from 'node-cron';

export function startOrderCronJobs() {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const canceledCount = await OrderRepository.cancelExpiredOrders();
      console.log(
        `[${new Date().toISOString()}] Canceled ${canceledCount} expired orders`,
      );
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Error canceling expired orders:`,
        error,
      );
    }
  });

  console.log('Order cron jobs started');
}
