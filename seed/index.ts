import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { hubs } from './data/hubs';
import { tags } from './data/tags';
import { articles } from './data/articles';

dotenv.config();

const prisma = new PrismaClient();

async function seedHubs() {
  console.log('Start seeding hubs...');

  await Promise.all(
    hubs.map(async (hub) => {
      const createdHub = await prisma.hub.create({
        data: hub,
      });

      console.log(`Created hub with id: ${createdHub.id}`);
    }),
  );

  console.log('Seeding hubs finished.');
}

async function seedTags() {
  console.log('Start seeding tags...');

  await Promise.all(
    tags.map(async (tag) => {
      const createdTag = await prisma.tag.create({
        data: tag,
      });

      console.log(`Created hub with id: ${createdTag.id}`);
    }),
  );

  console.log('Seeding tags finished.');
}

async function seedArticles() {
  console.log(`Start seeding articles...`);

  await Promise.all(
    articles.map(async (article) => {
      const createdArticle = await prisma.article.create({
        data: article,
      });

      console.log(`Created articles with id: ${createdArticle.id}`);
    }),
  );

  console.log('Seeding articles finished.');
}

async function main() {
  await seedHubs();
  await seedTags();
  await seedArticles();
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
