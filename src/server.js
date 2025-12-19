import express from 'express';
import cors from 'cors';
import pino from 'pino';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import usersRouter from './routers/users.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const logger = pino();

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
  });
  app.post('/', (req, res) => {
    res.json({ message: 'Server is running!', method: 'POST' });
  });

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);
  app.use('/users', usersRouter);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const swaggerJsonPath = path.resolve(__dirname, '../docs/swagger.json');
  let swaggerDocument = {};
  try {
    swaggerDocument = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf-8'));
  } catch {
    swaggerDocument = {
      openapi: '3.0.0',
      info: { title: 'API Docs', version: '1.0.0' },
      paths: {},
    };
  }
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/favicon.ico', (req, res) => {
    res.status(204).send();
  });

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain').send('User-agent: *\nDisallow:');
  });

  app.get('/reset-password', (req, res) => {
    res.json({
      status: 200,
      message: 'Reset password page. Please use POST /auth/reset-pwd with your token and new password.',
      data: { token: req.query.token },
    });
  });

  app.use(notFoundHandler);

  app.use((err, req, res, next) => {
    logger.error(
      { status: err.status || 500, method: req.method, url: req.originalUrl },
      err.message,
    );
    errorHandler(err, req, res, next);
  });

  return app;
};
