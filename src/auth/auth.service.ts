import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/users.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';

type SafeUser = Pick<User, 'id' | 'username' | 'isActive'>;
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async signIn(loginDto: LoginDto): Promise<SafeUser> {
    const user = await this.usersService.findOneForAuth(loginDto.username);

    if (!user) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    const isPasswordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }
}
