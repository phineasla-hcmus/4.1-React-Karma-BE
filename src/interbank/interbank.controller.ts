import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
} from '@nestjs/swagger';

import { CryptographyService } from '../cryptography/cryptography.service';
import { Pagination, PaginationDto } from '../pagination';
import { PaymentAccountsService } from '../paymentAccounts/paymentAccounts.service';
import {
  ApiOkWrappedResponse,
  ApiPaginatedResponse,
} from '../swagger/swagger.decorator';

import { InterbankTransferResponseDto } from './dto/interbank.response.dto';
import { InterbankTransactionQueryDto } from './dto/query.dto';
import { InterbankService } from './interbank.service';

@Controller('interbank')
export class InterbankController {
  constructor(
    private interbankService: InterbankService,
    private paymenAccountsService: PaymentAccountsService,
    private cryptographyService: CryptographyService,
  ) {}

  @Get('all')
  @ApiTags('interbank')
  @ApiOperation({
    summary: 'Fetch a non-paginated list of interbank transfer',
  })
  @ApiOkWrappedResponse({
    description:
      'Successfully received a non-paginated list of interbank transfer',
    type: InterbankTransferResponseDto,
  })
  async findAllWithoutPagination() {
    try {
      const data = await this.interbankService.findAllWithoutPagination();
      return { data };
    } catch (e) {
      throw e;
    }
  }

  @Get()
  @ApiTags('interbank')
  @ApiOperation({
    summary: 'Fetch a paginated list of interbank transfer',
  })
  @ApiPaginatedResponse({ type: InterbankTransferResponseDto })
  async findAllWithPagination(
    @Pagination() pagination: PaginationDto,
    @Query() query: InterbankTransactionQueryDto,
  ) {
    try {
      return this.interbankService.findAllWithPagination(pagination, query);
    } catch (e) {
      throw e;
    }
  }

  @Get(':maCKN')
  @ApiTags('interbank')
  @ApiOperation({
    summary: 'Get detail of an interbank transfer',
  })
  @ApiParam({
    name: 'maCKN',
    description: 'Mã chuyển khoản ngoài',
    type: 'number',
  })
  @ApiOkResponse({
    description: 'Successfully fetched a record of interbank transfer',
    type: InterbankTransferResponseDto,
  })
  findOne(@Param('maCKN', ParseIntPipe) id: number) {
    try {
      return this.interbankService.findOne(id);
    } catch (e) {
      throw e;
    }
  }
}
