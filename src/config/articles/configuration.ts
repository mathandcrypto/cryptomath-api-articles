import { registerAs } from '@nestjs/config';

export default registerAs('articles', () => ({
  articlesListMaxLimit: process.env.ARTICLES_LIST_MAX_LIMIT,
  hubsListMaxLimit: process.env.HUBS_LIST_MAX_LIMIT,
}));
