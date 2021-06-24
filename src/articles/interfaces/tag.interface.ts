import { Tag as TagPrisma } from '@prisma/client';
import { Hub } from './hub.interface';

export interface Tag extends TagPrisma {
  hub: Hub;
}
