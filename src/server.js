import express from 'express';
import cors from 'cors';
import pino from 'pino';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const logger = pino();

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
  });

  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);

  app.use((err, req, res, next) => {
    logger.error(err.message);
    errorHandler(err, req, res, next);
  });

  return app;
};
