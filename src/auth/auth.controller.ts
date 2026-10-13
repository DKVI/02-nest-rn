import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  create(@Body() createAuthDto: CreateAuthDto) {
    console.log(
      'username:',
      createAuthDto.username,
      'password:',
      createAuthDto.password,
    );
    return this.authService.signIn(
      createAuthDto.username,
      createAuthDto.password,
    );
  }
}
