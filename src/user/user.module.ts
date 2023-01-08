import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { PaymentAccountsModule } from '../paymentAccounts/paymentAccounts.module';
import { TransactionsModule } from '../transactions/transactions.module';

import { ContactsModule } from './contacts/contacts.module';
import { RemindersModule } from './reminders/reminders.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    PaymentAccountsModule,
    TransactionsModule,
    ContactsModule,
    RemindersModule,
  ],
})
export class UserModule {}
