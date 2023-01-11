import { Module } from '@nestjs/common';

import { AxiosModule } from '../axios/axios.module';
import { BanksModule } from '../banks/banks.module';
import { PaymentAccountsModule } from '../paymentAccounts/paymentAccounts.module';
import { TransactionsModule } from '../transactions/transactions.module';

import { ExternalController } from './external.controller';
import { ExternalService } from './external.service';
import { HcmusbankModule } from './hcmusbank/hcmusbank.module';
import { HcmusbankService } from './hcmusbank/hcmusbank.service';

@Module({
  providers: [ExternalService, HcmusbankService],
  imports: [
    AxiosModule,
    BanksModule,
    TransactionsModule,
    PaymentAccountsModule,
    HcmusbankModule,
  ],
  controllers: [ExternalController],
})
export class ExternalModule {}
