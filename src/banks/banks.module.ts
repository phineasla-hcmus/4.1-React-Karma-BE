import { Module } from '@nestjs/common';

import { BanksController } from './banks.controller';
import { BanksService } from './banks.service';

@Module({
  controllers: [BanksController],
  providers: [BanksService],
  exports: [BanksService],
})
export class BanksModule {}
