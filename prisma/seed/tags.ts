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
  {
    name: 'blockchain',
    description: 'Mathematical aspects of blockchain',
    articlesCount: 1,
    hub: {
      connect: {
        id: 1,
      },
    },
  },
  {
    name: 'algorithms',
    description:
      'An algorithm is a sequence of well-defined steps that defines an abstract solution to a problem. Use this tag when your issue is related to algorithm design.',
    hub: {
      connect: {
        id: 1,
      },
    },
  },
  {
    name: 'php',
    description:
      'PHP is a widely used, high-level, dynamic, object-oriented and interpreted scripting language primarily designed for server-side web development. Used for questions about the PHP language.',
    hub: {
      connect: {
        id: 2,
      },
    },
  },
  {
    name: 'blockchain',
    description:
      'A blockchain is an open, distributed ledger that can record transactions between two parties efficiently and in a verifiable and permanent way. The ledger itself can also be programmed to trigger transactions automatically.',
    hub: {
      connect: {
        id: 3,
      },
    },
  },
];
