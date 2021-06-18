import { registerAs } from '@nestjs/config';

export default registerAs('articles', () => ({
  listMaxLimit: process.env.ARTICLES_LIST_MAX_LIMIT,
}));