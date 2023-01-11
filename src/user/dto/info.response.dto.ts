import { ApiProperty } from '@nestjs/swagger';

export class InfoResponseDto {
  @ApiProperty()
  hoTen: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  sdt: string;

  @ApiProperty()
  soTK: string;

  @ApiProperty()
  soDu: number;
}
