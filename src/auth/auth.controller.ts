import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe
}                             from "@nestjs/common";
import { AuthCredentialsDto } from "./dto";
import { AuthService }        from "./auth.service";
import { User }               from "./user.entity";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('/signUp')
  signUp(@Body(ValidationPipe) authCredentials: AuthCredentialsDto){
    return this.authService.signUp(authCredentials)
  }

  @Post('/signIn')
  signIn(@Body(ValidationPipe) authCredentials: AuthCredentialsDto): Promise<{accessToken: string}>{
    return this.authService.signIn(authCredentials)
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.authService.getUserData(id)
  }

}
