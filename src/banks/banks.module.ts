import { Module } from '@nestjs/common';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';

@Module({
  controllers: [BanksController],
  providers: [BanksService]
})
export class BanksModule {}
