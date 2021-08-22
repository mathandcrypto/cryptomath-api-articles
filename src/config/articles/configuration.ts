import { registerAs } from '@nestjs/config';
import { ArticlesConfig } from './interfaces/articles-config.interface';

export default registerAs<ArticlesConfig>('articles', () => ({
  articlesListMaxLimit: Number(process.env.ARTICLES_LIST_MAX_LIMIT),
  hubsListMaxLimit: Number(process.env.HUBS_LIST_MAX_LIMIT),
  tagsListMaxLimit: Number(process.env.TAGS_LIST_MAX_LIMIT),
}));
