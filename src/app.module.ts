import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankersModule } from './bankers/bankers.module';
import { PrismaModule } from './prisma/prisma.module';
import { InterbankModule } from './interbank/interbank.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    BankersModule,
    InterbankModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
