import { IsNotEmpty } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  nguoiDung: string;

  tenGoiNho: string;
}
