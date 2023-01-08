import { IsEnum, IsOptional } from 'class-validator';

export enum ReminderType {
  ForMe = 'me',
  ForOthers = 'others',
}

export class FindRemindersDto {
  @IsOptional()
  @IsEnum(ReminderType)
  type: ReminderType = ReminderType.ForMe;
}
