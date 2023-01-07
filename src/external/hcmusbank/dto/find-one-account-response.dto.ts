import { ApiProperty } from '@nestjs/swagger';

export class FindOneAccountResponseDto {
  message: string;

  id: string;

  @ApiProperty()
  accountNumber: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
