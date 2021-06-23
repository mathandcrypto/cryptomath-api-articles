import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { Article } from '../interfaces/article.interface';
import { Article as ArticleProto } from 'cryptomath-api-proto/types/articles';
import { HubSerializerService } from './hub.serializer';
import { TagSerializerService } from './tag.serializer';
import { getUnixTime } from 'date-fns';

@Injectable()
export class ArticleSerializerService extends BaseSerializerService<
  Article,
  ArticleProto
> {
  constructor(
    private readonly hubSerializerService: HubSerializerService,
    private readonly tagSerializerService: TagSerializerService,
  ) {
    super();
  }

  async serialize(article: Article): Promise<ArticleProto> {
    return {
      id: article.id,
      title: article.title,
      abstract: article.abstract,
      userId: article.userId,
      hubs: await this.hubSerializerService.serializeCollection(
        article.hubs.map((hubOnArticle) => hubOnArticle.hub),
      ),
      tags: await this.tagSerializerService.serializeCollection(
        article.tags.map((tagsOnArticle) => tagsOnArticle.tag),
      ),
      commentsCount: article.commentsCount,
      rating: article.rating,
      createdAt: getUnixTime(article.createdAt),
      updatedAt: getUnixTime(article.updatedAt),
    };
  }
}
