import express, { json, urlencoded, Express, Request, Response } from 'express';
import cors from 'cors';
import { PORT } from '@/config';
import { join } from 'path';
import { ErrorMiddleware } from '@/middlewares/error.middleware';
import { AuthRouter } from '@/routers/auth.router';
import { CategoryRouter } from '@/routers/category.router';
import { UserRouter } from '@/routers/user.router';
import { AddressRouter } from '@/routers/address.router';
import { LocationRouter } from '@/routers/location.router';
import { ProductRouter } from '@/routers/product.router';
import { WarehouseRouter } from '@/routers/warehouse.router';
import { CartRouter } from '@/routers/cart.router';
import { CheckoutRouter } from '@/routers/checkout.router';
import { OrderRouter } from '@/routers/order.router';
import { startOrderCronJobs } from './cron/orderCron';
import { InventoryRouter } from '@/routers/inventory.router';
import { MutationRouter } from '@/routers/mutation.router';
import { AdminRouter } from '@/routers/admin.router';
import { WishlistRouter } from './routers/wishlist.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    this.app.use(ErrorMiddleware);
  }

  private routes(): void {
    const authRouter = new AuthRouter();
    const categoryRouter = new CategoryRouter();
    const userRouter = new UserRouter();
    const addressRouter = new AddressRouter();
    const locationRouter = new LocationRouter();
    const productRouter = new ProductRouter();
    const cartRouter = new CartRouter();
    const checkoutRouter = new CheckoutRouter();
    const orderRouter = new OrderRouter();
    const warehouseRouter = new WarehouseRouter();
    const inventoryRouter = new InventoryRouter();
    const mutationRouter = new MutationRouter();
    const adminRouter = new AdminRouter();
    const wishlistRouter = new WishlistRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student !`);
    });

    this.app.use('/api', express.static(join(__dirname, '../public')));
    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use('/api/categories', categoryRouter.getRouter());
    this.app.use('/api/users', userRouter.getRouter());
    this.app.use('/api/addresses', addressRouter.getRouter());
    this.app.use('/api/locations', locationRouter.getRouter());
    this.app.use('/api/products', productRouter.getRouter());
    this.app.use('/api/warehouses', warehouseRouter.getRouter());
    this.app.use('/api/carts', cartRouter.getRouter());
    this.app.use('/api/checkouts', checkoutRouter.getRouter());
    this.app.use('/api/orders', orderRouter.getRouter());
    this.app.use('/api/inventories', inventoryRouter.getRouter());
    this.app.use('/api/mutations', mutationRouter.getRouter());
    this.app.use('/api/admin', adminRouter.getRouter());
    this.app.use('/api/wishlists', wishlistRouter.getRouter());
  }

  private startCronJobs(): void {
    startOrderCronJobs();
  }

  public start(): void {
    this.startCronJobs();
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
