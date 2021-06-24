import {
  Article as ArticlePrisma,
  HubsOnArticles,
  TagsOnArticles,
} from '@prisma/client';
import { Hub } from './hub.interface';
import { Tag } from './tag.interface';

export interface Article extends ArticlePrisma {
  hubs?: (HubsOnArticles & { hub: Hub })[];
  tags?: (TagsOnArticles & { tag: Tag })[];
}
