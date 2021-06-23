import { Controller } from '@nestjs/common';
import {
  ArticlesServiceControllerMethods,
  ArticlesServiceController,
  FindArticlesRequest,
  FindArticlesResponse,
  FindHubsRequest,
  FindHubsResponse,
} from 'cryptomath-api-proto/types/articles';
import { ArticlesService } from './articles.service';
import { HubsService } from './hubs.service';
import { ArticleSerializerService } from './serializers/article.serializer';
import { HubSerializerService } from './serializers/hub.serializer';

@Controller()
@ArticlesServiceControllerMethods()
export class ArticlesController implements ArticlesServiceController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly hubsService: HubsService,
    private readonly articleSerializerService: ArticleSerializerService,
    private readonly hubSerializerService: HubSerializerService,
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

  async findHubs({
    filters,
    sorts,
    offset,
    limit,
  }: FindHubsRequest): Promise<FindHubsResponse> {
    const [isHubsFound, skippedHubs, totalHubs, hubs] =
      await this.hubsService.findMultiple(filters, sorts, offset, limit);

    if (!isHubsFound) {
      return {
        isHubsFound: false,
        limit,
        total: 0,
        hubs: [],
      };
    }

    return {
      isHubsFound: true,
      limit: skippedHubs,
      total: totalHubs,
      hubs: await this.hubSerializerService.serializeCollection(hubs),
    };
  }
}
