import connection from '../database/connection';
import server from '..';

beforeAll(async () => {
  await connection.create();
});

afterAll(async () => {
  await connection.close();
  server.httpServer.close();
});
