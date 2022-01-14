import request from 'supertest';
import loginService from '../database/service/loginService';
import userService from '../database/service/userService';
import server from '../index';
import { idList, nicknameList } from '../store/store';

const app = server.app;

describe('POST /login', () => {
  test('성공', async () => {
    const id = 'id1';
    const password = 'pw';
    loginService.loginVerify = jest.fn().mockResolvedValue({ user_id: id });
    const response = await request(app).post('/api/login').send({
      id,
      password,
    });

    expect(response.body.state).toEqual('success');
  });

  test('실패 (올바르지 않은 아이디 또는 비밀번호)', async () => {
    const id = 'id2';
    const password = 'pw';
    loginService.loginVerify = jest.fn().mockResolvedValue(false);
    const response = await request(app).post('/api/login').send({
      id,
      password,
    });

    expect(response.body.state).toEqual('mismatch');
  });

  test('실패 (이미 동일한 아이디로 로그인)', async () => {
    const id = 'id3';
    const password = 'pw';
    idList.push(id);
    const response = await request(app).post('/api/login').send({
      id,
      password,
    });
    idList.splice(idList.indexOf(id), 1);

    expect(response.body.state).toEqual('duplicated');
  });
});

describe('POST /non-login', () => {
  test('성공', async () => {
    const nickname = 'nickname1';
    const response = await request(app).post('/api/non-login').send({
      nickname,
    });

    expect(response.body.state).toEqual('success');
  });

  test('실패 (이미 동일한 닉네임으로 로그인)', async () => {
    const nickname = 'nickname2';
    nicknameList.push(nickname);
    const response = await request(app).post('/api/non-login').send({
      nickname,
    });
    nicknameList.splice(nicknameList.indexOf(nickname), 1);

    expect(response.body.state).toEqual('non-user logged in');
  });

  test('실패 (닉네임과 일치하는 회원 아이디가 존재)', async () => {
    const nickname = 'nickname3';
    userService.getUserInfo = jest.fn().mockResolvedValue(true);
    const response = await request(app).post('/api/non-login').send({
      nickname,
    });

    expect(response.body.state).toEqual('user exist');
  });
});

describe('POST /logout', () => {
  test('성공 (로그인->로그아웃)', async () => {
    const id = 'id4';
    const password = 'pw';
    await request(app).post('/api/login').send({
      id,
      password,
    });
    const response = await request(app).post('/api/logout').send({ user_id: id });

    expect(response.body).toEqual(true);
  });

  test('성공 (비로그인->로그아웃)', async () => {
    const nickname = 'nickname4';
    await request(app).post('/api/non-login').send({
      nickname,
    });
    const response = await request(app).post('/api/logout').send({ user_id: nickname });

    expect(response.body).toEqual(true);
  });

  test('실패 (존재하지 않는 아이디 또는 닉네임)', async () => {
    const response = await request(app).post('/api/logout');

    expect(response.body).toEqual(false);
  });
});
