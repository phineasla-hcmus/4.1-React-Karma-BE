import { Module } from '@nestjs/common';

import { NotificationModule } from '../notification/notification.module';
import { PaymentAccountsModule } from '../paymentAccounts/paymentAccounts.module';
import { TransactionsModule } from '../transactions/transactions.module';

import { ContactsController } from './contacts/contacts.controller';
import { ContactsService } from './contacts/contacts.service';
import { RemindersController } from './reminders/reminders.controller';
import { RemindersService } from './reminders/reminders.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  // Child routes (controllers) must be placed before parent routes
  controllers: [ContactsController, RemindersController, UserController],
  providers: [ContactsService, RemindersService, UserService],
  imports: [PaymentAccountsModule, TransactionsModule, NotificationModule],
})
export class UserModule {}
