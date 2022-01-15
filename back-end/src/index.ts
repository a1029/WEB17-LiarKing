import express, { Application } from 'express';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { createServer, Server as ServerType } from 'http';
import { Server } from 'socket.io';
import socketUtil from './utils/socket';
import connection from './database/connection';
import loaders from './loaders';

dotenv.config();

async function startServer(app: Application, httpServer: ServerType) {
  loaders.init(app, httpServer);

  if (process.env.NODE_ENV !== 'test') {
    await connection.create();
  }

  httpServer.listen(Number(process.env.EXPRESS_PORT));

  if (process.env.NODE_ENV !== 'test') {
    const io = new Server({
      cors: { origin: '*' },
      path: '/socket',
      transports: ['websocket'],
    });
    io.listen(Number(process.env.SOCKET_PORT));
    socketUtil(io);
  }
}

const app = express();
const httpServer = createServer(app);
startServer(app, httpServer);

export default { app, httpServer };
