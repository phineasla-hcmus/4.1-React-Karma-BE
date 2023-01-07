import { ApiProperty } from '@nestjs/swagger';

export class ContactResponseDto {
  @ApiProperty()
  maTK: number;

  @ApiProperty()
  nguoiDung: string;

  @ApiProperty({ nullable: true })
  tenGoiNho: string;
}
