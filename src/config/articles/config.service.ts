import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArticlesConfigService {
  constructor(private configService: ConfigService) {}

  get listMaxLimit(): number {
    return this.configService.get<number>('articles.listMaxLimit');
  }
}
