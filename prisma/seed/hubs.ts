import { Prisma } from '@prisma/client';

export const hubs: Prisma.HubCreateInput[] = [
  {
    name: 'Mathematics',
    description: 'Math articles',
    articlesCount: 1,
    tagsCount: 1,
  },
];
