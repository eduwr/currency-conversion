import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesService } from './currencies.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CurrenciesRepository } from './currencies.repository';
import { Currencies } from './currencies.entity';

describe('CurrenciesService', () => {
  let service: CurrenciesService;
  let repository: CurrenciesRepository;
  let mockData: Currencies;

  beforeEach(async () => {
    const currenciesRepositoryMock = {
      getCurrency: jest.fn(),
      createCurrency: jest.fn(),
      updateCurrency: jest.fn(),
      deleteCurrency: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrenciesService,
        {
          provide: CurrenciesRepository,
          useFactory: () => currenciesRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CurrenciesService>(CurrenciesService);
    repository = module.get<CurrenciesRepository>(CurrenciesRepository);
    mockData = { currency: 'USD', value: 1 };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrency()', () => {
    it('Should throw an error if repository throws', async () => {
      (repository.getCurrency as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );
      await expect(service.getCurrency('ANY')).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('Should not throw an error if repository returns', async () => {
      await expect(service.getCurrency('USD')).resolves.not.toThrow();
    });

    it('Should call repository with correct params', async () => {
      await service.getCurrency('USD');

      expect(repository.getCurrency).toBeCalledWith('USD');
    });

    it('Should returns when repository returns', async () => {
      (repository.getCurrency as jest.Mock).mockReturnValue(mockData);
      expect(await service.getCurrency('USD')).toEqual(mockData);
    });
  });

  describe('createCurrency()', () => {
    it('Should throw an error if repository throws', async () => {
      (repository.createCurrency as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );
      mockData.currency = 'INVALID';
      await expect(service.createCurrency(mockData)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('Should not throw an error if repository returns', async () => {
      await expect(service.createCurrency(mockData)).resolves.not.toThrow();
    });

    it('Should call repository with correct params', async () => {
      await service.createCurrency(mockData);

      expect(repository.createCurrency).toBeCalledWith(mockData);
    });

    it('Should throw if value <= 0', async () => {
      mockData.value = 0;
      await expect(service.createCurrency(mockData)).rejects.toThrow(
        new BadRequestException('Value must be greater than zero'),
      );
    });

    it('Should returns when repository returns', async () => {
      (repository.createCurrency as jest.Mock).mockReturnValue(mockData);
      expect(await service.createCurrency(mockData)).toEqual(mockData);
    });
  });
  describe('updateCurrency()', () => {
    it('Should throw an error if repository throws', async () => {
      (repository.updateCurrency as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );
      mockData.currency = 'INVALID';
      await expect(service.updateCurrency(mockData)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('Should not throw an error if repository returns', async () => {
      await expect(service.updateCurrency(mockData)).resolves.not.toThrow();
    });

    it('Should call repository with correct params', async () => {
      await service.updateCurrency(mockData);

      expect(repository.updateCurrency).toBeCalledWith(mockData);
    });

    it('Should throw if value <= 0', async () => {
      mockData.value = 0;
      await expect(service.updateCurrency(mockData)).rejects.toThrow(
        new BadRequestException('Value must be greater than zero'),
      );
    });
    it('Should returns when repository returns', async () => {
      (repository.updateCurrency as jest.Mock).mockReturnValue(mockData);
      expect(await service.updateCurrency(mockData)).toEqual(mockData);
    });
  });
  describe('deleteCurrency()', () => {
    it('Should throw an error if repository throws', async () => {
      (repository.deleteCurrency as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );
      await expect(service.deleteCurrency('INVALID')).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('Should not throw an error if repository returns', async () => {
      await expect(service.deleteCurrency('USD')).resolves.not.toThrow();
    });

    it('Should call repository with correct params', async () => {
      await service.deleteCurrency('USD');

      expect(repository.deleteCurrency).toBeCalledWith('USD');
    });
  });
});
