import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InterbankTransactionQueryDto {
  @ApiProperty({
    description: 'Start date - format ioString',
  })
  @ApiPropertyOptional()
  from: string;

  @ApiProperty({
    description: 'End date - format ioString',
    default: 'now',
  })
  @ApiPropertyOptional()
  to: string;

  @ApiProperty()
  @ApiPropertyOptional()
  bankID: number;
}
