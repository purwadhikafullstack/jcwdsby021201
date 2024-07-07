import { OrderRepository } from '@/repositories/order.repository';
import cron from 'node-cron';

export function startOrderCronJobs() {
  cron.schedule('*/60 * * * *', async () => {
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

  cron.schedule('*/60 * * * *', async () => {
    try {
      const receivedCount = await OrderRepository.autoReceiveOrders();
      console.log(
        `[${new Date().toISOString()}] Auto-received ${receivedCount} orders`,
      );
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Error auto-receiving orders:`,
        error,
      );
    }
  });

  console.log('Order cron jobs started');
}
