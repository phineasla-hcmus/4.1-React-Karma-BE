import { Module } from '@nestjs/common';

import { AxiosModule } from '../axios/axios.module';

import { HcmusbankModule } from './hcmusbank/hcmusbank.module';
import { HcmusbankService } from './hcmusbank/hcmusbank.service';

@Module({
  providers: [HcmusbankService],
  imports: [AxiosModule, HcmusbankModule],
  exports: [HcmusbankService],
})
export class ExternalModule {}
