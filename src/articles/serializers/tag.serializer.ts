import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { Tag as TagPrisma } from '@prisma/client';
import { Tag as TagProto } from 'cryptomath-api-proto/types/articles';

@Injectable()
export class TagSerializerService extends BaseSerializerService<
  TagPrisma,
  TagProto
> {
  async serialize(tag: TagPrisma): Promise<TagProto> {
    return {
      id: tag.id,
      name: tag.name,
      description: tag.description,
      articlesCount: tag.articlesCount,
    };
  }
}
