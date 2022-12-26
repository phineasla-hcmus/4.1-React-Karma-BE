import { Module } from '@nestjs/common';
import { PaymentAccountsController } from './paymentAccounts.controller';
import { PaymentAccountsService } from './paymentAccounts.service';

@Module({
  controllers: [PaymentAccountsController],
  providers: [PaymentAccountsService],
})
export class PaymentAccountsModule {}
