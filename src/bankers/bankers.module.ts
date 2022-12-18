import { Module } from '@nestjs/common';

import { BankersController } from './bankers.controller';
import { BankersService } from './bankers.service';

@Module({
  controllers: [BankersController],
  providers: [BankersService],
})
export class BankersModule {}
