import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @Length(6, 100)
  email: string;

  @IsNotEmpty()
  @Length(8, 15)
  password: string;
}
