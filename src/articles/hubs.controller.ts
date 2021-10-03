import { Controller } from '@nestjs/common';
import {
  HubsServiceController,
  HubsServiceControllerMethods,
  CreateHubRequest,
  CreateHubResponse,
  FindHubRequest,
  FindHubResponse,
  FindHubLogoRequest,
  FindHubLogoResponse,
  CreateHubLogoRequest,
  CreateHubLogoResponse,
  DeleteHubLogoRequest,
  DeleteHubLogoResponse,
  FindHubsRequest,
  FindHubsResponse,
  FindHubsFromListRequest,
  FindHubsFromListResponse,
  FindHubSearchIdRequest,
  FindHubSearchIdResponse,
  Hub as HubProto,
} from '@cryptomath/cryptomath-api-proto/types/articles';
import { Hub } from './interfaces/hub.interface';
import { HubsService } from './hubs.service';
import { HubSerializerService } from './serializers/hub.serializer';
import { HubLogoSerializerService } from './serializers/hub-logo.serializer';

@Controller()
@HubsServiceControllerMethods()
export class HubsController implements HubsServiceController {
  constructor(
    private readonly hubsService: HubsService,
    private readonly hubSerializerService: HubSerializerService,
    private readonly hubLogoSerializerService: HubLogoSerializerService,
  ) {}

  async findHubs({
    filters,
    sorts,
    offset,
    limit,
  }: FindHubsRequest): Promise<FindHubsResponse> {
    const [isHubsFound, skippedHubs, totalHubs, hubs] =
      await this.hubsService.findMultiple(filters, sorts, offset, limit);

    if (!isHubsFound) {
      return {
        isHubsFound: false,
        limit,
        total: 0,
        hubs: [],
      };
    }

    return {
      isHubsFound: true,
      limit: skippedHubs,
      total: totalHubs,
      hubs: await this.hubSerializerService.serializeCollection(hubs),
    };
  }

  private async prepareHubsMap(
    hubs: Hub[],
  ): Promise<{ [key: number]: HubProto }> {
    const hubsMap = {} as { [key: number]: HubProto };
    const serializedHubs = await Promise.all(
      hubs.map((hub) => this.hubSerializerService.serialize(hub)),
    );

    serializedHubs.forEach((hub) => {
      hubsMap[hub.id] = hub;
    });

    return hubsMap;
  }

  async findHubsFromList({
    idList,
  }: FindHubsFromListRequest): Promise<FindHubsFromListResponse> {
    const [isHubsFound, hubs] = await this.hubsService.findFromList(idList);

    if (!isHubsFound) {
      return {
        isHubsFound: false,
        hubs: {},
      };
    }

    return {
      isHubsFound: true,
      hubs: await this.prepareHubsMap(hubs),
    };
  }

  async findHub({ hubId }: FindHubRequest): Promise<FindHubResponse> {
    const [isHubExists, hub] = await this.hubsService.findOne(hubId);

    if (!isHubExists) {
      return {
        isHubExists: false,
        hub: null,
      };
    }

    return {
      isHubExists: true,
      hub: await this.hubSerializerService.serialize(hub),
    };
  }

  async findHubLogo({
    hubId,
  }: FindHubLogoRequest): Promise<FindHubLogoResponse> {
    const [isLogoExists, logo] = await this.hubsService.findLogo(hubId);

    if (!isLogoExists) {
      return {
        isLogoExists: false,
        logo: null,
      };
    }

    return {
      isLogoExists: true,
      logo: await this.hubLogoSerializerService.serialize(logo),
    };
  }

  async createHubLogo({
    hubId,
    key,
    url,
  }: CreateHubLogoRequest): Promise<CreateHubLogoResponse> {
    const [isLogoExists] = await this.hubsService.findLogo(hubId);

    if (isLogoExists) {
      return {
        isLogoCreated: false,
        isLogoAlreadyExists: true,
        logo: null,
      };
    }

    const [isLogoCreated, logoId] = await this.hubsService.createLogo(
      hubId,
      key,
      url,
    );

    if (!isLogoCreated) {
      return {
        isLogoCreated: false,
        isLogoAlreadyExists: false,
        logo: null,
      };
    }

    return {
      isLogoCreated: true,
      isLogoAlreadyExists: false,
      logo: {
        id: logoId,
        key,
        url,
      },
    };
  }

  async deleteHubLogo({
    hubId,
    logoId,
  }: DeleteHubLogoRequest): Promise<DeleteHubLogoResponse> {
    const [isLogoDeleted, logo] = await this.hubsService.deleteLogo(
      hubId,
      logoId,
    );

    if (!isLogoDeleted) {
      return {
        isLogoDeleted: false,
        logo: null,
      };
    }

    return {
      isLogoDeleted: true,
      logo: await this.hubLogoSerializerService.serialize(logo),
    };
  }

  async creteHub({
    name,
    description,
  }: CreateHubRequest): Promise<CreateHubResponse> {
    const [createHubStatus, hub] = await this.hubsService.createHub(
      name,
      description,
    );

    if (!createHubStatus) {
      return {
        isHubCreated: false,
        hub: null,
      };
    }

    return {
      isHubCreated: true,
      hub: await this.hubSerializerService.serialize(hub),
    };
  }

  async findHubSearchId({
    hubId,
  }: FindHubSearchIdRequest): Promise<FindHubSearchIdResponse> {
    const [isHubSearchIdExists, searchId] = await this.hubsService.findSearchId(
      hubId,
    );

    return {
      isHubIndexed: isHubSearchIdExists,
      documentId: searchId,
    };
  }
}
