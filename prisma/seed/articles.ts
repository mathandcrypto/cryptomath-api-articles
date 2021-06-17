import { Prisma } from '@prisma/client';

export const articles: Prisma.ArticleCreateInput[] = [
  {
    title: 'Test article',
    abstract: 'Test abstract',
    userId: 1,
    hubs: {
      create: [
        {
          hub: {
            connect: { id: 1 },
          },
        },
      ],
    },
    tags: {
      create: [
        {
          tag: {
            connect: { id: 1 },
          },
        },
      ],
    },
  },
];
