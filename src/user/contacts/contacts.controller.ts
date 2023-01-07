import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtUser } from '../../jwt/jwt.decorator';
import { JwtUserDto } from '../../jwt/jwt.dto';
import {
  ApiCreatedWrappedResponse,
  ApiOkWrappedResponse,
} from '../../swagger/swagger.decorator';

import { ContactsService } from './contacts.service';
import { ContactResponseDto } from './dto/contact.response.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@ApiTags('user/contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get('all')
  @ApiOperation({
    summary: 'Fetch a non-paginated list of contacts',
  })
  @ApiOkWrappedResponse({ type: ContactResponseDto, isArray: true })
  async findAllWithoutPagination(@JwtUser() user: JwtUserDto) {
    const { maTK } = user;
    const data = await this.contactsService.findAllWithoutPagination(maTK);
    return { data };
  }

  @Post()
  @ApiOperation({
    summary: 'Create new contact',
  })
  @ApiCreatedWrappedResponse({ type: ContactResponseDto })
  async create(
    @JwtUser() user: JwtUserDto,
    @Body() createContactsDto: CreateContactDto,
  ) {
    const { maTK } = user;
    const data = await this.contactsService.create(maTK, createContactsDto);
    return { data };
  }

  @Patch(':nguoiDung')
  @ApiOkWrappedResponse({ type: ContactResponseDto })
  async update(
    @JwtUser() user: JwtUserDto,
    @Param('nguoiDung') nguoiDung: string,
    @Body() updateContactsDto: UpdateContactDto,
  ) {
    const { maTK } = user;
    const contact = await this.contactsService.findOne({
      maTK: maTK,
      nguoiDung: nguoiDung,
    });
    if (!contact) {
      throw new BadRequestException({
        errorId: 'bad_request',
        message: 'Invalid request for creating contact',
      });
    }
    const data = await this.contactsService.update(
      maTK,
      nguoiDung,
      updateContactsDto,
    );
    return { data };
  }

  @Delete(':nguoiDung')
  @ApiOkWrappedResponse({ type: ContactResponseDto })
  async remove(
    @JwtUser() user: JwtUserDto,
    @Param('nguoiDung') nguoiDung: string,
  ) {
    const { maTK } = user;
    const contact = await this.contactsService.findOne({
      maTK: maTK,
      nguoiDung: nguoiDung,
    });
    if (!contact) {
      throw new BadRequestException({
        errorId: 'bad_request',
        message: 'Invalid request for creating contact',
      });
    }
    const data = await this.contactsService.remove(maTK, nguoiDung);
    return { data };
  }
}
