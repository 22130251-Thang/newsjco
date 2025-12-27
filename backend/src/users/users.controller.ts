import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterRequestDto } from 'src/auth/dto/registerRequestDto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('user/profile')
  getProfile(@Request() req: { user: { userId: number; username: string } }) {
    const user = this.usersService.findOne(req.user.userId);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Update profile
  @UseGuards(JwtAuthGuard)
  @Patch('user/profile')
  updateProfile(
    @Request() req: { user: { userId: number } },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  // Change password
  @UseGuards(JwtAuthGuard)
  @Patch('user/password')
  changePassword(
    @Request() req: { user: { userId: number } },
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService. changePassword(req.user.userId, changePasswordDto);
  }

  // Update avatar
  @UseGuards(JwtAuthGuard)
  @Patch('user/avatar')
  updateAvatar(
    @Request() req: { user: { userId: number } },
    @Body() body: { avatar: string },
  ) {
    return this.usersService. updateAvatar(req.user. userId, body.avatar);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user/theme')
  updateTheme(
    @Request() req: { user: { userId: number } },
    @Body() body: { theme: 'light' | 'dark' },
  ) {
    return this.usersService.update(req.user.userId, { theme: body.theme });
  }

  @Post('users')
  create(@Body() registerRequestDto: RegisterRequestDto) {
    return this.usersService.create(registerRequestDto);
  }

  @Get('users')
  findAll() {
    return this.usersService. findAll();
  }

  @Get('users/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('users/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService. update(+id, updateUserDto);
  }

  @Delete('users/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}