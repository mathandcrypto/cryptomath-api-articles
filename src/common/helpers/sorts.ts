import { SortDirection } from 'cryptomath-api-proto/types/sorts';
import { Prisma } from '@prisma/client';

export const getOrderDirection = (
  direction: SortDirection,
): Prisma.SortOrder => {
  return direction === SortDirection.ASC ? 'asc' : 'desc';
};
