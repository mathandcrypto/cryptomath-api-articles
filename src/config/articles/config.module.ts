import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { ArticlesConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        ARTICLES_LIST_MAX_LIMIT: Joi.number().min(10).max(50),
      }),
    }),
  ],
  providers: [ConfigService, ArticlesConfigService],
  exports: [ArticlesConfigService],
})
export class ArticlesConfigModule {}
