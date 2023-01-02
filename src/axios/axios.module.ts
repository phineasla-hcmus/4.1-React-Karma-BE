import { Module } from '@nestjs/common';
import axios from 'axios';

import { AxiosService } from './axios.service';

@Module({
  providers: [
    { provide: 'AXIOS_INSTANCE_TOKEN', useValue: axios.create() },
    AxiosService,
  ],
  exports: [AxiosService],
})
export class AxiosModule {}
