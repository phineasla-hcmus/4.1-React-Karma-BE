import { ApiProperty } from '@nestjs/swagger';

export class CreateReminderDto {
  @ApiProperty()
  soTK: string;

  @ApiProperty()
  soTKNguoiNhan: string;

  @ApiProperty()
  soTien: number;

  @ApiProperty()
  noiDung: string;
}
