import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@providers/prisma/prisma.service';
import {
  ArticleFilters,
  ArticleSorts,
} from 'cryptomath-api-proto/types/articles';
import { Article } from './interfaces/article.interface';
import { Prisma } from '@prisma/client';
import { ArticlesConfigService } from '@config/articles/config.service';
import { getOrderDirection } from '@common/helpers/sorts';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly articlesConfigService: ArticlesConfigService,
  ) {}

  protected getWhereInput(filters: ArticleFilters): Prisma.ArticleWhereInput {
    const whereInput = {} as Prisma.ArticleWhereInput;

    if (filters.id) {
      const { id: articleId } = filters.id;

      whereInput.id = articleId;
    }

    if (filters.title) {
      const { text: articleTitle } = filters.title;

      whereInput.title = { contains: articleTitle };
    }

    if (filters.user) {
      const { id: userId } = filters.user;

      whereInput.userId = userId;
    }

    if (filters.hubs) {
      const { idList: hubsIdList } = filters.hubs;

      whereInput.hubs = { some: { hubId: { in: hubsIdList } } };
    }

    if (filters.tags) {
      const { idList: tagsIdList } = filters.tags;

      whereInput.tags = { some: { tagId: { in: tagsIdList } } };
    }

    if (filters.comments) {
      const {
        equals: commentsEqual,
        min: commentsMin,
        max: commentsMax,
      } = filters.comments;

      if (commentsEqual) {
        whereInput.commentsCount = commentsEqual;
      } else {
        whereInput.commentsCount = {
          ...(commentsMin && { gte: commentsMin }),
          ...(commentsMax && { lte: commentsMax }),
        };
      }
    }

    if (filters.rating) {
      const {
        equals: ratingEqual,
        min: ratingMin,
        max: ratingMax,
      } = filters.rating;

      if (ratingEqual) {
        whereInput.rating = ratingEqual;
      } else {
        whereInput.rating = {
          ...(ratingMin && { gte: ratingMin }),
          ...(ratingMax && { lte: ratingMax }),
        };
      }
    }

    if (filters.createdAt) {
      const {
        equals: createdDate,
        start: createdAfter,
        end: createdBefore,
      } = filters.createdAt;

      if (createdDate) {
        whereInput.createdAt = createdDate;
      } else {
        whereInput.createdAt = {
          ...(createdAfter && { gte: createdAfter }),
          ...(createdBefore && { lte: createdBefore }),
        };
      }
    }

    return whereInput;
  }

  protected getOrderByInput(sorts: ArticleSorts): Prisma.ArticleOrderByInput {
    const orderByInput = {} as Prisma.ArticleOrderByInput;

    if (sorts.title) {
      const { direction: titleDirection } = sorts.title;

      orderByInput.title = getOrderDirection(titleDirection);
    }

    if (sorts.commentsCount) {
      const { direction: commentsCountDirection } = sorts.commentsCount;

      orderByInput.commentsCount = getOrderDirection(commentsCountDirection);
    }

    if (sorts.rating) {
      const { direction: ratingDirection } = sorts.rating;

      orderByInput.rating = getOrderDirection(ratingDirection);
    }

    if (sorts.createdAt) {
      const { direction: createdAtDirection } = sorts.createdAt;

      orderByInput.createdAt = getOrderDirection(createdAtDirection);
    }

    return orderByInput;
  }

  async findMultiple(
    filters: ArticleFilters,
    sorts: ArticleSorts,
    offset: number,
    limit: number,
  ): Promise<[boolean, number, number, Article[]]> {
    const articlesWhereInput = this.getWhereInput(filters);
    const articlesOrderByInput = this.getOrderByInput(sorts);
    const take = Math.min(limit, this.articlesConfigService.listMaxLimit);

    try {
      const [articles, totalArticles] = await this.prisma.$transaction([
        this.prisma.article.findMany({
          where: articlesWhereInput,
          orderBy: articlesOrderByInput,
          skip: offset,
          take,
          include: {
            hubs: {
              include: {
                hub: true,
              },
            },
            tags: {
              include: {
                tag: true,
              },
            },
          },
        }),
        this.prisma.article.count({ where: articlesWhereInput }),
      ]);

      return [true, take, totalArticles, articles];
    } catch (error) {
      this.logger.error(error);

      return [false, 0, 0, []];
    }
  }
}
