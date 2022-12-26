import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankersModule } from './bankers/bankers.module';
import { InterbankModule } from './interbank/interbank.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    BankersModule,
    InterbankModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
