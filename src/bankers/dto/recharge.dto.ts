import { ApiProperty } from '@nestjs/swagger';

export class RechargeDto {
  @ApiProperty({
    description: 'Account_no - a string with length of 12 digits',
  })
  soTK: string;

  @ApiProperty({
    description: 'Username - a string with length of 8 digits',
  })
  tenDangNhap: string;

  @ApiProperty({
    description: 'Amount of money that banker recharges for user',
    minimum: 0,
    default: 0,
  })
  soTienThem: number;
}
