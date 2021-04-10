import { BadRequestException, Injectable, Inject } from '@nestjs/common';

export class CurrenciesService {
  async getCurrency(currency: string): Promise<any> {
    // mock
  }
}

@Injectable()
export class ExchangeService {
  constructor(private currenciesService: CurrenciesService) {}

  convertAmount = async ({ from, to, amount }): Promise<any> => {
    if (!from || !to || !amount) {
      throw new BadRequestException();
    }

    try {
      const currencyFrom = await this.currenciesService.getCurrency(from);

      const currencyTo = await this.currenciesService.getCurrency(to);
    } catch (e) {
      throw new BadRequestException(e);
    }
  };
}
