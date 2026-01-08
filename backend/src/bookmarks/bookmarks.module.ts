import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [BookmarksController],
  providers: [BookmarksService, DatabaseService],
  exports: [BookmarksService],
})
export class BookmarksModule {}
