import express from 'express';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { createServer } from 'http';
import { Server } from 'socket.io';
import socketUtil from './utils/socket';
import connection from './database/connection';
import loaders from './loaders';

dotenv.config();

async function startServer(app, httpServer) {
  loaders.init(app, httpServer);

  if (process.env.NODE_ENV !== 'test') {
    await connection.create();
    console.log('database connected');
  }

  httpServer.listen(Number(process.env.EXPRESS_PORT), () => {
    console.log('server start');
  });

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
