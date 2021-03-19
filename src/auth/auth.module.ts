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
        const secret = config.get("JWT_SECRET");
        return {
          secret,
          signOptions: {
            expiresIn: 3600
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
