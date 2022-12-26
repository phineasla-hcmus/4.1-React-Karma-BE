import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InterbankModule } from './interbank/interbank.module';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentAccountsModule } from './paymentAccounts/paymentAccounts.module';
import { BankersModule } from './bankers/bankers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    BankersModule,
    InterbankModule,
    PaymentAccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
