import { ApiProperty } from '@nestjs/swagger';

export class FindOnePaymentAccountResponseDto {
  @ApiProperty()
  soTK: string;

  @ApiProperty()
  hoTen: boolean;
}
