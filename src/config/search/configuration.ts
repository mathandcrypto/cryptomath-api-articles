import { registerAs } from '@nestjs/config';
import { SearchConfig } from './interfaces/search-config.interface';

export default registerAs<SearchConfig>('search', () => ({
  rmqUser: process.env.SEARCH_SERVICE_RABBITMQ_USER,
  rmqPassword: process.env.SEARCH_SERVICE_RABBITMQ_PASSWORD,
  rmqHost: process.env.SEARCH_SERVICE_RABBITMQ_HOST,
  rmqQueueName: process.env.SEARCH_SERVICE_RABBITMQ_QUEUE_NAME,
}));
