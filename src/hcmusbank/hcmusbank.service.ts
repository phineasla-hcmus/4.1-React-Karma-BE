import { createSign } from 'crypto';
import { readFile } from 'fs/promises';
import { join } from 'path';

import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';

import { AxiosService } from '../axios/axios.service';

import { FindOneAccountDto } from './hcmusbank.types';

@Injectable()
export class HcmusbankService {
  baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly axiosService: AxiosService,
  ) {
    this.baseUrl = configService.getOrThrow('HCMUSBANK_BASE_URL');
  }

  private transformPayload(payload: any) {
    const json = JSON.stringify(payload);
    const buffer = Buffer.from(json);
    return buffer.toString('base64');
  }

  private async sign(transformedPayload: string) {
    const privateKey = await readFile(join(__dirname, 'hcmusbank.private.pem'));
    const sign = createSign('RSA-SHA256');
    sign.update(transformedPayload);
    sign.end();
    return sign.sign(privateKey, 'base64');
  }

  private handleError(e: unknown) {
    if (isAxiosError(e)) {
      throw new HttpException(
        { errorId: e.code, message: e.message },
        e.status,
      );
    }
    throw new InternalServerErrorException({
      errorId: 'i_dont_know',
      message: e instanceof Error ? e.message : 'Good luck debuging this',
    });
  }

  public async findOneAccount(id: string) {
    const payload = { accountNumber: id };
    const data = this.transformPayload(payload);
    const signature = await this.sign(data);
    try {
      const res = await this.axiosService.post<FindOneAccountDto>(
        `${this.baseUrl}/api/external/query-bank-number`,
        {
          data,
          signature,
        },
      );
      return res.data;
    } catch (e) {
      this.handleError(e);
    }
  }
}
