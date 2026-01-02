import { Module } from '@nestjs/common';
import { ViewHistoryService } from './view-history.service';
import { ViewHistoryController } from './view-history.controller';

@Module({
    controllers: [ViewHistoryController],
    providers: [ViewHistoryService],
    exports: [ViewHistoryService],
})
export class ViewHistoryModule { }
