import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators';
import { InterbankRequestDto } from '../dto/interbank.request.dto';

import { InterbankApiService } from './api.service';
import { TransferApiDto } from './dto/api.dto';
import {
  GetAccountApiResponseDto,
  TransferApiResponseDto,
} from './dto/api.response.dto';

@Controller('interbank/api')
export class InterbankApiController {
  constructor(private apiService: InterbankApiService) {}

  @Public()
  @Post('account')
  @ApiOperation({
    summary: 'Fetch an interbank account info',
  })
  @ApiTags('API cho liên ngân hàng')
  @ApiOkResponse({
    type: GetAccountApiResponseDto,
    description: 'Successfully fetched an interbank account info',
  })
  async getAccount(
    @Body() body: InterbankRequestDto,
  ): Promise<GetAccountApiResponseDto> {
    return this.apiService.getAccount(body);
  }

  @Public()
  @Post('api/transfer')
  @ApiOperation({
    summary: 'Transfer balance between banks',
  })
  @ApiTags('API cho liên ngân hàng')
  @ApiOkResponse({
    type: TransferApiResponseDto,
  })
  async externalBankTransfer(
    @Body() body: TransferApiDto,
  ): Promise<TransferApiResponseDto> {
    return this.apiService.transfer(body);
  }
}
