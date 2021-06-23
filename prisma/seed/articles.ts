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
    createdAt: new Date(2020, 12, 31, 12, 12, 12),
  },
  {
    title: String.raw`Upper bound $x\mapsto\frac{W\left(\frac{2\alpha}{x^2}\right)}{2\alpha}$ for $x\in[0,1]$ Lambert function`,
    abstract: 'Test abstract',
    userId: 2,
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
        {
          tag: {
            connect: { id: 2 },
          },
        },
      ],
    },
    createdAt: new Date(2020, 5, 6, 23, 18, 42),
  },
  {
    title: String.raw`Q: Optimizing blockchain token purchase. Finding maximum value of a function.`,
    abstract: 'test',
    userId: 3,
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
            connect: { id: 2 },
          },
        },
        {
          tag: {
            connect: { id: 3 },
          },
        },
      ],
    },
    createdAt: new Date(2020, 5, 7, 1, 29, 42),
  },
  {
    title: String.raw`Is $P=NP$ an $NP$-complete problem?`,
    abstract: 'test',
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
            connect: { id: 3 },
          },
        },
      ],
    },
    createdAt: new Date(2020, 5, 7, 7, 15, 11),
  },
  {
    title: String.raw`PHP Best Practices to Follow in 2020`,
    abstract:
      'Web development trends seem to be heading more towards server-side scripting languages over client-side scripting languages. And it can be difficult to decide where to start and what to choose.',
    userId: 2,
    hubs: {
      create: [
        {
          hub: {
            connect: { id: 2 },
          },
        },
      ],
    },
    tags: {
      create: [
        {
          tag: {
            connect: { id: 4 },
          },
        },
      ],
    },
    createdAt: new Date(2020, 5, 8, 10, 51, 42),
  },
  {
    title: String.raw`Difference between various blockchain protocols`,
    abstract: 'Blockchain',
    userId: 3,
    hubs: {
      create: [
        {
          hub: {
            connect: { id: 3 },
          },
        },
      ],
    },
    tags: {
      create: [
        {
          tag: {
            connect: { id: 5 },
          },
        },
      ],
    },
  },
];
