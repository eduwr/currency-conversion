import { Currencies } from './currencies.entity';
import { EntityRepository, Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

type CuurrenciesDto = Omit<Currencies, 'createdAt' | 'updatedAt' | '_id'>;

@EntityRepository(Currencies)
export class CurrenciesRepository extends Repository<Currencies> {
  async getCurrency(currency: string): Promise<Currencies> {
    const currencyFound = await this.findOne({ currency });

    if (!currencyFound) {
      throw new NotFoundException(`Couldn't find ${currency} currency`);
    }

    return currencyFound;
  }

  async createCurrency({
    currency,
    value,
  }: CuurrenciesDto): Promise<Currencies> {
    return new Currencies();
  }
  async updateCurrency({
    currency,
    value,
  }: CuurrenciesDto): Promise<Currencies> {
    return new Currencies();
  }

  async deleteCurrency(currency: string): Promise<void> {
    return;
  }
}
