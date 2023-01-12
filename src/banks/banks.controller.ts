import {
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiOkWrappedResponse } from '../swagger/swagger.decorator';

import { BanksService } from './banks.service';
import { BankResponseDto } from './dto/bank.response.dto';
import { VaiTro } from '@prisma/client';
import { Role } from '../common/decorators';
import { RoleGuard } from '../common/guards';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Role()
  @UseGuards(RoleGuard)
  @Get()
  @ApiTags('banks')
  @ApiOperation({
    summary: 'Fetch a list of banks',
  })
  @ApiOkWrappedResponse({
    description: 'Successfully fetched a list of banks',
    isArray: true,
    type: BankResponseDto,
  })
  async findAll(): Promise<{ data: BankResponseDto[] }> {
    const banks = await this.banksService.findAll().catch((e) => {
      throw new InternalServerErrorException({
        errorId: 'database_error',
        message: 'Cannot find banks',
      });
    });
    return {
      data: banks.map((bank) => ({ id: bank.maNH, tenNH: bank.tenNH })),
    };
  }
}
