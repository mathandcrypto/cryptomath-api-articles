import { Controller } from '@nestjs/common';
import {
  TagsServiceController,
  TagsServiceControllerMethods,
  CreateTagRequest,
  CreateTagResponse,
  FindTagRequest,
  FindTagResponse,
  FindTagsRequest,
  FindTagsResponse,
  FindTagsFromListRequest,
  FindTagsFromListResponse,
  Tag as TagProto,
} from '@cryptomath/cryptomath-api-proto/types/articles';
import { Tag } from './interfaces/tag.interface';
import { TagsService } from './tags.service';
import { TagSerializerService } from './serializers/tag.serializer';

@Controller()
@TagsServiceControllerMethods()
export class TagsController implements TagsServiceController {
  constructor(
    private readonly tagsService: TagsService,
    private readonly tagSerializerService: TagSerializerService,
  ) {}

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

  private async prepareTagsMap(
    tags: Tag[],
  ): Promise<{ [key: number]: TagProto }> {
    const tagsMap = {} as { [key: number]: TagProto };
    const serializedTags = await Promise.all(
      tags.map((tag) => this.tagSerializerService.serialize(tag)),
    );

    serializedTags.forEach((tag) => {
      tagsMap[tag.id] = tag;
    });

    return tagsMap;
  }

  async findTagsFromList({
    idList,
  }: FindTagsFromListRequest): Promise<FindTagsFromListResponse> {
    const [isTagsFound, tags] = await this.tagsService.findFromList(idList);

    if (!isTagsFound) {
      return {
        isTagsFound: false,
        tags: {},
      };
    }

    return {
      isTagsFound: true,
      tags: await this.prepareTagsMap(tags),
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

  async createTag({
    hubId,
    name,
    description,
  }: CreateTagRequest): Promise<CreateTagResponse> {
    const [createTagStatus, tag] = await this.tagsService.createTag(
      hubId,
      name,
      description,
    );

    if (!createTagStatus) {
      return {
        isTagCreated: false,
        tag: null,
      };
    }

    return {
      isTagCreated: true,
      tag: await this.tagSerializerService.serialize(tag),
    };
  }
}
