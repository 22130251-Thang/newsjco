import { Module } from '@nestjs/common';
import { ViewHistoryService } from './view-history.service';
import { ViewHistoryController } from './view-history.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [ViewHistoryController],
  providers: [ViewHistoryService, DatabaseService],
  exports: [ViewHistoryService],
})
export class ViewHistoryModule {}
