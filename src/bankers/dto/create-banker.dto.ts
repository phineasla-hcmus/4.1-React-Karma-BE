import { ApiProperty } from '@nestjs/swagger';

export class CreateBankerDto {
  @ApiProperty({
    type: String,
  })
  hoTen: string;

  @ApiProperty()
  sdt: string;
}
