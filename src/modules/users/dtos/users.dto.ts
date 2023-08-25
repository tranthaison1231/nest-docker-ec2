import { IsEmail } from 'class-validator';

export class CreateUserDto {
  firstName: string;
  lastName: string;

  @IsEmail()
  email: string;

  phoneNumber: string;

  salt: string;

  password: string;

  isVerified: boolean;

  avatarURL: string;
}

export class UpdateUserDto {
  firstName: string;
  lastName: string;
}
