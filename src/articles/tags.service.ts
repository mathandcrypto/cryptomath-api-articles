import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@providers/prisma/prisma.service';
import { TagsFilters, TagsSorts } from 'cryptomath-api-proto/types/articles';
import { ArticlesConfigService } from '@config/articles/config.service';
import { Prisma } from '@prisma/client';
import { Tag } from './interfaces/tag.interface';
import { getNumericFilterCondition } from '@common/helpers/filters';
import { getOrderDirection } from '@common/helpers/sorts';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly articlesConfigService: ArticlesConfigService,
  ) {}

  protected getWhereInput(filters: TagsFilters): Prisma.TagWhereInput {
    const whereInput = {} as Prisma.TagWhereInput;

    if (filters.id) {
      const { id: tagId } = filters.id;

      whereInput.id = tagId;
    }

    if (filters.name) {
      const { text: tagName } = filters.name;

      whereInput.name = { contains: tagName };
    }

    if (filters.hub) {
      const { id: hubId } = filters.hub;

      whereInput.hubId = hubId;
    }

    if (filters.articles) {
      const {
        equals: articlesEqual,
        min: articlesMin,
        max: articlesMax,
      } = filters.articles;

      whereInput.articlesCount = getNumericFilterCondition(
        articlesEqual,
        articlesMin,
        articlesMax,
      );
    }

    return whereInput;
  }

  protected getOrderByInput(sorts: TagsSorts): Prisma.TagOrderByInput[] {
    const orderByInput = [] as Prisma.TagOrderByInput[];

    if (sorts.name) {
      const { direction: nameDirection } = sorts.name;

      orderByInput.push({ name: getOrderDirection(nameDirection) });
    }

    if (sorts.articles) {
      const { direction: articlesDirection } = sorts.articles;

      orderByInput.push({
        articlesCount: getOrderDirection(articlesDirection),
      });
    }

    return orderByInput;
  }

  async findMultiple(
    filters: TagsFilters,
    sorts: TagsSorts,
    offset: number,
    limit: number,
  ): Promise<[boolean, number, number, Tag[]]> {
    const tagsWhereInput = this.getWhereInput(filters);
    const tagsOrderByInput = this.getOrderByInput(sorts);
    const take = Math.min(limit, this.articlesConfigService.tagsListMaxLimit);

    try {
      const [tags, totalTags] = await this.prisma.$transaction([
        this.prisma.tag.findMany({
          where: tagsWhereInput,
          orderBy: tagsOrderByInput,
          skip: offset,
          take,
          include: {
            hub: {
              include: {
                logo: true,
              },
            },
          },
        }),
        this.prisma.tag.count({ where: tagsWhereInput }),
      ]);

      return [true, take, totalTags, tags];
    } catch (error) {
      this.logger.error(error);

      return [false, 0, 0, []];
    }
  }

  async findOne(tagId: number): Promise<[boolean, Tag]> {
    try {
      const tag = await this.prisma.tag.findUnique({
        where: { id: tagId },
        include: {
          hub: {
            include: {
              logo: true,
            },
          },
        },
      });

      if (!tag) {
        return [false, null];
      }

      return [true, tag];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }
}
