import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  hoTen: string;

  @ApiProperty()
  sdt: string;

  @ApiProperty()
  email: string;
}
