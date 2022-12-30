import { Module } from '@nestjs/common';

import { HcmusbankService } from './hcmusbank.service';

@Module({
  providers: [HcmusbankService],
  imports: [],
  exports: [HcmusbankService],
})
export class InterbankModule {}
