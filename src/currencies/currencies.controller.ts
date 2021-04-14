import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { Currencies } from './currencies.entity';
import { CreateCurrencyDto } from './dto/create-currency.dto';

@Controller('currencies')
export class CurrenciesController {
  constructor(private currenciesService: CurrenciesService) {}

  @Get('/:currency')
  async getCurrency(@Param('currency') currency: string): Promise<Currencies> {
    return this.currenciesService.getCurrency(currency);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createCurrency(
    @Body() createCurrencyDto: CreateCurrencyDto,
  ): Promise<Currencies> {
    return this.currenciesService.createCurrency(createCurrencyDto);
  }
}
