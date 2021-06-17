import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from '@config/app/config.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ARTICLES_PACKAGE_NAME } from 'cryptomath-api-proto/types/articles';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfigService = app.get(AppConfigService);

  const { protoFile, url } = appConfigService;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ARTICLES_PACKAGE_NAME,
      protoPath: join(
        process.cwd(),
        'node_modules/cryptomath-api-proto/proto/',
        protoFile,
      ),
      url,
    },
  });

  await app.init();

  app.enableShutdownHooks();

  app.startAllMicroservices(() =>
    console.log(`Articles microservice is listening on ${url}`),
  );
}
bootstrap();
