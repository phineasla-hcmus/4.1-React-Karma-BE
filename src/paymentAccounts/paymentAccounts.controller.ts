import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { ApiOkWrappedResponse } from '../swagger/swagger.decorator';

import { FindOnePaymentAccountResponseDto as FindOnePaymentAccountInfoResponseDto } from './dto/find-one-payment-account-info.response.dto';
import { PaymentAccountsService } from './paymentAccounts.service';

@Controller('payment-accounts')
export class PaymentAccountsController {
  constructor(private paymentAccountsService: PaymentAccountsService) {}

  @Get(':soTK')
  @ApiOperation({ summary: 'Get full name of the payment account owner' })
  @ApiOkWrappedResponse({ type: FindOnePaymentAccountInfoResponseDto })
  async findOne(@Param('soTK') soTK: string) {
    const data = await this.paymentAccountsService.findOneInfo(soTK);
    return { data };
  }
}
