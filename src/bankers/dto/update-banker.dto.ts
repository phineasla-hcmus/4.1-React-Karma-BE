import { PartialType } from '@nestjs/swagger';

import { CreateBankerDto } from './create-banker.dto';

export class UpdateBankerDto extends PartialType(CreateBankerDto) {}
