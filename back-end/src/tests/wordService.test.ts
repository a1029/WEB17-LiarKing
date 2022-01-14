import { getRepository } from 'typeorm';
import { Word } from '../database/entity/Word';
import { getRandomWords } from '../database/service/wordService';

describe('getRandomWords', () => {
  test('성공', async () => {
    getRepository(Word).find = jest.fn().mockResolvedValue(Array(15).fill('word'));
    const result = await getRandomWords('스포츠');
    expect(result).toHaveLength(15);
  });

  test('실패 (존재하지 않는 카테고리)', async () => {
    getRepository(Word).find = jest.fn().mockResolvedValue([]);
    const result = await getRandomWords('없는카테고리');
    expect(result).toEqual([]);
  });
});
