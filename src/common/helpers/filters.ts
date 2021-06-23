import { Prisma } from '@prisma/client';

export const getNumericFilterCondition = (
  equals: number | undefined,
  min: number | undefined,
  max: number | undefined,
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
  start: Date | undefined,
  end: Date | undefined,
): Prisma.DateTimeFilter => {
  return {
    ...(start && { gte: start }),
    ...(end && { lte: end }),
  };
};
