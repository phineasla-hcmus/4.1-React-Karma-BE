import { PartialType } from '@nestjs/swagger';

import { CreateUserDto } from './create-client.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
