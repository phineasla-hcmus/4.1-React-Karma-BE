import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty()
  fromAccountNumber: string;

  @ApiProperty()
  toAccountNumber: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  message: string;

  @ApiProperty({ enum: ['sender', 'receiver'] })
  payer: 'sender' | 'receiver';
}
