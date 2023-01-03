import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankersModule } from './bankers/bankers.module';
import { ExternalModule } from './external/external.module';
import { InterbankModule } from './interbank/interbank.module';
import { PaymentAccountsModule } from './paymentAccounts/paymentAccounts.module';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    BankersModule,
    InterbankModule,
    UsersModule,
    TransactionsModule,
    PaymentAccountsModule,
    ExternalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
