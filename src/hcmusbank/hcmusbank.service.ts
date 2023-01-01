import { createSign, publicEncrypt } from 'crypto';
import { readFile } from 'fs/promises';
import { join } from 'path';

import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';

import { AxiosService } from '../axios/axios.service';

@Injectable()
export class HcmusbankService {
  baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly axiosService: AxiosService,
  ) {
    this.baseUrl = 'http://localhost:3000';
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

  public async findOneAccount(id: string) {
    const payload = { accountNumber: id };
    const data = this.transformPayload(payload);
    const signature = await this.sign(data);
    try {
      const res = await this.axiosService.post(
        `${this.baseUrl}/api/external/query-bank-number`,
        {
          data,
          signature,
        },
      );
      return res.data;
    } catch (e) {
      if (isAxiosError(e)) {
        throw new HttpException(
          { errorId: e.code, message: e.message },
          e.status,
        );
      }
    }
  }
}
