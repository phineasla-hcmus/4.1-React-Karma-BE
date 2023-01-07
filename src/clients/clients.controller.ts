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

import { Pagination, PaginationDto } from '../pagination';
import {
  ApiOkWrappedResponse,
  ApiPaginatedResponse,
} from '../swagger/swagger.decorator';

import { ClientsService } from './clients.service';
import {
  CreateClientResponseDto,
  UpdateClientResponseDto,
  ClientResponseDto,
} from './dto/client.response.dto';
import { CreateUserDto } from './dto/create-client.dto';
import { UpdateUserDto } from './dto/update-client.dto';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a client',
  })
  @ApiOkResponse({
    description: 'Return information of the created client',
    type: CreateClientResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.clientsService.create(createUserDto);
    } catch (e) {
      throw e;
    }
  }

  @Get('all')
  @ApiOperation({
    summary: 'Fetch a non-paginated list of clients',
  })
  @ApiOkWrappedResponse({ type: ClientResponseDto, isArray: true })
  async findAllWithoutPagination(@Body() res: ClientResponseDto) {
    try {
      const data = await this.clientsService.findAllWithoutPagination();
      return { data };
    } catch (e) {
      throw e;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Fetch a paginated list of clients',
  })
  @ApiPaginatedResponse({ type: ClientResponseDto })
  async findAllWithPagination(@Pagination() pagination: PaginationDto) {
    try {
      const data = await this.clientsService.findAllWithPagination(pagination);
      return data;
    } catch (e) {
      throw e;
    }
  }

  @Get(':maTK')
  @ApiOperation({
    summary: 'Fetch detailed data of a user',
  })
  @ApiParam({ name: 'maTK', description: 'Mã tài khoản', type: 'number' })
  @ApiOkResponse({
    description: 'Successfully return a record of user',
    type: ClientResponseDto,
  })
  findOne(@Param('maTK', ParseIntPipe) id: number) {
    try {
      return this.clientsService.findOne(id);
    } catch (e) {
      throw e;
    }
  }

  @Patch(':maTK')
  @ApiOperation({
    summary: 'Update detail info of a user',
  })
  @ApiParam({ name: 'maTK', description: 'Mã tài khoản', type: 'number' })
  @ApiOkResponse({
    description: 'Successfully updated a record of user',
    type: UpdateClientResponseDto,
  })
  update(
    @Param('maTK', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.clientsService.update(id, updateUserDto);
  }

  @Delete(':maTK')
  @ApiOperation({
    summary: 'Delete a user',
  })
  @ApiParam({ name: 'maTK', description: 'Mã tài khoản', type: 'number' })
  @ApiOkResponse({
    description: 'Successfully deleted a record of user',
  })
  async remove(@Param('maTK') id: string) {
    await this.clientsService.remove(+id);
    return { data: { status: HttpStatus.OK } };
  }
}
