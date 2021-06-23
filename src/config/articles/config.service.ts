import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArticlesConfigService {
  constructor(private configService: ConfigService) {}

  get articlesListMaxLimit(): number {
    return this.configService.get<number>('articles.articlesListMaxLimit');
  }

  get hubsListMaxLimit(): number {
    return this.configService.get<number>('articles.hubsListMaxLimit');
  }
}
