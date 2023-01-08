import { IsOptional } from 'class-validator';

export class FindRemindersDto {
  @IsOptional()
  me: boolean;
}
