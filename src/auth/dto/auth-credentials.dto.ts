import {
  IsNotEmpty,
  IsString,
  Length,
  Matches
} from "class-validator";

export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 25)
  username: string

  @IsNotEmpty()
  @IsString()
  @Length(5, 25)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password to weak'})
  password: string
}
