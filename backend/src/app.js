import 'dotenv/config';
// carrega todas as variaves embiante para process.env
// Usando o sucrase e nodemon
import express from 'express';
import path from 'path';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import 'express-async-errors';
import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();

    this.routes();

    this.exceptionHandle();
  }

  middlewares() {
    // Integração com o sentry, colocando antes de todas rotas
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors());
    this.server.use(express.json());
    // Usado para o front conseguir acessar url do file
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    // Colocando dps de todas as rotas
    this.server.use(Sentry.Handlers.errorHandler());
  }

  // Quando tem 4 parametros ele entende que é para tratamento de execções
  exceptionHandle() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
