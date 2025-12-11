import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/types/user.type';
import { RegisterRequestDto } from 'src/auth/dto/registerRequestDto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) { }

  create(registerRequestDto: RegisterRequestDto) {
    return this.databaseService.create<User>('users', registerRequestDto);
  }

  findByUserName(username: string) {
    const user = this.databaseService.findOneBy<User>('users', 'username', username);
    if (!user) {
      throw new NotFoundException(`User not found with username ${username}`);
    }
    return user;
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
}
