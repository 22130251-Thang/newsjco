import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [ReactionsController],
  providers:  [ReactionsService, DatabaseService],
  exports: [ReactionsService],
})
export class ReactionsModule {}