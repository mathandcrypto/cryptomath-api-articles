import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { Article } from '../interfaces/article.interface';
import { Article as ArticleProto } from 'cryptomath-api-proto/types/articles';

@Injectable()
export class ArticleSerializerService extends BaseSerializerService<
  Article,
  ArticleProto
> {
  async serialize(article: Article): Promise<ArticleProto> {
    return {
      id: article.id,
      title: article.title,
      abstract: article.abstract,
      userId: article.userId,
      hubs: article.hubs.map((hubOnArticle) => ({
        id: hubOnArticle.hub.id,
        name: hubOnArticle.hub.name,
      })),
      tags: article.tags.map((tagOnArticle) => ({
        id: tagOnArticle.tag.id,
        name: tagOnArticle.tag.name,
      })),
      commentsCount: article.commentsCount,
      rating: article.rating,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }
}
