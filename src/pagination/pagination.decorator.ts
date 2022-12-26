import { Query } from '@nestjs/common';

import { PaginationPipe } from './pagination.pipe';

export const Pagination = () => Query(PaginationPipe);
