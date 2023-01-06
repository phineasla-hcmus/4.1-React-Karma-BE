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

import {
  ApiPaginatedResponse,
  ApiWrapResponse,
  Pagination,
  PaginationDto,
} from '../pagination';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  CreateUserResponseDto,
  UpdateUserResponseDto,
  UserResponseDto,
} from './dto/user.response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a user',
  })
  @ApiOkResponse({
    description: 'Return information of the created user',
    type: CreateUserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (e) {
      throw e;
    }
  }

  @Get('all')
  @ApiOperation({
    summary: 'Fetch a non-paginated list of users',
  })
  @ApiWrapResponse(UserResponseDto)
  async findAllWithoutPagination(@Body() res: UserResponseDto) {
    try {
      const data = await this.usersService.findAllWithoutPagination();
      return { data };
    } catch (e) {
      throw e;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Fetch a paginated list of users',
  })
  @ApiPaginatedResponse(UserResponseDto)
  async findAllWithPagination(@Pagination() pagination: PaginationDto) {
    try {
      const data = await this.usersService.findAllWithPagination(pagination);
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
    type: UserResponseDto,
  })
  findOne(@Param('maTK', ParseIntPipe) id: number) {
    try {
      return this.usersService.findOne(id);
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
    type: UpdateUserResponseDto,
  })
  update(
    @Param('maTK', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
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
    await this.usersService.remove(+id);
    return { data: { status: HttpStatus.OK } };
  }
}
