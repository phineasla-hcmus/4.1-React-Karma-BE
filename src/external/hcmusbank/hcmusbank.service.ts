import { createSign } from 'crypto';
import { readFile } from 'fs/promises';
import { join } from 'path';

import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';

import { AxiosService } from '../../axios/axios.service';

import { FindOneAccountResponseDto } from './dto/find-one-account-response.dto';
import { FindOneAccountDto } from './dto/find-one-account.dto';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class HcmusbankService {
  private readonly logger: Logger = new Logger(HcmusbankService.name);
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

  private didReceiveError(e: unknown) {
    if (isAxiosError(e)) {
      this.logger.error(e.toJSON());
      if (e.status < 500) {
        return new InternalServerErrorException({
          errorId: 'bad_transaction',
          message: 'Something went wrong when connecting to HCMUSBank',
        });
      }
      return new InternalServerErrorException({
        errorId: 'bad_interbank',
        message: 'HCMUSBank went rogue',
      });
    }
    if (e instanceof Error) {
      this.logger.error(e.message, e.stack);
    } else {
      this.logger.error(e);
    }
    return new InternalServerErrorException({
      errorId: 'i_dont_know',
      message: 'Good luck debuging this',
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
      this.didReceiveError(e);
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
    const res = await this.axiosService
      .post(`${this.baseUrl}/api/external/deposit`, {
        data,
        signature,
      })
      .catch((e) => {
        throw this.didReceiveError(e);
      });
    // TODO verify signature
    return res.data;
  }
}
