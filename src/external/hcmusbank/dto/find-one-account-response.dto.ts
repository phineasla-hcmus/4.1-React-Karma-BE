import { ApiProperty } from '@nestjs/swagger';

export interface FindOneAccountResponseDto {
  message: string;
  id: string;
  accountNumber: string;
  firstName: string;
  lastName: string;
}
