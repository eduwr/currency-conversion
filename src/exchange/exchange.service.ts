import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { ExchangeInputType } from './types/exchange-input.type';
import { ExchangeType } from './types/exchange.type';

export class CurrenciesService {
  async getCurrency(currency: string): Promise<any> {
    // mock
  }
}

@Injectable()
export class ExchangeService {
  constructor(private currenciesService: CurrenciesService) {}

  convertAmount = async ({
    from,
    to,
    amount,
  }: ExchangeInputType): Promise<ExchangeType> => {
    if (!from || !to || !amount) {
      throw new BadRequestException();
    }

    try {
      const currencyFrom = await this.currenciesService.getCurrency(from);

      const currencyTo = await this.currenciesService.getCurrency(to);

      const convertedAmount = (currencyFrom.value / currencyTo.value) * amount;

      return { amount: convertedAmount };
    } catch (e) {
      throw new BadRequestException(e);
    }
  };
}
