import { Module } from '@nestjs/common';

import { PaymentAccountsModule } from '../paymentAccounts/paymentAccounts.module';
import { TransactionsModule } from '../transactions/transactions.module';

import { ContactsModule } from './contacts/contacts.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RemindersModule } from './reminders/reminders.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PaymentAccountsModule, TransactionsModule, ContactsModule, RemindersModule],
})
export class UserModule {}
