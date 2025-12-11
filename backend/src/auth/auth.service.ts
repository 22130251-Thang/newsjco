import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/types/user.type';
import { LoginRequestDto } from './dto/loginRequestDto';
import { RegisterRequestDto } from './dto/registerRequestDto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) { }
  async login(loginRequestDto: LoginRequestDto) {
    const user: User = this.userService.findByUserName(
      loginRequestDto.username,
    );
    if (user.password === loginRequestDto.password) {
      const payload = { username: loginRequestDto.username, userId: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new BadRequestException(`Tài khoản hoặc mật khẩu sai`)
  }
  async register(registerRequestDto: RegisterRequestDto) {
    return this.userService.create(registerRequestDto)
  }
}
