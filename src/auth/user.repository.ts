import {
  EntityRepository,
  Repository
}                             from "typeorm";
import * as bcrypt from 'bcryptjs';
import { User }               from "./user.entity";
import { AuthCredentialsDto } from "./dto";
import {
  ConflictException,
  InternalServerErrorException
}                             from "@nestjs/common";

@EntityRepository(User)
export class UserRepository
  extends Repository<User> {

  async signUp(authCredentials: AuthCredentialsDto): Promise<void> {
    const {
      username,
      password
    } = authCredentials;
    const salt = await bcrypt.genSalt()

    const user = new User();
    user.username = username;
    user.password = await this.hashPassword(password, salt);
    user.salt = salt;

    try {
      await user.save();
    } catch (e) {
      if (e.code == 23505 || e.code == '23505') { // duplicate username error
        throw new ConflictException("Username already exists");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const {username, password} = authCredentialsDto
    const user = await this.findOne({username})
    if(user && await user.validatePassword(password)) {
      return user.username
    } else {
      return null
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt)
  }
}
