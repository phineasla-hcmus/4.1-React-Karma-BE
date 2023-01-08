import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum ReminderType {
  ForMe = 'me',
  ForOthers = 'others',
}

export class FindRemindersDto {
  @ApiProperty({ enum: ReminderType })
  @IsOptional()
  @IsEnum(ReminderType)
  type: ReminderType = ReminderType.ForMe;
}
