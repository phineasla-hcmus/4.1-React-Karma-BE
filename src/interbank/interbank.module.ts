import { Module } from '@nestjs/common';
import { InterbankController } from './interbank.controller';
import { InterbankService } from './interbank.service';
import { PaymentAccountsService } from 'src/paymentAccounts/paymentAccounts.service';

@Module({
  controllers: [InterbankController],
  providers: [InterbankService, PaymentAccountsService],
  imports: [],
})
export class InterbankModule {}
