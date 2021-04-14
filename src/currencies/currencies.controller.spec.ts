import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { BadRequestException } from '@nestjs/common';
import { Currencies } from './currencies.entity';

describe('CurrenciesController', () => {
  let controller: CurrenciesController;
  let service: CurrenciesService;
  let mockData;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrenciesController],
      providers: [
        {
          provide: CurrenciesService,
          useFactory: () => ({
            getCurrency: jest.fn(),
            createCurrency: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<CurrenciesController>(CurrenciesController);
    service = module.get<CurrenciesService>(CurrenciesService);
    mockData = { value: 1, currency: 'USD' } as Currencies;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCurrency()', () => {
    it('should be throw when service throws', async () => {
      service.getCurrency = jest
        .fn()
        .mockRejectedValue(new BadRequestException());
      await expect(controller.getCurrency('INVALID')).rejects.toThrow(
        new BadRequestException(),
      );
    });

    it('should be called service with correct params', async () => {
      await controller.getCurrency('USD');
      expect(service.getCurrency).toBeCalledWith('USD');
    });

    it('should be returns when service returns', async () => {
      service.getCurrency = jest.fn().mockReturnValue(mockData);
      expect(await controller.getCurrency('USD')).toEqual(mockData);
    });
  });

  describe('createCurrency()', () => {
    it('should be throw when service throws', async () => {
      service.createCurrency = jest
        .fn()
        .mockRejectedValue(new BadRequestException());
      await expect(controller.createCurrency(mockData)).rejects.toThrow(
        new BadRequestException(),
      );
    });

    it('should be called service with correct params', async () => {
      await controller.createCurrency(mockData);
      expect(service.createCurrency).toBeCalledWith(mockData);
    });

    it('should be returns when service returns', async () => {
      service.createCurrency = jest.fn().mockReturnValue(mockData);
      expect(await controller.createCurrency(mockData)).toEqual(mockData);
    });
  });
});
