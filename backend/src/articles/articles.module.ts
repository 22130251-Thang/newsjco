import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, DatabaseService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
