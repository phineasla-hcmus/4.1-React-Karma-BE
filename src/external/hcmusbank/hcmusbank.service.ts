import { createSign } from 'crypto';

import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';

import { AxiosService } from '../../axios/axios.service';
import { HCMUSBANK_TTL } from '../../constants';

import { FindOneAccountResponseDto } from './dto/find-one-account-response.dto';
import { FindOneAccountDto } from './dto/find-one-account.dto';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class HcmusbankService {
  private readonly logger: Logger = new Logger(HcmusbankService.name);
  baseUrl: string;

  constructor(
    @Inject('HCMUS_PRIVATE_KEY_TOKEN')
    private readonly privateKey: Buffer | string,
    private readonly axiosService: AxiosService,
    configService: ConfigService,
  ) {
    this.baseUrl = configService.getOrThrow('HCMUSBANK_BASE_URL');
  }

  private transformPayload(payload: any) {
    const json = JSON.stringify(payload);
    const buffer = Buffer.from(json);
    return buffer.toString('base64');
  }

  private async sign(transformedPayload: string) {
    const sign = createSign('RSA-SHA256');
    sign.update(transformedPayload);
    sign.end();
    return sign.sign(this.privateKey, 'base64');
  }

  private didReceiveError(e: unknown) {
    if (isAxiosError(e)) {
      if (!e.response) {
        return new InternalServerErrorException({
          errorId: 'bad_interbank',
          message: 'HCMUSBank went rogue',
        });
      }
      const status = e.response.status;
      this.logger.error(`Status: ${status}`, JSON.stringify(e.response.data));
      if (status == HttpStatus.BAD_REQUEST) {
        return new BadRequestException({
          errorId: 'bad_transaction_request',
          message: 'Invalid parameter received',
        });
      }
      if (status == HttpStatus.NOT_FOUND) {
        return new NotFoundException({
          errorId: 'payment_account_not_found',
          message: 'Cannot find payment account from HCMUSBank',
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
    const payload = {
      accountNumber: id,
      expiredAt: new Date(Date.now() + HCMUSBANK_TTL),
    };
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
      throw this.didReceiveError(e);
    }
  }

  public async transfer(transferDto: TransferDto) {
    const payload = Object.assign(
      { expiredAt: new Date(Date.now() + HCMUSBANK_TTL) },
      transferDto,
    );
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
    return res.data;
  }
}
