import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsMongoId({ message: 'Invalid user ID format' })
  @IsNotEmpty({ message: 'User ID is required' })
  _id: string;
  @IsOptional()
  @IsPhoneNumber(null, { message: 'Invalid phone number format' })
  phone: string;
  @IsOptional()
  address: string;
  @IsOptional()
  image: string;
}
