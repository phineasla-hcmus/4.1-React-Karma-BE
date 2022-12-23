import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { PaymentAccountsService } from 'src/paymentAccounts/paymentAccounts.service';

@Module({
  controllers: [SupportController],
  providers: [SupportService, PaymentAccountsService],
  imports: [],
})
export class SupportModule {}
