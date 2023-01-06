import { ApiProperty } from '@nestjs/swagger';

export class TransactionQueryDTO {
  @ApiProperty()
  sender?: string;

  @ApiProperty()
  receiver?: string;
}
