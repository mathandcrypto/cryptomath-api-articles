import { Module } from '@nestjs/common';
import { SearchConfigModule } from '@config/search/config.module';
import { SearchConfigService } from '@config/search/config.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SearchService } from './search.service';

@Module({
  imports: [SearchConfigModule],
  providers: [
    {
      provide: 'SEARCH_SERVICE',
      inject: [SearchConfigService],
      useFactory: (searchConfigService: SearchConfigService) => {
        const { rmqUrl, rmqQueueName } = searchConfigService;

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [rmqUrl],
            queue: rmqQueueName,
          },
        });
      },
    },
    SearchService,
  ],
  exports: [SearchService],
})
export class SearchModule {}
