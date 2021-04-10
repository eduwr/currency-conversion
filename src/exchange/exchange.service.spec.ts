import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesService, ExchangeService } from './exchange.service';
import { BadRequestException } from '@nestjs/common';

describe('ExchangeService', () => {
  let service: ExchangeService;
  let currenciesService: CurrenciesService;

  beforeEach(async () => {
    const currenciesServiceMock = {
      getCurrency: jest.fn().mockReturnValue({ value: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        { provide: CurrenciesService, useFactory: () => currenciesServiceMock },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    currenciesService = module.get<CurrenciesService>(CurrenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ConvertAmount()', () => {
    it('should be throw if called with invalid params', async () => {
      await expect(
        service.convertAmount({ from: '', to: '', amount: 0 }),
      ).rejects.toThrow(new BadRequestException());
    });

    it('should not throw if called with valid params', async () => {
      await expect(
        service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 }),
      ).resolves.not.toThrow();
    });

    it('getCurrency should be called twice', async () => {
      await service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 }),
        await expect(currenciesService.getCurrency).toBeCalledTimes(2);
    });

    it('getCurrency should be called with correct params', async () => {
      await service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 });
      await expect(currenciesService.getCurrency).toHaveBeenNthCalledWith(
        1,
        'USD',
      );
      await expect(currenciesService.getCurrency).toHaveBeenNthCalledWith(
        2,
        'BRL',
      );
    });

    it('should be thrown when getCurrency throw', async () => {
      (currenciesService.getCurrency as jest.Mock).mockRejectedValue(
        new BadRequestException(),
      );
      await expect(
        service.convertAmount({ from: 'INVALID', to: 'BRL', amount: 1 }),
      ).rejects.toThrow();
    });

    it('should return conversion value', async () => {
      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({
        value: 1,
      });
      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({
        value: 1,
      });
      expect(
        await service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 }),
      ).toEqual({ amount: 1 });

      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({
        value: 1,
      });
      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({
        value: 0.2,
      });
      expect(
        await service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 }),
      ).toEqual({ amount: 5 });

      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({
        value: 0.2,
      });
      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({
        value: 1,
      });
      expect(
        await service.convertAmount({ from: 'BRL', to: 'UDS', amount: 5 }),
      ).toEqual({ amount: 1 });
    });
  });
});
