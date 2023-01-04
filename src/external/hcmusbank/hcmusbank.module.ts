import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AxiosModule } from '../../axios/axios.module';

import { HcmusbankService } from './hcmusbank.service';

@Module({
  providers: [HcmusbankService],
  imports: [ConfigModule, AxiosModule],
  exports: [HcmusbankService],
})
export class HcmusbankModule {}
