import { Module } from '@nestjs/common';

import { BanksModule } from '../banks/banks.module';
import { PaymentAccountsService } from '../paymentAccounts/paymentAccounts.service';

import { InterbankApiController } from './api/api.controller';
import { InterbankApiService } from './api/api.service';
import { InterbankController } from './interbank.controller';
import { InterbankService } from './interbank.service';

@Module({
  controllers: [InterbankApiController, InterbankController],
  providers: [InterbankApiService, InterbankService, PaymentAccountsService],
  imports: [BanksModule],
})
export class InterbankModule {}
