import { PartialType } from '@nestjs/mapped-types';

import { CreateBankerDto } from './create-banker.dto';

export class UpdateBankerDto extends PartialType(CreateBankerDto) {}
