import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterRequestDto } from 'src/auth/dto/registerRequestDto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
