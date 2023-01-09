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

  async verify(data: string, signature: string) {
    const key = await fs.readFile('secret/request.public.pem', 'utf-8');
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(data);
    verify.end();

    const verified = verify.verify(key, signature, 'base64');
    return verified;
  }
}
