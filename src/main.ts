import { NestFactory }   from '@nestjs/core';
import { AppModule }     from './app.module';
import { Logger }        from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const env = configService.get('NODE_ENV');
  const origin = configService.get('SERVER_ORIGIN')
  const port = configService.get('SERVER_PORT')

  if(env === 'development') {
    app.enableCors()
  } else {
    app.enableCors({origin})
    logger.log(`Accepting requests from origin ${origin}`)
  }
  await app.listen(port);
  logger.log(`Application listening on port ${port}`)
}
bootstrap();
