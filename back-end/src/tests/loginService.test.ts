import { getRepository } from 'typeorm';
import { User } from '../database/entity/User';
import loginService from '../database/service/loginService';

describe('loginVerify', () => {
  test('성공', async () => {
    const id: string = 'id';
    const password: string = 'pw';
    getRepository(User).findOne = jest.fn().mockResolvedValue({ user_id: id, password, point: 100 });
    const response = await loginService.loginVerify(id, password);

    expect(response).toEqual({ user_id: id, point: 100, rank: 'Silver' });
  });

  test('실패 (올바르지 않는 아이디 또는 비밀번호)', async () => {
    const id: string = 'id';
    const password: string = 'pw';
    getRepository(User).findOne = jest.fn().mockResolvedValue({ user_id: id, password: 'wrong', point: 100 });
    const response = await loginService.loginVerify(id, password);

    expect(response).toBeFalsy();
  });
});
