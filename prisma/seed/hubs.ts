import { Prisma } from '@prisma/client';

export const hubs: Prisma.HubCreateInput[] = [
  {
    name: 'Mathematics',
    description: 'Math articles',
    articlesCount: 4,
    tagsCount: 3,
  },
  {
    name: 'Programming',
    description: 'The art of creating computer programs',
    articlesCount: 1,
    tagsCount: 1,
  },
  {
    name: 'Blockchain',
    description:
      'Blockchain is a growing list of records, called blocks, that are linked using cryptography',
    articlesCount: 1,
    tagsCount: 1,
  },
];
