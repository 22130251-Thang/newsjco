import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { DatabaseService } from 'src/database/database.service';
import { ArticlesModule } from 'src/articles/articles.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [ArticlesModule, UsersModule],
    controllers: [CommentsController],
    providers: [CommentsService, DatabaseService],
})
export class CommentsModule { }
