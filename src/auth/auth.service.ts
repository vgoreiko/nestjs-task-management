import {
  Injectable,
  UnauthorizedException
}                              from "@nestjs/common";
import { InjectRepository }    from "@nestjs/typeorm";
import { UserRepository }      from "./user.repository";
import { AuthCredentialsDto }  from "./dto";
import { User }                from "./user.entity";
import { JwtService }          from "@nestjs/jwt";
import { JwtPayloadInterface } from "./jwt-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService) {

  }

  async signUp(authCredentials: AuthCredentialsDto) {
    return this.userRepository.signUp(authCredentials)
  }

  async getUserData(id: number): Promise<User> {
    return this.userRepository.findOne({id})
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
    const username = await this.userRepository.validateUserPassword(authCredentialsDto)
    if(username) {
      const payload = {username}
      const accessToken = await this.jwtService.sign(payload)
      return {accessToken}
    } else {
      throw new UnauthorizedException('Invalid credentials')
    }
  }
}
