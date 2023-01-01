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

import { FindOneAccountResponseDto } from './dto/find-one-account-response.dto';
import { FindOneAccountDto } from './dto/find-one-account.dto';
import { TransferDto } from './dto/transfer.dto';

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

  public async findOneAccount({ id }: FindOneAccountDto) {
    const payload = { accountNumber: id };
    const data = this.transformPayload(payload);
    const signature = await this.sign(data);
    try {
      const res = await this.axiosService.post<FindOneAccountResponseDto>(
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

  public async transfer(transferDto: TransferDto) {
    const payload = Object.assign({}, transferDto);
    // As defined by HCMUSBank's API
    // https://github.com/hcmus-internet-banking/backend/blob/a2a1ebf3c9490e403cde93965927c0d8903d5c27/src/pages/api/external/deposit.ts#L19
    if (payload.payer !== 'receiver') {
      payload.payer = undefined;
    }
    const data = this.transformPayload(payload);
    const signature = await this.sign(data);
    try {
      const res = await this.axiosService.post<FindOneAccountResponseDto>(
        `${this.baseUrl}/api/external/deposit`,
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
