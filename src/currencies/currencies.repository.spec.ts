import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesRepository } from './currencies.repository';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Currencies } from './currencies.entity';

describe('CurrenciesRepository', () => {
  let repository: CurrenciesRepository;
  let mockData;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrenciesRepository],
    }).compile();

    repository = module.get<CurrenciesRepository>(CurrenciesRepository);
    mockData = { currency: 'USD', value: 1 } as Currencies;
    repository.save = jest.fn();
  });

  it('Repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getCurrency()', () => {
    it('Should be called findOne with correct params ', async () => {
      repository.findOne = jest.fn().mockReturnValue({});
      await repository.getCurrency('USD');
      expect(repository.findOne).toBeCalledWith({ currency: 'USD' });
    });

    it('Should be thrown findOne returns empty', async () => {
      repository.findOne = jest.fn().mockReturnValue(undefined);
      await expect(repository.getCurrency('USD')).rejects.toThrow(
        new NotFoundException(`Couldn't find USD currency`),
      );
    });

    it('Should return if findOne returns', async () => {
      const mockData = { currency: 'USD', value: 1 } as Currencies;
      repository.findOne = jest.fn().mockReturnValue(mockData);
      expect(await repository.getCurrency('USD')).toEqual(mockData);
    });
  });

  describe('createCurrency()', () => {
    it('Should be called save with correct params ', async () => {
      repository.save = jest.fn().mockReturnValue(mockData);
      await repository.createCurrency(mockData);
      expect(repository.save).toBeCalledWith(mockData);
    });

    it('Should be throw when save throws', async () => {
      repository.save = jest.fn().mockRejectedValue(new Error());
      await expect(repository.createCurrency(mockData)).rejects.toThrow();
    });

    it('Should be throw when called with invalid params', async () => {
      mockData.currency = 'INVALID';
      await expect(repository.createCurrency(mockData)).rejects.toThrow();

      mockData.currency = 'USD';
      mockData.value = 'INVALID';
      await expect(repository.createCurrency(mockData)).rejects.toThrow();
    });

    it('Should be returns create data', async () => {
      expect(await repository.createCurrency(mockData)).toEqual(mockData);
    });
  });

  describe('updateCurrency()', () => {
    it('Should be called findOne with correct params ', async () => {
      repository.findOne = jest.fn().mockReturnValue({});
      await repository.updateCurrency(mockData);
      expect(repository.findOne).toBeCalledWith({ currency: 'USD' });
    });

    it('Should be thrown findOne returns empty', async () => {
      repository.findOne = jest.fn().mockReturnValue(undefined);
      await expect(repository.updateCurrency(mockData)).rejects.toThrow(
        new NotFoundException(
          `The currency ${mockData.currency} was not found!`,
        ),
      );
    });

    it('Should be called save with correct params ', async () => {
      repository.findOne = jest.fn().mockReturnValue(mockData);
      repository.save = jest.fn().mockReturnValue(mockData);

      await repository.updateCurrency(mockData);
      expect(repository.save).toBeCalledWith(mockData);
    });

    it('Should be thrown if save throws', async () => {
      repository.findOne = jest.fn().mockReturnValue(mockData);
      repository.save = jest.fn().mockRejectedValue(new Error());

      await expect(repository.updateCurrency(mockData)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('Should be return updated data', async () => {
      repository.findOne = jest
        .fn()
        .mockReturnValue({ currency: 'USD', value: 1 });
      repository.save = jest.fn().mockReturnValue({});

      const result = await repository.updateCurrency({
        currency: 'USD',
        value: 2,
      });
      expect(result).toEqual({ currency: 'USD', value: 2 });
    });
  });
});
