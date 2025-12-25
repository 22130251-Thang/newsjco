import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/types/user.type';
import { LoginRequestDto } from './dto/loginRequestDto';
import { RegisterRequestDto } from './dto/registerRequestDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(loginRequestDto: LoginRequestDto) {
    const user: User = this.userService.findByUserName(
      loginRequestDto.username,
    );
    const isPasswordMatch = await bcrypt.compare(
      loginRequestDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new BadRequestException('Tài khoản hoặc mật khẩu sai');
    }
    const payload = { username: loginRequestDto.username, userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerRequestDto: RegisterRequestDto) {
    const existingUser = this.userService.findByUserNameOrEmail(
      registerRequestDto.username,
      registerRequestDto.useremail,
    );

    if (existingUser) {
      throw new BadRequestException('Username hoặc email đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(registerRequestDto.password, 10);
    const newUser = await this.userService.create({
      ...registerRequestDto,
      password: hashedPassword,
    });

    const payload = { username: newUser.username, userId: newUser.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
