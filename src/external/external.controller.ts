import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindOneAccountDto } from './dto/find-one-account.dto';
import { TransferDto } from './dto/transfer.dto';
import { ExternalService } from './external.service';

@ApiTags('external')
@Controller('external')
export class ExternalController {
  constructor(private externalService: ExternalService) {}

  @Post('account')
  async findOneAccount(@Body() findOneAccountDto: FindOneAccountDto) {
    const data = await this.externalService.findOneAccount(findOneAccountDto);
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
