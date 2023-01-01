import { Module } from '@nestjs/common';

import { PaymentAccountsService } from '../paymentAccounts/paymentAccounts.service';

import { InterbankController } from './interbank.controller';
import { InterbankService } from './interbank.service';

@Module({
  controllers: [InterbankController],
  providers: [InterbankService, PaymentAccountsService],
  imports: [],
})
export class InterbankModule {}
