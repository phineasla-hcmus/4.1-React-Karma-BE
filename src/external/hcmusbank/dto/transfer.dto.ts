import { ApiProperty } from '@nestjs/swagger';

export interface TransferDto {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  message: string;
  payer: 'sender' | 'receiver';
}
