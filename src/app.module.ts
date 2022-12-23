import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupportModule } from './support/support.module';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentAccountsModule } from './paymentAccounts/paymentAccounts.module';

@Module({
  imports: [SupportModule, PrismaModule, PaymentAccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
