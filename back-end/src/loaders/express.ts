import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import session from 'express-session';
import { Server } from 'http';
import { ExpressPeerServer } from 'peer';
import userRouter from '../route/userRouter';
import indexRouter from '../route/indexRouter';

dotenv.config();

export default (app: express.Application, httpServer: Server) => {
  if (process.env.NODE_ENV !== 'test') {
    app.use('/peerjs', ExpressPeerServer(httpServer));
  }
  if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
  } else {
    app.use(morgan('dev'));
  }
  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
        secure: false,
      },
    })
  );
  app.use(express.json());
  app.use('/api/users', userRouter);
  app.use('/api', indexRouter);
};
