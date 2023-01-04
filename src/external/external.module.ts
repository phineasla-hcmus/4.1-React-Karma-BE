import { Module } from '@nestjs/common';

import { AxiosModule } from '../axios/axios.module';
import { TransactionsModule } from '../transactions/transactions.module';

import { ExternalController } from './external.controller';
import { ExternalService } from './external.service';
import { HcmusbankModule } from './hcmusbank/hcmusbank.module';
import { HcmusbankService } from './hcmusbank/hcmusbank.service';

@Module({
  providers: [HcmusbankService, ExternalService],
  imports: [AxiosModule, TransactionsModule, HcmusbankModule],
  controllers: [ExternalController],
})
export class ExternalModule {}
