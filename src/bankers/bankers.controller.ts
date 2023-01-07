import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { RechargeDto } from '../bankers/dto/recharge.dto';
import { Pagination, PaginationDto } from '../pagination';
import {
  ApiOkPaginatedResponse,
  ApiOkWrappedResponse,
} from '../swagger/swagger.decorator';

import { BankersService } from './bankers.service';
import {
  BankerResponseDto,
  UpdateBankerResponseDto,
} from './dto/banker.response.dto';
import { CreateBankerDto } from './dto/create-banker.dto';
import { UpdateBankerDto } from './dto/update-banker.dto';

@ApiTags('bankers')
@Controller('bankers')
export class BankersController {
  constructor(private readonly bankersService: BankersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a banker',
  })
  @ApiOkResponse({
    description: 'Return information of the created banker',
    type: BankerResponseDto,
  })
  async create(@Body() createBankerDto: CreateBankerDto) {
    try {
      return await this.bankersService.create(createBankerDto);
    } catch (e) {
      throw e;
    }
  }

  @Get('all')
  @ApiOperation({
    summary: 'Fetch a non-paginated list of bankers',
  })
  @ApiOkWrappedResponse({
    // description: 'Successfully transfer',
    type: BankerResponseDto,
  })
  async findAllWithoutPagination() {
    try {
      const data = await this.bankersService.findAllWithoutPagination();
      return { data };
    } catch (e) {
      throw e;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Fetch a paginated list of bankers',
  })
  @ApiOkPaginatedResponse({ type: BankerResponseDto })
  async findAllWithPagination(@Pagination() pagination: PaginationDto) {
    try {
      const data = await this.bankersService.findAllWithPagination(pagination);
      return data;
    } catch (e) {
      throw e;
    }
  }

  @Get(':maTK')
  @ApiOperation({
    summary: 'Fetch detailed data of a banker',
  })
  @ApiParam({ name: 'maTK', description: 'Mã tài khoản', type: 'number' })
  @ApiOkResponse({
    description: 'Successfully return a record of banker',
    type: BankerResponseDto,
  })
  findOne(
    @Param('maTK', ParseIntPipe)
    id: number,
  ) {
    try {
      return this.bankersService.findOne(id);
    } catch (e) {
      throw e;
    }
  }

  @Patch(':maTK')
  @ApiOperation({
    summary: 'Update detail info of a banker',
  })
  @ApiParam({ name: 'maTK', description: 'Mã tài khoản', type: 'number' })
  @ApiOkResponse({
    description: 'Successfully updated a record of banker',
    type: UpdateBankerResponseDto,
  })
  update(
    @Param('maTK', ParseIntPipe) id: number,
    @Body() updateBankerDto: UpdateBankerDto,
  ) {
    return this.bankersService.update(id, updateBankerDto);
  }

  @Delete(':maTK')
  @ApiOperation({
    summary: 'Delete a banker',
  })
  @ApiParam({ name: 'maTK', description: 'Mã tài khoản', type: 'number' })
  @ApiOkResponse({
    description: 'Successfully deleted a record of banker',
  })
  async remove(@Param('maTK') id: string) {
    await this.bankersService.remove(+id);
    return { data: { status: HttpStatus.OK } };
  }

  @Patch(':id/recharge')
  @ApiOperation({
    summary: 'Recharge money for a user',
  })
  @ApiParam({ name: 'maTK', description: 'Mã tài khoản', type: 'number' })
  @ApiOkResponse({
    description: 'Successfully recharged money for a user',
  })
  recharge(
    @Param('id', ParseIntPipe) id: number,
    @Body() rechargeDto: RechargeDto,
  ) {
    return this.bankersService.recharge(id, rechargeDto);
  }
}
