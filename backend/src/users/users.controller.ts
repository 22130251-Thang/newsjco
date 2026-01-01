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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterRequestDto } from 'src/auth/dto/registerRequestDto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { multerConfig } from 'src/config/multer.config';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

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

  @UseGuards(JwtAuthGuard)
  @Patch('user/profile')
  updateProfile(
    @Request() req: { user: { userId: number } },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user/password')
  changePassword(
    @Request() req: { user: { userId: number } },
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(req.user.userId, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user/avatar')
  updateAvatar(
    @Request() req: { user: { userId: number } },
    @Body() body: { avatar: string },
  ) {
    return this.usersService.updateAvatar(req.user.userId, body.avatar);
  }

  @UseGuards(JwtAuthGuard)
  @Post('user/avatar/upload')
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  uploadAvatar(
    @Request() req: { user: { userId: number } },
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('Không có file nào được upload');
      }
      const avatarUrl = `/avatars/${file.filename}`;
      return this.usersService.updateAvatar(req.user.userId, avatarUrl);
    } catch (error) {
      throw new BadRequestException(error.message || 'Upload thất bại');
    }
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
    return this.usersService.findAll();
  }

  @Get('users/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('users/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('users/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}