import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { DatabaseService } from 'src/database/database.service';
import { ArticlesModule } from 'src/articles/articles.module';
import { UsersModule } from 'src/users/users.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { AiModule } from 'src/ai/ai.module';
import { ModerationModule } from 'src/moderation/moderation.module';

@Module({
  imports: [ArticlesModule, UsersModule, NotificationsModule, AiModule, ModerationModule],
  controllers: [CommentsController],
  providers: [CommentsService, DatabaseService],
})
export class CommentsModule { }

