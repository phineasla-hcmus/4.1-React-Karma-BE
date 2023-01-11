import { ApiProperty } from '@nestjs/swagger';

import { FeeType } from '../../types';

export class LocalTransferResponseDto {
  @ApiProperty()
  maCK: string;

  @ApiProperty()
  nguoiChuyen: string;

  @ApiProperty()
  nguoiNhan: string;

  @ApiProperty()
  soTien: number;

  @ApiProperty()
  noiDungCK: string;

  @ApiProperty()
  ngayCK: Date;

  @ApiProperty({ enum: FeeType })
  loaiCK: FeeType;

  @ApiProperty()
  phiCK: number;
}
