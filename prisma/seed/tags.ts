import { Prisma } from '@prisma/client';

export const tags: Prisma.TagCreateInput[] = [
  {
    name: 'complex-analysis',
    description:
      'For questions mainly about theory of complex analytic/holomorphic functions of one complex variable.',
    articlesCount: 1,
    hub: {
      connect: {
        id: 1,
      },
    },
  },
];
