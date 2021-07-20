import { Controller } from '@nestjs/common';
import {
  ArticlesServiceController,
  ArticlesServiceControllerMethods,
  CreateHubRequest,
  CreateHubResponse,
  FindArticlesRequest,
  FindArticlesResponse,
  FindHubRequest,
  FindHubResponse,
  FindHubsRequest,
  FindHubsResponse,
  FindTagRequest,
  FindTagResponse,
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

  async findHub({ hubId }: FindHubRequest): Promise<FindHubResponse> {
    const [isHubExists, hub] = await this.hubsService.findOne(hubId);

    if (!isHubExists) {
      return {
        isHubExists: false,
        hub: null,
      };
    }

    return {
      isHubExists: true,
      hub: await this.hubSerializerService.serialize(hub),
    };
  }

  async findTag({ tagId }: FindTagRequest): Promise<FindTagResponse> {
    const [isTagExists, tag] = await this.tagsService.findOne(tagId);

    if (!isTagExists) {
      return {
        isTagExists: false,
        tag: null,
      };
    }

    return {
      isTagExists: true,
      tag: await this.tagSerializerService.serialize(tag),
    };
  }

  async creteHub({
    name,
    description,
  }: CreateHubRequest): Promise<CreateHubResponse> {
    const [createHubStatus, hub] = await this.hubsService.createHub(
      name,
      description,
    );

    if (!createHubStatus) {
      return {
        isHubCreated: false,
        hub: null,
      };
    }

    return {
      isHubCreated: true,
      hub: await this.hubSerializerService.serialize(hub),
    };
  }
}
