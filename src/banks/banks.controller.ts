import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { BanksService } from './banks.service';
import { BankResponseDto } from './dto/bank.response.dto';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Get()
  @ApiTags('banks')
  @ApiOperation({
    summary: 'Fetch a list of banks',
  })
  @ApiOkResponse({
    description: 'Successfully fetched a list of banks',
    type: [BankResponseDto],
  })
  async findAll() {
    const data = await this.banksService.findAll();
    return { data };
  }
}
