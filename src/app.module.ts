import { Module } from '@nestjs/common';
import { AppConfigModule } from '@config/app/config.module';
import { ArticlesModule } from '@articles/articles.module';

@Module({
  imports: [AppConfigModule, ArticlesModule],
})
export class AppModule {}
