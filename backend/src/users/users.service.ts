import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/types/user.type';
import { RegisterRequestDto } from 'src/auth/dto/registerRequestDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) { }

  create(registerRequestDto: RegisterRequestDto) {
    return this.databaseService.create<User>('users', registerRequestDto);
  }

  findByUserName(username: string) {
    const user = this.databaseService.findOneBy<User>(
      'users',
      'username',
      username,
    );
    if (!user) {
      throw new NotFoundException(`User not found with username ${username}`);
    }
    return user;
  }

  findByUserNameOrEmail(username: string, email: string): User | null {
    const userByName = this.databaseService.findOneBy<User>(
      'users',
      'username',
      username,
    );
    if (userByName) return userByName;

    const userByEmail = this.databaseService.findOneBy<User>(
      'users',
      'useremail',
      email,
    );
    return userByEmail || null;
  }

  findAll() {
    return this.databaseService.findAll<User>('users');
  }

  findOne(id: number) {
    return this.databaseService.findById<User>('users', id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.databaseService.update<User>('users', id, updateUserDto);
  }

  remove(id: number) {
    return this.databaseService.remove<User>('users', id);
  }

  updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = this.findOne(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const updatedData: Partial<User> = {
      ...updateProfileDto,
      updatedAt: new Date().toISOString(),
    };

    const updatedUser = this.databaseService.update<User>('users', userId, updatedData);
    if (updatedUser) {
      const { password, ...result } = updatedUser;
      return result;
    }
    return null;
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp');
    }

    if (newPassword.length < 6) {
      throw new BadRequestException('Mật khẩu mới phải có ít nhất 6 ký tự');
    }

    const user = this.findOne(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = this.databaseService.update<User>('users', userId, {
      password: hashedPassword,
      updatedAt: new Date().toISOString(),
    });

    return { message: 'Đổi mật khẩu thành công' };
  }

  updateAvatar(userId: number, avatarUrl: string) {
    const user = this.findOne(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const updatedUser = this.databaseService.update<User>('users', userId, {
      avatar: avatarUrl,
      updatedAt: new Date().toISOString(),
    });

    if (updatedUser) {
      const { password, ...result } = updatedUser;
      return result;
    }
    return null;
  }
}