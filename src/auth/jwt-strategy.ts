import { PassportStrategy }    from "@nestjs/passport";
import { Strategy, ExtractJwt} from 'passport-jwt'
import {
  Injectable,
  UnauthorizedException
}                              from "@nestjs/common";
import { ConfigService }       from "@nestjs/config";
import { JwtPayloadInterface } from "./jwt-payload.interface";
import { InjectRepository }    from "@nestjs/typeorm";
import { UserRepository }      from "./user.repository";
import { User }                from "./user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService,
    @InjectRepository(UserRepository) private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  async validate(payload: JwtPayloadInterface): Promise<User> {
    const {username} = payload
    const user = await this.userRepository.findOne({username})
    if(!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
