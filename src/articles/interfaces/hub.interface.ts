import { Hub as HubPrisma, HubLogo } from '@prisma/client';

export interface Hub extends HubPrisma {
  logo?: HubLogo;
}
