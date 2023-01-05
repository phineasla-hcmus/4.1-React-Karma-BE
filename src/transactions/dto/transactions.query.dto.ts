import { ApiProperty } from '@nestjs/swagger';

export class TransactionQueryDTO {
  sender?: string;
  receiver?: string;
}
