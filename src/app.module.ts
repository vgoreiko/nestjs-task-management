import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const username = process.env.DATABASE_USERNAME || config.get('DATABASE_USERNAME');
        const password = process.env.DATABASE_PASSWORD || config.get('DATABASE_PASSWORD');
        const database = process.env.DATABASE_NAME || config.get('DATABASE_NAME');
        const host = process.env.DATABASE_HOST || config.get('DATABASE_HOST');
        const port = Number(process.env.DATABASE_PORT) || config.get('DATABASE_PORT');
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
