import { Prisma } from '@prisma/client';

export const getNumericFilterCondition = (
  equals?: number,
  min?: number,
  max?: number,
): Prisma.IntFilter => {
  if (equals) {
    return { equals };
  } else {
    return {
      ...(min && { gte: min }),
      ...(max && { lte: max }),
    };
  }
};

export const getDateTimeFilterCondition = (
  start?: Date,
  end?: Date,
): Prisma.DateTimeFilter => {
  return {
    ...(start && { gte: start }),
    ...(end && { lte: end }),
  };
};
