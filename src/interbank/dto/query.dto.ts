import { ApiProperty } from '@nestjs/swagger';

export class QueryDTO {
  @ApiProperty({
    description: 'Start date - format ioString',
  })
  from: string;

  @ApiProperty({
    description: 'End date - format ioString',
    default: 'now',
  })
  to: string;

  @ApiProperty()
  bankID: number;
}
