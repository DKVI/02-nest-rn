import { IsEmail, IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  password: string;

  phone: string;

  address: string;

  image: string;

  role: string;
}
