import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@providers/prisma/prisma.service';
import {
  TagsFilters,
  TagsSorts,
} from '@cryptomath/cryptomath-api-proto/types/articles';
import { ArticlesConfigService } from '@config/articles/config.service';
import { Prisma } from '@prisma/client';
import { Tag } from './interfaces/tag.interface';
import { SearchService } from '@providers/rmq/search/search.service';
import { getNumericFilterCondition } from '@common/helpers/filters';
import { getOrderDirection } from '@common/helpers/sorts';
import { InsertDocumentResponse } from '@cryptomath/cryptomath-api-message-types';
import { HubsService } from './hubs.service';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly articlesConfigService: ArticlesConfigService,
    private readonly searchService: SearchService,
    private readonly hubsService: HubsService,
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

  protected getOrderByInput(
    sorts: TagsSorts,
  ): Prisma.TagOrderByWithRelationInput[] {
    const orderByInput = [] as Prisma.TagOrderByWithRelationInput[];

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

  async findFromList(tagsIds: number[]): Promise<[boolean, Tag[]]> {
    try {
      const tags = await this.prisma.tag.findMany({
        where: { id: { in: tagsIds } },
        include: {
          hub: {
            include: {
              logo: true,
            },
          },
        },
      });

      return [true, tags];
    } catch (error) {
      this.logger.error(error);

      return [false, []];
    }
  }

  async createTag(
    hubId: number,
    name: string,
    description: string,
  ): Promise<[boolean, Tag]> {
    try {
      const hub = await this.prisma.hub.findUnique({
        where: { id: hubId },
      });

      if (!hub || !hub.searchId) {
        return [false, null];
      }

      const tag = await this.prisma.tag.create({
        data: {
          hubId,
          name,
          description,
        },
        include: {
          hub: true,
        },
      });

      await this.hubsService.updateHubStats(hubId);

      this.searchService
        .insertTagDocument(tag.id, hub.id, hub.searchId, name, description)
        .subscribe({
          next: (response) => this.updateTagSearch(hubId, tag.id, response),
          error: (error) => {
            this.logger.error(
              `Failed to create tag index. Tag id: ${tag.id}. Error: ${error}`,
            );
          },
        });

      return [true, tag];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async updateTagSearch(
    hubId: number,
    tagId: number,
    { isDocumentCreated, documentId }: InsertDocumentResponse,
  ) {
    if (!isDocumentCreated) {
      this.logger.error(
        `Search index of the tag has not been created. Tag id: ${tagId}`,
      );
    } else {
      try {
        const hub = await this.prisma.hub.findUnique({ where: { id: hubId } });

        if (!hub || !hub.searchId) {
          this.logger.error(
            `Failed to update tag search id. Hub doesn't exists or invalid search id. Hub id: ${hubId}. Tag id: ${tagId}. Document id: ${documentId}`,
          );
        }

        await this.prisma.tag.update({
          where: {
            id: tagId,
          },
          data: {
            searchId: documentId,
          },
        });

        this.searchService
          .updateHubStats(hub.searchId, hub.articlesCount, hub.tagsCount)
          .subscribe({
            error: (error) => {
              this.logger.error(
                `Failed to update hub search stats. Document id: ${hub.searchId}. Error: ${error}`,
              );
            },
          });
      } catch (error) {
        this.logger.error(
          `Failed to update tag search id. Tag id: ${tagId}. Document id: ${documentId}. Error message: ${error.message}`,
        );
      }
    }
  }
}
