import { getRepository } from 'typeorm';
import { User } from '../database/entity/User';
import userService from '../database/service/userService';

describe('getUsersRanks', () => {
  test('성공', async () => {
    getRepository(User).query = jest.fn().mockResolvedValue([1, 2, 3, 4, 5]);
    const result = await userService.getUsersRanks();
    expect(result).toHaveLength(5);
  });
});

describe('signUpUser', () => {
  test('성공', async () => {
    getRepository(User).findOne = jest.fn().mockResolvedValue(false);
    const id = 'id';
    const pw = 'pw';
    const user: User = new User();
    user.user_id = id;
    user.password = pw;
    getRepository(User).save = jest.fn().mockResolvedValue(user);
    const result = await userService.signUpUser(id, pw);

    expect(result).toEqual({ user_id: id, point: 0, rank: 'Bronze' });
  });

  test('실패 (이미 존재하는 아이디)', async () => {
    getRepository(User).findOne = jest.fn().mockResolvedValue(true);
    const result = await userService.signUpUser('id', 'pw');
    expect(result).toBeFalsy();
  });
});

describe('getUserInfo', () => {
  test('성공', async () => {
    const id = 'id';
    const user: User = new User();
    user.user_id = id;
    getRepository(User).findOne = jest.fn().mockResolvedValue(user);
    delete user.password;
    const result = await userService.getUserInfo(id);

    expect(result).toEqual(user);
  });

  test('실패 (존재하지 않는 아이디)', async () => {
    const id = 'id';
    getRepository(User).findOne = jest.fn().mockResolvedValue(undefined);
    const result = await userService.getUserInfo(id);

    expect(result).toEqual(undefined);
  });
});
