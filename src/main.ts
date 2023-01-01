import { createSign, publicEncrypt } from 'crypto';
import { readFile } from 'fs/promises';

import { NestFactory } from '@nestjs/core';
import axios from 'axios';
import monitor from 'express-status-monitor';

import { AppModule } from './app.module';

const test = async () => {
  const payload = JSON.stringify({ accountNumber: '7403340318' });
  const buffer = Buffer.from(payload).toString('base64');
  const publicKey = await readFile('src/hcmusbank/hcmusbank.public.pem');
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
    .post(`${API_URL}/api/external/query-bank-number`, {
      data: buffer,
      signature: encrypted,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((e) => {
      console.error(e.response.data);
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
