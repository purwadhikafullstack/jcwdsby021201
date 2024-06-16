import express, { json, urlencoded, Express, Request, Response } from 'express';
import cors from 'cors';
import { PORT } from './config';
import { join } from 'path';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { SampleRouter } from './routers/sample.router';
import { AuthRouter } from '@/routers/auth.router';

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

    this.app.get('/', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student !`);
    });

    this.app.use('/', express.static(join(__dirname, '../public')));
    this.app.use('/samples', sampleRouter.getRouter());
    this.app.use('/auth', authRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
