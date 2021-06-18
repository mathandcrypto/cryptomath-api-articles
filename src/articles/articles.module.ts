import { Module } from '@nestjs/common';
import { PrismaModule } from '@providers/prisma/prisma.module';
import { ArticlesConfigModule } from '@config/articles/config.module';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleSerializerService } from './serializers/article.serializer';

@Module({
  imports: [PrismaModule, ArticlesConfigModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, ArticleSerializerService],
})
export class ArticlesModule {}
