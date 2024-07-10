import { OrderRepository } from '@/repositories/order.repository';
import cron from 'node-cron';

export function startOrderCronJobs() {
  cron.schedule('*/60 * * * *', async () => {
    try {
      const canceledCount = await OrderRepository.cancelExpiredOrders();
      console.log(`Canceled ${canceledCount} expired orders`);
    } catch (error) {
      console.error(`Error canceling expired orders:`, error);
    }
  });

  cron.schedule('*/60 * * * *', async () => {
    try {
      const receivedCount = await OrderRepository.autoReceiveOrders();
      console.log(`Auto-received ${receivedCount} orders`);
    } catch (error) {
      console.error(`Error auto-receiving orders:`, error);
    }
  });

  console.log('====[CRON JOBS STARTED]====');
}
