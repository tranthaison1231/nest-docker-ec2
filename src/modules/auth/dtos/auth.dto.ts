import { IsEmail } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  firstName: string;
  lastName: string;

  phoneNumber: string;

  salt: string;

  password: string;

  isVerified: boolean;

  avatarURL: string;
}

export class SignInDto {
  @IsEmail()
  email: string;

  password: string;
}
