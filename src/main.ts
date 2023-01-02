import { createSign } from 'crypto';
import { readFile } from 'fs/promises';

import { NestFactory } from '@nestjs/core';
import axios, { isAxiosError } from 'axios';
import monitor from 'express-status-monitor';

import { AppModule } from './app.module';

const test = async () => {
  const payload = JSON.stringify({
    amount: 10,
    message: 'Testing testing are we clear to land?',
    toAccountNumber: '7403340318',
    fromAccountNumber: '123456789012',
    payer: 'receiver',
  });
  const buffer = Buffer.from(payload).toString('base64');
  const privateKey = await readFile('src/hcmusbank/hcmusbank.private.pem');
  // const encrypted = publicEncrypt(
  //   { key: publicKey, oaepHash: 'SHA256' },
  //   Buffer.from(payload),
  // ).toString('base64');
  const sign = createSign('RSA-SHA256');
  sign.update(buffer);
  sign.end();
  const encrypted = sign.sign(privateKey, 'base64');
  const API_URL = 'https://hcmus-internet-banking-backend.vercel.app';

  await axios
    .post(`${API_URL}/api/external/deposit`, {
      data: buffer,
      signature: encrypted,
    })
    .then((res) => {
      console.log('DONE');
      console.log(res.data);
    })
    .catch((e) => {
      if (isAxiosError(e)) {
        console.log('ERROR');
        console.error(e.toJSON());
      }
    });
};

async function bootstrap() {
  test();

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(monitor());
  await app.listen(3003);
}
bootstrap();
