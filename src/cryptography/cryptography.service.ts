import * as crypto from 'crypto';

import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CryptographyService {
  constructor(
    @Inject('INTERBANK_PRIVATE_KEY_TOKEN')
    private readonly privateKey: Buffer | string,
  ) {}

  async sign(data: string) {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    sign.end();

    const signature = sign.sign(this.privateKey, 'base64');
    return signature;
  }

  async verify(data: string, signature: string, key: string) {
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(data);
    verify.end();

    const verified = verify.verify(key, signature, 'base64');
    return verified;
  }
}
