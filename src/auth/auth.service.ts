import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePasswords } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    console.log('user:', user);
    const isValidPassword = await comparePasswords(password, user.password);
    if (!user || !isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.email, sub: user._id };

    return { access_token: this.jwtService.sign(payload) };
  }
}
