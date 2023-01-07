import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BankersModule } from './bankers/bankers.module';
import { ClientsModule } from './clients/clients.module';
import { ExternalModule } from './external/external.module';
import { InterbankModule } from './interbank/interbank.module';
import { PaymentAccountsModule } from './paymentAccounts/paymentAccounts.module';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    BankersModule,
    InterbankModule,
    ClientsModule,
    TransactionsModule,
    PaymentAccountsModule,
    ExternalModule,
    UserModule,
  ],
})
export class AppModule {}
