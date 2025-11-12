import express from 'express';
import cors from 'cors';
import pino from 'pino';
import contactsRouter from './routers/contacts.js';

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

  app.use((req, res) => {
    res.status(404).json({
      message: 'Route not found'
    });
  });

  app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500).json({
      message: 'Something went wrong'
    });
  });

  return app;
};

