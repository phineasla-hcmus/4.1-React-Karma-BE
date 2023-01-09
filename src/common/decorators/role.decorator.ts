import { SetMetadata } from '@nestjs/common';
import { VaiTro } from '@prisma/client';

export const Role = (...args: VaiTro[]) => SetMetadata('role', args);
