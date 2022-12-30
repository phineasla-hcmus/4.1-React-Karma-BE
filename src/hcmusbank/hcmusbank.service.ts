import { publicEncrypt } from 'crypto';
import { readFile } from 'fs/promises';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class HcmusbankService {
  baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUrl = 'https://hcmus-internet-banking-backend.vercel.app';
  }

  private async sign(payload: string) {
    const publicKey = await readFile('hcmusbank.public.pem');
    const encrypted = publicEncrypt(
      { key: publicKey, oaepHash: 'SHA256' },
      Buffer.from(payload),
    );
    return encrypted.toString('base64');
  }

  public async findOneAccount(id: string) {
    const payload = JSON.stringify({ accountNumber: '1234567890' });
    const res = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/api/external/query-bank-number`, {
        payload,
      }),
    );
  }
}
