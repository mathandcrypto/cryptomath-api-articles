import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { HubLogo as HubLogoPrisma } from '@prisma/client';
import { HubLogo as HubLogoProto } from 'cryptomath-api-proto/types/articles';

@Injectable()
export class HubLogoSerializerService extends BaseSerializerService<
  HubLogoPrisma,
  HubLogoProto
> {
  async serialize(hubLogo: HubLogoPrisma): Promise<HubLogoProto> {
    return {
      id: hubLogo.id,
      key: hubLogo.key,
      url: hubLogo.url,
    };
  }
}
