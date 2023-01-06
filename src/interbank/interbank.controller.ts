import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { BankerResponseDto } from '../bankers/dto/banker.response.dto';
import {
  ApiPaginatedResponse,
  ApiWrapResponse,
  Pagination,
  PaginationDto,
} from '../pagination';

import { InterbankTransactionQueryDto } from './dto/query.dto';
import { InterbankService } from './interbank.service';

@ApiTags('interbank')
@Controller('interbank')
export class InterbankController {
  constructor(private interbankService: InterbankService) {}

  @Get('account')
  @ApiOperation({
    summary: '',
  })
  @ApiOkResponse({
    description: '',
  })
  async getAccount(@Query('account_no') account_no: string) {
    if (account_no) {
      const user = await this.interbankService.getPaymentAccountInfo(
        account_no,
      );
      if (!user) {
        throw new BadRequestException({
          errorId: HttpStatus.NOT_FOUND,
          message: 'Account not found',
        });
      }
      return user;
    } else {
      throw new BadRequestException({
        errorId: HttpStatus.BAD_REQUEST,
        message: 'Invalid account_no',
      });
    }
  }

  @Get('all')
  @ApiOperation({
    summary: 'Fetch a non-paginated list of interbank transfer',
  })
  // @ApiWrapResponse(BankerResponseDto)
  @ApiOkResponse({
    description:
      'Successfully received a non-paginated list of interbank transfer',
    // type: [BankerResponseDto],
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
  @ApiOperation({
    summary: 'Fetch a paginated list of interbank transfer',
  })
  // @ApiPaginatedResponse(BankerResponseDto)
  async findAllWithPagination(
    @Pagination() pagination: PaginationDto,
    @Query() query: InterbankTransactionQueryDto,
  ) {
    console.log(query.from);

    try {
      return this.interbankService.findAllWithPagination(pagination, query);
    } catch (e) {
      throw e;
    }
  }

  @Get('statistic')
  // @ApiOperation({
  //   summary: 'Update detail info of a banker',
  // })
  // @ApiOkResponse({
  //   description: 'Successfully updated a record of banker',
  // })
  findStatistic() {
    try {
      return this.interbankService.findStatistic();
    } catch (e) {
      throw e;
    }
  }

  @Get(':maCKN')
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
    // type: UpdateBankerResponseDto,
  })
  findOne(@Param('maCKN', ParseIntPipe) id: number) {
    try {
      return this.interbankService.findOne(id);
    } catch (e) {
      throw e;
    }
  }
}
