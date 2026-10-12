import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  phone: string;

  address: string;

  image: string;
  role: string;

  accountType: string;

  isActive: boolean;

  codeId: string;

  codeExpired: Date;
}
