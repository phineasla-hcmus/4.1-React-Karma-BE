import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FindOneAccountDto } from './dto/find-one-account.dto';
import { TransferDto } from './dto/transfer.dto';
import { ExternalService } from './external.service';
import { WrapFindOneAccountResponseDto } from './hcmusbank/dto/find-one-account-response.dto';
@ApiTags('external')
@Controller('external')
export class ExternalController {
  constructor(private externalService: ExternalService) {}

  @Post('account')
  @ApiOperation({
    summary: 'Return an account number of HCMUSBank',
  })
  @ApiOkResponse({
    description: 'Successfully get an account number of HCMUSBank',
    type: WrapFindOneAccountResponseDto,
  })
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
  @ApiOperation({
    summary: 'Interbank transfer',
  })
  @ApiOkResponse({
    description: 'Successfully transfer',
    type: FindOneAccountDto,
  })
  async transfer(@Body() transferDto: TransferDto) {
    try {
      return this.externalService.transfer(transferDto);
    } catch (e) {
      throw e;
    }
  }
}
