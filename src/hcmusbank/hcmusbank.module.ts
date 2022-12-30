import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HcmusbankService } from './hcmusbank.service';

@Module({
  providers: [HcmusbankService],
  imports: [ConfigModule, HttpModule],
  exports: [HcmusbankService],
})
export class InterbankModule {}
