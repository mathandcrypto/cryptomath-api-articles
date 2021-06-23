import { Module } from '@nestjs/common';
import { PrismaModule } from '@providers/prisma/prisma.module';
import { ArticlesConfigModule } from '@config/articles/config.module';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { TagSerializerService } from './serializers/tag.serializer';
import { HubLogoSerializerService } from './serializers/hub-logo.serializer';
import { HubSerializerService } from './serializers/hub.serializer';
import { ArticleSerializerService } from './serializers/article.serializer';

@Module({
  imports: [PrismaModule, ArticlesConfigModule],
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    TagSerializerService,
    HubLogoSerializerService,
    HubSerializerService,
    ArticleSerializerService,
  ],
})
export class ArticlesModule {}
