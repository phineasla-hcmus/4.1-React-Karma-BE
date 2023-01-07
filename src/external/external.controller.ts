import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiOkWrappedResponse } from '../swagger/swagger.decorator';

import { FindOneExternalDto } from './dto/find-one-external.dto';
import { TransferDto, TransferResponseDto } from './dto/transfer.dto';
import { ExternalService } from './external.service';
import { FindOneAccountResponseDto } from './hcmusbank/dto/find-one-account-response.dto';
@ApiTags('external')
@Controller('external')
export class ExternalController {
  constructor(private externalService: ExternalService) {}

  @Post('account')
  @ApiOperation({
    summary: 'Fetch an account info of HCMUSBank',
  })
  @ApiBody({
    type: FindOneExternalDto,
  })
  @ApiOkWrappedResponse({
    description: 'Successfully get an account number of HCMUSBank',
    type: FindOneAccountResponseDto,
  })
  async findOneAccount(@Body() findOneAccountDto: FindOneExternalDto) {
    const data = await this.externalService.findOneExternal(findOneAccountDto);
    if (data != null) {
      return { data };
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
    type: TransferResponseDto,
  })
  async transfer(@Body() transferDto: TransferDto) {
    try {
      return { data: await this.externalService.transfer(transferDto) };
    } catch (e) {
      throw e;
    }
  }
}
