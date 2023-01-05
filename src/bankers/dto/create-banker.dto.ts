import { ApiProperty } from '@nestjs/swagger';

export class CreateBankerDto {
  @ApiProperty()
  hoTen: string;

  @ApiProperty()
  sdt: string;
}
