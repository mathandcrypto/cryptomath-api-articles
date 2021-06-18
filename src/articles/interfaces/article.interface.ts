import {
  Article as ArticlePrisma,
  HubsOnArticles,
  Hub,
  TagsOnArticles,
  Tag,
} from '@prisma/client';

export interface Article extends ArticlePrisma {
  hubs?: (HubsOnArticles & { hub: Hub })[];
  tags?: (TagsOnArticles & { tag: Tag })[];
}
