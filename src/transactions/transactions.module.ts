import { Module } from '@nestjs/common';

import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';

import { TransactionEmailService } from './transactionEmail.service';
import { TransactionOtpService } from './transactionOtp.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [EmailModule, UsersModule],
  exports: [TransactionsService, TransactionOtpService],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionOtpService,
    TransactionEmailService,
  ],
})
export class TransactionsModule {}
