import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';

@Injectable()
export class CryptographyService {
  async sign(data: string) {
    const privatKey = await fs.readFile('secret/response.private.key', 'utf-8');

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    sign.end();

    const signature = sign.sign(privatKey, 'base64');
    return signature;
  }
}
