import { ApiProperty } from '@nestjs/swagger';

export class CreateReminderDto {
  @ApiProperty()
  soTK: string;

  @ApiProperty()
  nguoiNhan: number;

  @ApiProperty()
  soTien: number;

  @ApiProperty()
  noiDung: string;
}
