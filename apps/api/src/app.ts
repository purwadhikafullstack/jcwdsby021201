import express, { json, urlencoded, Express, Request, Response } from 'express';
import cors from 'cors';
import { PORT } from '@/config';
import { join } from 'path';
import { ErrorMiddleware } from '@/middlewares/error.middleware';
import { SampleRouter } from '@/routers/sample.router';
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
// import { InventoryRouter } from '@/routers/inventory.router';

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
    const sampleRouter = new SampleRouter();
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
    // const inventories = new InventoryRouter();

    this.app.get('/', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student !`);
    });

    this.app.use('/', express.static(join(__dirname, '../public')));
    this.app.use('/samples', sampleRouter.getRouter());
    this.app.use('/auth', authRouter.getRouter());
    this.app.use('/categories', categoryRouter.getRouter());
    this.app.use('/users', userRouter.getRouter());
    this.app.use('/addresses', addressRouter.getRouter());
    this.app.use('/locations', locationRouter.getRouter());
    this.app.use('/products', productRouter.getRouter());
    this.app.use('/warehouses', warehouseRouter.getRouter());
    this.app.use('/carts', cartRouter.getRouter());
    this.app.use('/checkouts', checkoutRouter.getRouter());
    this.app.use('/orders', orderRouter.getRouter());
    // this.app.use('/inventories', inventories.getRouter());
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
