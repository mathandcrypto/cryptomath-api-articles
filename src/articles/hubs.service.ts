import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@providers/prisma/prisma.service';
import { SearchService } from '@providers/rmq/search/search.service';
import { HubsFilters, HubsSorts } from 'cryptomath-api-proto/types/articles';
import { Hub } from './interfaces/hub.interface';
import { Prisma } from '@prisma/client';
import { ArticlesConfigService } from '@config/articles/config.service';
import { InsertDocumentResponse } from 'cryptomath-api-message-types';
import { getNumericFilterCondition } from '@common/helpers/filters';
import { getOrderDirection } from '@common/helpers/sorts';

@Injectable()
export class HubsService {
  private readonly logger = new Logger(HubsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly articlesConfigService: ArticlesConfigService,
    private readonly searchService: SearchService,
  ) {}

  protected getWhereInput(filters: HubsFilters): Prisma.HubWhereInput {
    const whereInput = {} as Prisma.HubWhereInput;

    if (filters.id) {
      const { id: hubId } = filters.id;

      whereInput.id = hubId;
    }

    if (filters.name) {
      const { text: hubName } = filters.name;

      whereInput.name = { contains: hubName };
    }

    if (filters.tagsList) {
      const { idList: tagsIdList } = filters.tagsList;

      whereInput.tags = { some: { hubId: { in: tagsIdList } } };
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

    if (filters.tags) {
      const { equals: tagsEqual, min: tagsMin, max: tagsMax } = filters.tags;

      whereInput.tagsCount = getNumericFilterCondition(
        tagsEqual,
        tagsMin,
        tagsMax,
      );
    }

    return whereInput;
  }

  protected getOrderByInput(sorts: HubsSorts): Prisma.HubOrderByInput[] {
    const orderByInput = [] as Prisma.HubOrderByInput[];

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

    if (sorts.tags) {
      const { direction: tagsDirection } = sorts.tags;

      orderByInput.push({ tagsCount: getOrderDirection(tagsDirection) });
    }

    return orderByInput;
  }

  async findMultiple(
    filters: HubsFilters,
    sorts: HubsSorts,
    offset: number,
    limit: number,
  ): Promise<[boolean, number, number, Hub[]]> {
    const hubsWhereInput = this.getWhereInput(filters);
    const hubsOrderByInput = this.getOrderByInput(sorts);
    const take = Math.min(limit, this.articlesConfigService.hubsListMaxLimit);

    try {
      const [hubs, totalHubs] = await this.prisma.$transaction([
        this.prisma.hub.findMany({
          where: hubsWhereInput,
          orderBy: hubsOrderByInput,
          skip: offset,
          take,
          include: {
            logo: true,
          },
        }),
        this.prisma.hub.count({ where: hubsWhereInput }),
      ]);

      return [true, take, totalHubs, hubs];
    } catch (error) {
      this.logger.error(error);

      return [false, 0, 0, []];
    }
  }

  async findOne(hubId: number): Promise<[boolean, Hub]> {
    try {
      const hub = await this.prisma.hub.findUnique({
        where: { id: hubId },
        include: { logo: true },
      });

      if (!hub) {
        return [false, null];
      }

      return [true, hub];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async createHub(name: string, description: string): Promise<[boolean, Hub]> {
    try {
      const hub = await this.prisma.hub.create({
        data: {
          name,
          description,
        },
      });

      const insertDocumentObservable = this.searchService.insertHubDocument(
        hub.id,
        name,
        description,
      );

      insertDocumentObservable.subscribe(
        (response) => this.updateHubSearch(hub.id, response),
        (error) => {
          this.logger.error(
            `Failed to create hub index. Hub id: ${hub.id}. Error: ${error}`,
          );
        },
      );

      return [true, hub];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async updateHubSearch(
    hubId: number,
    { isDocumentCreated, documentId }: InsertDocumentResponse,
  ) {
    if (!isDocumentCreated) {
      this.logger.error(
        `Search index of the hub has not been created. Hub id: ${hubId}`,
      );
    }

    try {
      await this.prisma.hub.update({
        where: {
          id: hubId,
        },
        data: {
          searchId: documentId,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to update hub search id. Hub id: ${hubId}. Document id: ${documentId}. Error message: ${error.message}`,
      );
    }
  }
}
