import { Controller } from '@nestjs/common';
import {
  ArticlesServiceControllerMethods,
  ArticlesServiceController,
  FindArticlesRequest,
  FindArticlesResponse,
  FindHubsRequest,
  FindHubsResponse,
  FindTagsRequest,
  FindTagsResponse,
} from 'cryptomath-api-proto/types/articles';
import { ArticlesService } from './articles.service';
import { HubsService } from './hubs.service';
import { TagsService } from './tags.service';
import { ArticleSerializerService } from './serializers/article.serializer';
import { HubSerializerService } from './serializers/hub.serializer';
import { TagSerializerService } from './serializers/tag.serializer';

@Controller()
@ArticlesServiceControllerMethods()
export class ArticlesController implements ArticlesServiceController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly hubsService: HubsService,
    private readonly tagsService: TagsService,
    private readonly articleSerializerService: ArticleSerializerService,
    private readonly hubSerializerService: HubSerializerService,
    private readonly tagSerializerService: TagSerializerService,
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

  async findTags({
    filters,
    sorts,
    offset,
    limit,
  }: FindTagsRequest): Promise<FindTagsResponse> {
    const [isTagsFound, skippedTags, totalTags, tags] =
      await this.tagsService.findMultiple(filters, sorts, offset, limit);

    if (!isTagsFound) {
      return {
        isTagsFound: false,
        limit,
        total: 0,
        tags: [],
      };
    }

    return {
      isTagsFound: true,
      limit: skippedTags,
      total: totalTags,
      tags: await this.tagSerializerService.serializeCollection(tags),
    };
  }
}
