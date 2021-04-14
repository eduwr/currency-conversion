import { Currencies } from './currencies.entity';
import { EntityRepository, Repository } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { CreateCurrencyDto } from './dto/create-currency.dto';
import { validateOrReject } from 'class-validator';

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
    currency: currencyInput,
    value,
  }: CreateCurrencyDto): Promise<Currencies> {
    const currency = new Currencies();

    currency.value = value;
    currency.currency = currencyInput;

    try {
      await validateOrReject(currency);

      await this.save(currency);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return currency;
  }
  async updateCurrency(
    currenciesInput: CreateCurrencyDto,
  ): Promise<Currencies> {
    const currencyFound = await this.findOne({
      currency: currenciesInput.currency,
    });
    if (!currencyFound) {
      throw new NotFoundException(
        `The currency ${currenciesInput.currency} was not found!`,
      );
    }

    try {
      currencyFound.value = currenciesInput.value;
      await this.save(currencyFound);
    } catch (err) {
      throw new InternalServerErrorException();
    }

    return currencyFound;
  }

  async deleteCurrency(currency: string): Promise<void> {
    const currencyFound = await this.findOne({ currency });
    if (!currencyFound) {
      throw new NotFoundException(`The currency ${currency} was not found!`);
    }

    await this.delete({ currency });
  }
}
