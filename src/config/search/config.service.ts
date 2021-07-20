import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchConfigService {
  constructor(private configService: ConfigService) {}

  get rmqUser(): string {
    return this.configService.get<string>('search.rmqUser');
  }

  get rmqPassword(): string {
    return this.configService.get<string>('search.rmqPassword');
  }

  get rmqHost(): string {
    return this.configService.get<string>('search.rmqHost');
  }

  get rmqQueueName(): string {
    return this.configService.get<string>('search.rmqQueueName');
  }

  get rmqUrl(): string {
    return `amqp://${this.rmqUser}:${this.rmqPassword}@${this.rmqHost}`;
  }
}
