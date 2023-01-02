import { Module } from '@nestjs/common';

import { HcmusbankModule } from './hcmusbank/hcmusbank.module';
import { HcmusbankService } from './hcmusbank/hcmusbank.service';

@Module({ imports: [HcmusbankModule], exports: [HcmusbankService] })
export class ExternalModule {}
