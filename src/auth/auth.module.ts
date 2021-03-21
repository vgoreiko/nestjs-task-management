import { Module }         from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService }    from "./auth.service";
import { TypeOrmModule }  from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { JwtModule }      from "@nestjs/jwt";
import {
  ConfigModule,
  ConfigService
}                         from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy }    from "./jwt-strategy";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = process.env.JWT_SECRET || config.get("JWT_SECRET");
        return {
          secret,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRES_IN || 3600
          }
        };
      }
    }),
    TypeOrmModule.forFeature([UserRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {
}
