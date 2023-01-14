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
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { VaiTro } from '@prisma/client';

import { RechargeDto } from '../bankers/dto/recharge.dto';
import { JwtUser, Role } from '../common/decorators';
import { RoleGuard } from '../common/guards';
import { JwtPayloadDto } from '../jwt/jwt.dto';
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

  @Role(VaiTro.Banker)
  @UseGuards(RoleGuard)
  @Patch('recharge')
  @ApiOperation({
    summary: 'Recharge money for a user',
  })
  @ApiOkResponse({
    description: 'Successfully recharged money for a user',
  })
  recharge(@Body() rechargeDto: RechargeDto, @JwtUser() user: JwtPayloadDto) {
    return this.bankersService.recharge(user.maTK, rechargeDto);
  }

  @Role(VaiTro.Admin)
  @UseGuards(RoleGuard)
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

  @Role(VaiTro.Admin)
  @UseGuards(RoleGuard)
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

  @Role(VaiTro.Admin)
  @UseGuards(RoleGuard)
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

  @Role(VaiTro.Admin)
  @UseGuards(RoleGuard)
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
    return this.bankersService.findOne(id);
  }

  @Role(VaiTro.Admin)
  @UseGuards(RoleGuard)
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

  @Role(VaiTro.Admin)
  @UseGuards(RoleGuard)
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
}
