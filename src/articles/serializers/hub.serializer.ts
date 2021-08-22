import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { Hub } from '../interfaces/hub.interface';
import { Hub as HubProto } from '@cryptomath/cryptomath-api-proto/types/articles';
import { HubLogoSerializerService } from './hub-logo.serializer';

@Injectable()
export class HubSerializerService extends BaseSerializerService<Hub, HubProto> {
  constructor(
    private readonly hubLogoSerializerService: HubLogoSerializerService,
  ) {
    super();
  }

  async serialize(hub: Hub): Promise<HubProto> {
    return {
      id: hub.id,
      name: hub.name,
      description: hub.description,
      logo: hub.logo
        ? await this.hubLogoSerializerService.serialize(hub.logo)
        : null,
      articlesCount: hub.articlesCount,
      tagsCount: hub.tagsCount,
    };
  }
}
