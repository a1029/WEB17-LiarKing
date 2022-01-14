import expressLoader from './express';
import express from 'express';
import { Server } from 'http';

export default {
  init: (app: express.Application, httpServer: Server) => {
    expressLoader(app, httpServer);
  },
};
