import { Controller } from '@nestjs/common';
import {
  ArticlesServiceController,
  ArticlesServiceControllerMethods,
  FindArticlesRequest,
  FindArticlesResponse,
} from '@cryptomath/cryptomath-api-proto/types/articles';
import { ArticlesService } from './articles.service';
import { ArticleSerializerService } from './serializers/article.serializer';

@Controller()
@ArticlesServiceControllerMethods()
export class ArticlesController implements ArticlesServiceController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly articleSerializerService: ArticleSerializerService,
  ) {}

  async findArticles({
    filters,
    sorts,
    offset,
    limit,
  }: FindArticlesRequest): Promise<FindArticlesResponse> {
    const [isArticlesFound, skippedArticles, totalArticles, articles] =
      await this.articlesService.findMultiple(filters, sorts, offset, limit);

    if (!isArticlesFound) {
      return {
        isArticlesFound: false,
        limit,
        total: 0,
        articles: [],
      };
    }

    return {
      isArticlesFound: true,
      limit: skippedArticles,
      total: totalArticles,
      articles: await this.articleSerializerService.serializeCollection(
        articles,
      ),
    };
  }
}
