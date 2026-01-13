import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { DatabaseService } from 'src/database/database.service';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [UsersModule, NotificationsModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, DatabaseService],
  exports: [ArticlesService],
})
export class ArticlesModule {}