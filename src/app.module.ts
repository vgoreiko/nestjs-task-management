import {
  Module
} from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_DATABASE: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        SERVER_ORIGIN: Joi.string(),
        SERVER_PORT: Joi.number().default(3000)
      }),
      cache: true,
    }, ),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const username = process.env.DB_DATABASE || config.get('DB_DATABASE');
        const password = process.env.DB_PASSWORD || config.get('DB_PASSWORD');
        const database = process.env.DATABASE_NAME || config.get('DB_USERNAME');
        const host = process.env.DB_HOST || config.get('DB_HOST');
        const port = Number(process.env.DB_PORT) || config.get('DB_PORT');
        return {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          username,
          password,
          database,
          host,
          port,
        };
      },
      inject: [ConfigService],
    }),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
