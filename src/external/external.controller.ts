import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';

import { FindOneExternalDto } from './dto/find-one-external.dto';
import { TransferDto } from './dto/transfer.dto';
import { ExternalService } from './external.service';

@Controller('external')
export class ExternalController {
  constructor(private externalService: ExternalService) {}

  @Post('account')
  async findOneAccount(@Body() findOneAccountDto: FindOneExternalDto) {
    const data = await this.externalService.findOneExternal(findOneAccountDto);
    if (data != null) {
      return data;
    }
    throw new NotFoundException({
      errorId: 'bank_not_found',
      message: `Cannot find bank with name ${findOneAccountDto.nganHang}`,
    });
  }

  @Post('transfer')
  async transfer(@Body() transferDto: TransferDto) {
    try {
      return this.externalService.transfer(transferDto);
    } catch (e) {
      throw e;
    }
  }
}
