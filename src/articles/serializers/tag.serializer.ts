import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { Tag } from '../interfaces/tag.interface';
import { Tag as TagProto } from 'cryptomath-api-proto/types/articles';
import { HubSerializerService } from './hub.serializer';

@Injectable()
export class TagSerializerService extends BaseSerializerService<Tag, TagProto> {
  constructor(private readonly hubSerializerService: HubSerializerService) {
    super();
  }

  async serialize(tag: Tag): Promise<TagProto> {
    return {
      id: tag.id,
      name: tag.name,
      description: tag.description,
      hub: await this.hubSerializerService.serialize(tag.hub),
      articlesCount: tag.articlesCount,
    };
  }
}
